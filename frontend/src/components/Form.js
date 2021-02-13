import React,{useState, useEffect} from 'react';
import {Button, TextField,Grid, Card, CardContent, CircularProgress, FormControl, InputLabel,Select, MenuItem} from '@material-ui/core';
import axios from 'axios';
import {BASE_URL} from '../constants';

function Form(props) {

  const [licenses, setLicenses] = useState([]);
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

  const handleChange = ({target}) => {
    setQuery({
      ...query,
      [target.name]: target.value,
    })
  }

  const isEmptyQuery = () => !Object.values(query).some(x=>x)

  const handleSubmit = async() => {
      setLoading(true)
      try{
          await props.onSubmit(query)
      }catch(err){
          console.log(err)
      }
      setLoading(false)
  }


  return (
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
                    <Grid item xs={12} sm={1}> 
                        <Button disabled={loading || isEmptyQuery()} onClick={handleSubmit} variant="contained" color="primary">
                            {loading ? <CircularProgress size={25}/> : 'Fetch'}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    </form>

  );
}

export default Form;
