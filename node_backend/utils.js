const axios = require('axios')
const CONSTANTS = require('./constants')
axios.defaults.headers.common['Authorization'] = `Basic ${CONSTANTS.AUTH_TOKEN}` 

function get_page_count(headers){
    let pageCount = 0
    if(headers.link){
        const myRegex = /page=([\d]*)>; rel="last"/g
        const res = myRegex.exec(headers.link)
        pageCount = res ? res[1] : 0 
    }
    return pageCount
}

async function get(url){
    const a = await axios.get(url)
    return a
} 

async function getRequiredFields(repo_info){
    
    urls = {
        "tags": repo_info.tags_url,
        'contibutors': `${repo_info.contributors_url}?per_page=1`,
        'pulls': `${repo_info.url}/pulls?per_page=1`,
        'languages': repo_info.languages_url,
    }
    const list = Object.values(urls).map(x=>get(x))
    responses = await Promise.all(list)
    tags_response = responses[0].data
    tags = tags_response.map(x=> x.name).join(', ')
    contibutors_response = responses[1]
    contibutors_count = get_page_count(contibutors_response.headers)
    last_commit_date = repo_info.pushed_at
    pulls_response = responses[2]
    pulls_count = get_page_count(pulls_response.headers)
    languages_response = responses[3].data
    languages = Object.keys(languages_response).join(', ')

    
    required_fields = {
        name: repo_info.name,
        description: repo_info.description,
        last_commit_date: last_commit_date,
        contributor_count: contibutors_count,
        open_issues: repo_info.open_issues,
        open_prs:pulls_count,
        number_of_stars: repo_info.stargazers_count,
        languages: languages,
        tags:tags,
    }
    return required_fields
}

module.exports = getRequiredFields