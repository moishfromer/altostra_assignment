import React from 'react';
import { Card, CardContent} from '@material-ui/core';
import ReactTable from 'react-table-v6';
import 'react-table-v6/react-table.css';


function Table(props) {
  const {repos, columns} = props;

  return (
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
  );
}

export default Table;