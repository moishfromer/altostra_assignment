
import React,{useState} from 'react';
import axios from 'axios';
import {BASE_URL} from './constants';
import Form from './components/Form';
import Table from './components/Table';
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
  const [repos, setRepos] = useState([]);

  const fetchRepos = async(query) => {
    const response = await axios.get(`${BASE_URL}/repos/`, {params:query});
    setRepos(response.data.repos)
  }

  return (
    <div className="App">
      <Form onSubmit={fetchRepos}/>
      <Table repos={repos} columns={columns}/>
    </div>
  );
}

export default App;
