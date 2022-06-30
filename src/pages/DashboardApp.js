// material
/* eslint-disable */
import { Box, Grid, Container, Typography } from '@mui/material';
import axios from 'axios'
import React from "react"
import MuiDataCard from "../components/CustomDataCard"
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../sections/@dashboard/app';

let dateToIso;
let date;
let endDate;
let startDate

const headers = {
  'Authorization':process.env.REACT_APP_API_KEY
}

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [todaySales, setTodaySales] = React.useState([]);
  React.useEffect(() => {
    date = new Date();
    dateToIso = date.toISOString();

    endDate = dateToIso.split(".")[0]
    
    startDate = dateToIso.split("T")[0] + "T" + "00:00:00"


    const options = {
      method: "get",


      url: process.env.REACT_APP_SERVER_URL+"/sales?start_date=" + startDate + "&end_date=" + endDate,
      headers:headers

    };
    axios(options).then(function (response) {
      // handle success
      
      setTodaySales(response.data.total_sales.Sales)

    }).catch((err) => {
      


    });




  }, []);
  return (
    <Page title="Dashboard | Peak360">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hi, Welcome back</Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <AppWeeklySales salesCount={todaySales.length} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppNewUsers />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppItemOrders />
          </Grid>
          {/*  <Grid item xs={12} sm={6} md={3}>
            <AppBugReports />
          </Grid> */}

          <Grid item xs={12} md={12} lg={12}>
            <AppWebsiteVisits />
          </Grid>
          {/*
          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>*/}

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>

          {/*<Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          {/*<Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>*/}

          {/*<Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>*/}

          {/*<Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid>*/}
        </Grid>
      </Container>
      <Box sx={{ marginTop: "30px" }}>

        <MuiDataCard salesData={todaySales} />




      </Box>
    </Page>
  );
}
