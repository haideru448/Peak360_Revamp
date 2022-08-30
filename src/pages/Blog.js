/* eslint-disable */

import React, { useEffect, useState } from 'react';
// material
import { Grid, Button, Container, Stack, Typography, Box } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';

// components
import axios from 'axios';
import TextField from '@mui/material/TextField';
import TimePicker from '@mui/lab/TimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from 'yup';
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';

const headers = {
  Authorization: process.env.REACT_APP_API_KEY
};

let data;
// const pattern = ;

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
  const [ftpConfigurations, setFtpConfigurations] = React.useState({
    username: '',
    password: '',
    ip: ''
  });
  const [ftpConfigurationsName, setFtpConfigurationsName] = React.useState('');

  const [clientId, setclientId] = React.useState('');
  const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));
  const [value2, setValue2] = React.useState(new Date('2014-08-18T21:11:54'));
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  });

  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/client`, { headers })
      .then((response) => {
        const tField = true;

        // handle success

        setclientId(response.data.client_id[0].client_id);
        setcurrentClientId(response.data.client_id[0].id);

        getFTPCredentials();
      })
      .catch((err) => {
        setTextFieldState(true);
      });
  }, []);

  const Schema = Yup.object().shape({
    ip: Yup.string().required('Ip is required'),
    userName: Yup.string().required('username is required'),
    password: Yup.string().required('Password is required')
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ip: ftpConfigurations?.ip ?? '',
      userName: ftpConfigurations?.username ?? '',
      password: ftpConfigurations?.password ?? '',
      port: ftpConfigurations?.port ?? ''
      // label: '',
      // artistName: 'ajdlkfjl',
      // language: '',
    },
    validationSchema: Schema,
    onSubmit: async (data) => {
      try {
        axios
          .post(`${process.env.REACT_APP_SERVER_URL}/ftp_credentials`, data, { headers })
          .then((response) => {
            // handle success

            toast.success(response.data.message);
            setTextFieldState(true);
          })
          .catch((err) => {
            console.error('Due to some Error request failed: ', err);
          });
      } catch (err) {
        //
      }
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  function getFTPCredentials() {
    let configurations;
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/ftp_credentials`, { headers })
      .then((response) => {
        // handle success

        setFtpConfigurations(response.data.credentials[0]);
      })
      .catch((err) => {});
  }


  function enableFTPCredentialsField() {
    setFtpCredentialsState(false);
  }

  const clientValueId = (e) => {
    // console.log(e.target.value.length)
    if(e.target.value.length<=15)
      {setclientId(e.target.value);}
    
  };
  const saveClientId = () => {
    console.log(clientId);

    if (clientId.length < 12) {
      toast.error('ClientId Length must be atleast 12')
      // handleClick();
      // setTimeout(() => {
      //   handleClose();
      // }, 3000);
    }
    //   else if(!/^[A-Za-z]*$/.test('1212121A') && !/^[0-9]*$/.test('1212121A'))
    //   {console.log('not a valid password')

    // }
    else {
      data = {
        clientId,
        id: currentClientId
      };

      axios
        .post(`${process.env.REACT_APP_SERVER_URL}/client`, data, { headers })
        .then((response) => {
          // handle success

          toast.success(response.data.message);
          setTextFieldState(true);
        })
        .catch((err) => {
          console.error('Due to some Error request failed: ', err);
        });
    }
  };
  return (
    <Page title="Dashboard: Interactive | Peak360">
      <Container>
        <Typography variant="h4" gutterBottom>
          Landlord Server Settings
        </Typography>
        <br />
        <br />

        <center>
          <TextField
            disabled={textFieldState}
            type="text"
            style={{ width: '40%' }}
            id="standard-basic"
            label="Enter Client Id"
            variant="filled"
            value={clientId}
            onChange={clientValueId}
          />
          <br />
          <br />
          <br />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {' '}
            <Button sx={{ marginLeft: 'auto' }} variant="contained" onClick={saveClientId}>
              Save
            </Button>
            <br />
            <br />
            <br />
            &nbsp;&nbsp;&nbsp;{' '}
            <Button
              sx={{ marginRight: 'auto' }}
              variant="contained"
              onClick={() => {
                setTextFieldState(false);
              }}
            >
              Edit
            </Button>
          </Box>
          <Toaster position="top-center" reverseOrder={false} />
        </center>

        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <center>
              <TextField
                {...getFieldProps('ip')}
                error={Boolean(touched.ip && errors.ip)}
                helperText={touched.ip && errors.ip}
                disabled={ftpCredentialsState}
                type="text"
                style={{ width: '40%' }}
                name="ip"
                id="standard-basic"
                label="FTP IP"
                variant="filled"
              />
              <br />
              <br />
              <TextField
                {...getFieldProps('userName')}
                error={Boolean(touched.userName && errors.userName)}
                helperText={touched.userName && errors.userName}
                disabled={ftpCredentialsState}
                type="text"
                style={{ width: '40%' }}
                name="userName"
                id="standard-basic"
                label="FTP Username"
                variant="filled"
              />
              <br />
              <br />
              <TextField
                {...getFieldProps('password')}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                disabled={ftpCredentialsState}
                type="password"
                style={{ width: '40%' }}
                name="password"
                id="standard-basic"
                label="FTP Password"
                variant="filled"
              />
              <br />
              <br />
              <TextField
                {...getFieldProps('port')}
                error={Boolean(touched.port && errors.port)}
                helperText={touched.port && errors.port}
                disabled={ftpCredentialsState}
                type="text"
                style={{ width: '40%' }}
                name="port"
                id="standard-basic"
                label="Port"
                variant="filled"
              />

              <br />
              <br />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {' '}
                <Button type="submit" sx={{ marginLeft: 'auto' }} variant="contained">
                  Save
                </Button>
                <br />
                <br />
                <br />
                &nbsp;&nbsp;&nbsp;{' '}
                <Button
                  sx={{ marginRight: 'auto' }}
                  variant="contained"
                  onClick={() => {
                    enableFTPCredentialsField();
                  }}
                >
                  Edit
                </Button>
              </Box>
              <Toaster position="top-center" reverseOrder={false} />
            </center>
          </Form>
        </FormikProvider>
      </Container>
    </Page>
  );
}
