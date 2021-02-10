import re

import requests
from django.http import JsonResponse
from requests.auth import HTTPBasicAuth
from rest_framework.decorators import api_view

from backend.settings import GITHUB_API_TOKEN
from github.constants import GITHUB_URL


def get(url):
    return requests.get(url, auth=HTTPBasicAuth('mo.fromer@gmail.com',GITHUB_API_TOKEN))


def get_page_count(response):
    try:
        return re.findall('page=([\d]*)>; rel="last"', response.headers['Link'])[0]
    except KeyError:
        return 0


@api_view(['GET'])
def repos(request):
    num_of_repos = 5
    response = get(f'{GITHUB_URL}/repositories')
    data = response.json()[:num_of_repos]
    response_data = []
    for x in data:
        repo_url = x['url']
        repo_info = get(repo_url).json()
        tags_response = get(repo_info['tags_url']).json()
        tags = [x['name'] for x in tags_response]
        contibutors_response = get(f"{repo_info['contributors_url']}?per_page=1")
        contibutors_count = get_page_count(contibutors_response)
        branches_response = get(f'{repo_url}/branches/master').json()
        last_commit_date = branches_response['commit']['commit']['committer']['date']
        pulls_url = f'{repo_url}/pulls?per_page=1'
        pulls_count = get_page_count(get(pulls_url))
        required_fields = {
            'name': x['name'],
            'description': x['description'],
            'last_commit_date': last_commit_date,
            'contributor_count': contibutors_count,
            'open_issues': repo_info['open_issues'],
            'open_prs':pulls_count,
            'number_of_stars': repo_info['stargazers_count'],
            'languages': repo_info['language'],
            'tags':tags,
        }
        response_data.append(required_fields)
    response_data = {'repos': response_data}
    return JsonResponse(response_data)