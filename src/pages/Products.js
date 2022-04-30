import { useFormik } from 'formik';
import React, { useState } from 'react';
// material
import { Container, Stack, Typography, Grid } from '@mui/material';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';

// components
import Page from '../components/Page';
import {
  ProductSort,
  ProductList,
  ProductCartWidget,
  ProductFilterSidebar
} from '../sections/@dashboard/products';
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


//
import PRODUCTS from '../_mocks_/products';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  const [openFilter, setOpenFilter] = useState(false);
  const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

  const formik = useFormik({
    initialValues: {
      gender: '',
      category: '',
      colors: '',
      priceRange: '',
      rating: ''
    },
    onSubmit: () => {
      setOpenFilter(false);
    }
  });

  const { resetForm, handleSubmit } = formik;

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const handleResetFilter = () => {
    handleSubmit();
    resetForm();
  };

  return (
    <Page title="Dashboard: Products | Peak360">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Archives Record
        </Typography>
        <center>
          <LocalizationProvider dateAdapter={AdapterDateFns}>

            <MobileDatePicker
              views={['year']}
              label="Pick Year"
              inputFormat="yyyy"
              value={value}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider><br /><br />

          <LocalizationProvider dateAdapter={AdapterDateFns}>

            <MobileDatePicker
              views={['month']}
              label="Pick Month"
              inputFormat="MM"
              value={value}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </center>
        <Grid container spacing={3} sx={{ marginTop: "50px" }}>
          <Grid item xs={12} sm={6} md={4}>
            <AppWeeklySales label="Sent to Server" salesCount={200} />

          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWeeklySales label="Sent to Server" salesCount={200} />

          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AppWeeklySales label="Sent to Server" salesCount={200} />

          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <AppWeeklySales label="Sent to Server" salesCount={200} />

          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
