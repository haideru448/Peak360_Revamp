import { Link as RouterLink } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
// material
import { Grid, Button, Container, Stack, Typography,Box } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';

// components
import axios from 'axios'
import TextField from '@mui/material/TextField';
import TimePicker from '@mui/lab/TimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';

let data;
// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' }
];

// ----------------------------------------------------------------------

export default function Blog() {
  const [currentClientId, setcurrentClientId] = React.useState(-1);
  const [textFieldState, setTextFieldState] = React.useState(true);
  const [ftpCredentialsState, setFtpCredentialsState] = React.useState(true);
  const [ftpConfigurations, setFtpConfigurations] = React.useState({ip:"",password:"",userName:""});


  const [clientId, setclientId] = React.useState("");
  const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));
  const [value2, setValue2] = React.useState(new Date('2014-08-18T21:11:54'));
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  React.useEffect(() => {
    axios.get('https://api-dev.peak360.fitness/client').then((response) => {
      const tField=true
      
      // handle success
      console.log("the axios api response", response);
      setclientId(response.data.client_id[0].client_id)
      setcurrentClientId(response.data.client_id[0].id)
      console.log("The current client id is ", currentClientId)
      


    }).catch((err) => {
      setTextFieldState(true)
      console.error("Due to some Error request failed: ", err);


    });

  }, []);

  function handleClick() {
    console.log("in the handlee click")
    setState({ open: true, vertical: 'top', horizontal: 'center', });
  };

  function handleClose() {
    setState({ open: false, vertical: 'top', horizontal: 'center', });
  };


  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const handleChange2 = (newValue) => {
    setValue2(newValue);
  };
  function enableFTPCredentialsField()
  {setFtpCredentialsState(false)
  }




  const clientValueId = (e) => {

    setclientId(e.target.value)

  }
  const saveClientId = () => {
    if (clientId.length < 12) {
      console.log("client id lesser then 12 with length", clientId.length)
      handleClick()
      setTimeout(() => { handleClose() }, 3000);

    }

    else {
      data = {
        "clientId": clientId,
        "id": currentClientId
      }

      axios.post(`${process.env.REACT_APP_SERVER_URL}/client`, data).then((response) => {
        // handle success
        console.log("the axios api response", response);
        toast.success(response.data.message)
        setTextFieldState(true)

      }).catch((err) => {
        console.error("Due to some Error request failed: ", err);


      });
    }

  }
  return (
    <Page title="Dashboard: Blog | Minimal-UI">
      <Container>

        <Typography variant="h4" gutterBottom>
          Settings
        </Typography><br /><br />

        <center><TextField disabled={textFieldState} type="number" style={{ "width": "40%" }} id="standard-basic" label="Enter Client Id" variant="filled" value={clientId} onChange={clientValueId} /><br /><br /><br />
        <Box sx={{display:"flex",alignItems:"center"}}>  <Button sx={{marginLeft:"auto"}}  variant="contained" onClick={saveClientId}>Save</Button><br /><br /><br />
         &nbsp;&nbsp;&nbsp; <Button sx={{marginRight:"auto"}} variant="contained" onClick={()=>{setTextFieldState(false)
        console.log(textFieldState)
        
        }}>Edit</Button></Box>
        <Toaster
  position="top-center"
  reverseOrder={false}
/>

        </center>
       

        <center><TextField disabled={ftpCredentialsState} type="text" style={{ "width": "40%" }} name="ip" id="standard-basic" label="FTP IP" variant="filled" value={ftpConfigurations.ip}  /><br /><br />
        <TextField disabled={ftpCredentialsState} type="text" style={{ "width": "40%" }} name="userName" id="standard-basic" label="FTP Username" variant="filled" value={ftpConfigurations.userName} /><br /><br />
        <TextField disabled={ftpCredentialsState} type="password" style={{ "width": "40%" }} name="password" id="standard-basic" label="FTP PASSWORD" variant="filled" value={ftpConfigurations.password} />

        
        <br /><br />
        <Box sx={{display:"flex",alignItems:"center"}}>  <Button sx={{marginLeft:"auto"}}  variant="contained" >Save</Button><br /><br /><br />
         &nbsp;&nbsp;&nbsp; <Button sx={{marginRight:"auto"}} variant="contained" onClick={()=>{enableFTPCredentialsField()}}>Edit</Button></Box>
        <Toaster
  position="top-center"
  reverseOrder={false}
/>

        </center>
       




      </Container>
    </Page>
  );
}
