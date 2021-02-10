
import React,{useState} from 'react';
import {Button} from '@material-ui/core';
import axios from 'axios';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';
const BASE_URL = 'http://localhost:8000/github/';
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
      Header: 'Count of open and closed issues',
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
  const [repos, setRepos] = useState([]);
  const fetchRepos = async() => {
    const response = await axios.get(`${BASE_URL}repos/`);
    setRepos(response.data.repos)
    console.log(response.data.repos[0])    
  }
  return (
    <div className="App">
      <Button onClick={fetchRepos}>
        Fetch
      </Button>
      <ReactTable
        title="Repos"
        data={repos}
        columns={columns}
        defaultPageSize={100}
      />   
    </div>
  );
}

export default App;
