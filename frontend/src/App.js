
import React,{useState, useEffect} from 'react';
import {Button, TextField,Grid, Card, CardContent, CircularProgress, FormControl, InputLabel,Select, MenuItem} from '@material-ui/core';
import axios from 'axios';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';


const BASE_URL = 'http://localhost:8000/github';
const columns = [
  {
      Header: 'Name',
      accessor: 'name',
  },
  {
      Header: 'Description',
      accessor: 'description',
  },
  {
      Header: 'Last commit date',
      accessor: 'last_commit_date',
  },
  {
      Header: 'Count of contributors',
      accessor: 'contributor_count',
  },
  {
      Header: 'Count of open issues',
      accessor: 'open_issues',
  },
  {
      Header: 'Count of open Pull Requests',
      accessor: 'open_prs',
  },
  {
      Header: 'Number of stars',
      accessor: 'number_of_stars',
  },
  {
      Header: 'Programming languages used in the repository',
      accessor: 'languages',
  },
  {
      Header: 'Tags',
      accessor: 'tags',
  },

]

function App() {
  const [licenses, setLicenses] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    stars: '',
    forks:'',
    pushed: '',
    license: '',
    language: '',
  })

  useEffect(() => {
    const fetchLicenses = async () => {
      const response = await axios.get(`${BASE_URL}/licenses/`);
      setLicenses(response.data.licenses);
    };
 
    fetchLicenses();
  }, []);

  const fetchRepos = async() => {
    setLoading(true)
    const response = await axios.get(`${BASE_URL}/repos/`, {params:query});
    setRepos(response.data.repos)
    setLoading(false)
  }

  const handleChange = ({target}) => {
    setQuery({
      ...query,
      [target.name]: target.value,
    })
    console.log(query)
  }

  const isEmptyQuery = () => !Object.values(query).some(x=>x)

  return (
    <div className="App">
      <form>
        <Card  style={{margin: '10px'}}>
          <CardContent>
            <Grid container alignItems="flex-end" spacing={2}>
              <Grid item xs={12} sm={2}>
                <TextField
                  id="stars"
                  name="stars"
                  label="With this many stars"
                  placeholder=">1000"
                  value={query.stars}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  id="forks"
                  name="forks"
                  label="With this many forks"
                  placeholder="50..100, <5"
                  value={query.forks}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>

                <TextField
                  id="pushed"
                  name="pushed"
                  label="commit date"
                  placeholder="<YYYY-MM-DD"
                  value={query.pushed}
                  onChange={handleChange}
                  fullWidth
                />
                </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="license">With this license</InputLabel>
                  <Select
                    value={query.license}
                    onChange={handleChange}
                    inputProps={{
                      name: 'license',
                      id: 'license',
                    }}
                  >
                    {licenses.map(license => <MenuItem key={license} value={license}>{license}</MenuItem>)}
                  </Select>
                </FormControl>
                </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  id="language"
                  name="language"
                  label="With this language"
                  placeholder="Any language"
                  value={query.language}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={2}>
              
                <Button disabled={loading || isEmptyQuery()} onClick={fetchRepos} variant="contained" color="primary">
                  {loading ? <CircularProgress size={25}/> : 'Fetch'}

                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
      <Card style={{margin: '10px'}}>
        <CardContent>
          <ReactTable
            title="Repos"
            data={repos}
            columns={columns}
            defaultPageSize={10}
            showPagination={false}
          />   
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
