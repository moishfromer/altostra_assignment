import re

import requests
from django.http import JsonResponse
from requests.auth import HTTPBasicAuth
from rest_framework.decorators import api_view

from backend.settings import GITHUB_API_TOKEN
from github.constants import GITHUB_URL


def get(url, **kwargs):
    return requests.get(url, auth=HTTPBasicAuth('mo.fromer@gmail.com',GITHUB_API_TOKEN), **kwargs)


def get_page_count(response):
    try:
        return re.findall('page=([\d]*)>; rel="last"', response.headers['Link'])[0]
    except KeyError:
        return 0


@api_view(['GET'])
def repos(request):
    query_string = ' '.join(f'{key}:{value}' for key, value in request.GET.items() if value)
    if not query_string:
        return JsonResponse({'message': 'need to enter query'}, status=400)
    params = {
        'per_page': 5,
        'q': query_string
    }
    response = get(f'{GITHUB_URL}/search/repositories', params=params)
    data = response.json()['items']
    response_data = []
    for repo_info in data:
        tags_response = get(repo_info['tags_url']).json()
        tags = ', '.join(x['name'] for x in tags_response)
        contibutors_response = get(f"{repo_info['contributors_url']}?per_page=1")
        contibutors_count = get_page_count(contibutors_response)
        last_commit_date = repo_info['pushed_at']
        pulls_response = get(f'{repo_info["url"]}/pulls?per_page=1')
        pulls_count = get_page_count(pulls_response)
        languages_response = get(repo_info['languages_url']).json()
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
        response_data.append(required_fields)
    response_data = {'repos': response_data}
    return JsonResponse(response_data)


@api_view(['GET'])
def licenses(request):
    response = get(f'{GITHUB_URL}/licenses')
    licenses = response.json()
    data = {'licenses': [x['key'] for x in licenses]}
    return JsonResponse(data)

