import asyncio
import re
import aiohttp
import requests
from aiohttp import BasicAuth
from django.http import JsonResponse
from requests.auth import HTTPBasicAuth
from rest_framework.decorators import api_view

from backend.settings import GITHUB_API_TOKEN
from github.constants import GITHUB_URL


def get(url, **kwargs):
    return requests.get(url, auth=HTTPBasicAuth('mo.fromer@gmail.com',GITHUB_API_TOKEN), **kwargs)


def get_page_count(headers):
    try:
        return re.findall('page=([\d]*)>; rel="last"', headers['Link'])[0]
    except KeyError:
        return 0


@api_view(['GET'])
def repos(request):
    query_string = ' '.join(f'{key}:{value}' for key, value in request.GET.items() if value)
    if not query_string:
        return JsonResponse({'message': 'need to enter query'}, status=400)
    params = {
        'per_page': 10,
        'q': query_string
    }
    response = get(f'{GITHUB_URL}/search/repositories', params=params)
    data = response.json()['items']
    loop = asyncio.new_event_loop()
    response_data = loop.run_until_complete(get_response_data(data))
    response_data = {'repos': response_data}
    return JsonResponse(response_data)


async def get_response_data(d):
    data = await asyncio.gather(*[get_required_fields(repo_info) for repo_info in d])
    return data


async def fetch(session, url):
    async with session.get(url, auth=BasicAuth('mo.fromer@gmail.com',GITHUB_API_TOKEN)) as response:
        json = await response.json()
        return {
            'json': json,
            'headers': response.headers
        }


async def fetch_all(urls, loop):
    async with aiohttp.ClientSession(loop=loop) as session:
        results = await asyncio.gather(*[fetch(session, url) for url in urls], return_exceptions=True)
        return results


async def get_required_fields(repo_info):
    urls = {
        "tags": repo_info['tags_url'],
        'contibutors': f"{repo_info['contributors_url']}?per_page=1",
        'pulls': f'{repo_info["url"]}/pulls?per_page=1',
        'languages': repo_info['languages_url'],
    }
    loop = asyncio.get_event_loop()
    responses = await fetch_all(urls.values(), loop)

    tags_response = responses[0]['json']
    tags = ', '.join(x['name'] for x in tags_response)
    contibutors_response = responses[1]
    contibutors_count = get_page_count(contibutors_response['headers'])
    last_commit_date = repo_info['pushed_at']
    pulls_response = responses[2]
    pulls_count = get_page_count(pulls_response['headers'])
    languages_response = responses[3]['json']
    languages = ', '.join(x for x in languages_response.keys())

    required_fields = {
        'name': repo_info['name'],
        'description': repo_info['description'],
        'last_commit_date': last_commit_date,
        'contributor_count': contibutors_count,
        'open_issues': repo_info['open_issues'],
        'open_prs':pulls_count,
        'number_of_stars': repo_info['stargazers_count'],
        'languages': languages,
        'tags':tags,
    }
    return required_fields


@api_view(['GET'])
def licenses(request):
    response = get(f'{GITHUB_URL}/licenses')
    licenses = response.json()
    data = {'licenses': [x['key'] for x in licenses]}
    return JsonResponse(data)

