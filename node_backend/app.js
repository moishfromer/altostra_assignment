const express = require('express')
const axios = require('axios')
const getRequiredFields = require('./utils')
const CONSTANTS = require('./constants')
axios.defaults.headers.common['Authorization'] = `Basic ${CONSTANTS.AUTH_TOKEN}` 

const cors = require('cors');
const url = require('url')
const app = express()
app.use(cors());
const port = 3000
const GITHUB_URL = 'https://api.github.com';

app.get('/github/repos', async(req, res) => {
    const query = url.parse(req.url, true).query
    queryString = Object.entries(query).filter(x=>x[1]).map(x=> `${x[0]}:${x[1]}`).join(' ')
    
    if (!queryString){
        return res.send({'message': 'need to enter query'}, status=400)
    }
    params = {
        'per_page': 10,
        'q': queryString
    }
    response = await axios.get(`${GITHUB_URL}/search/repositories`, {params})
    data = response.data.items;
    const list = data.map(repoInfo=>getRequiredFields(repoInfo))
    response_data = await Promise.all(list)
    response_data = {'repos': response_data}
    res.send(response_data)
})

app.get('/github/licenses', async(req, res) => {
    response = await axios.get(`${GITHUB_URL}/licenses`)
    licenses = response.data.map(x=>x.key);
    data = {'licenses': licenses}
    res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})