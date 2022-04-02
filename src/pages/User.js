/* eslint-disable */
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import DatePicker from 'react-datepicker'
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { parseISO } from 'date-fns';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../sections/@dashboard/user';
import MuiDataCard from "../components/CustomDataCard"
import React from "react"
import axios from "axios"
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { AppWeeklySales } from 'src/sections/@dashboard/app';

import USERLIST from '../_mocks_/user';


// ----------------------------------------------------------------------

let TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Company', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'isVerified', label: 'Verified', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: '' }
];
let dateToIso;
let date;
let endDate;
// ----------------------------------------------------------------------


export default function User() {
  let [todaySales, setTodaySales] = React.useState([]);
  let [startDate, setStartDate] = React.useState(new Date());
  let [todaySalesCount, settodaySalesCount] = React.useState("");
  let [message, setMessage] = React.useState("");

  let [clientId, setClientId] = React.useState("")

  React.useEffect(() => {

    var date, offset, nd, utc;
    date = new Date();
    utc = date.getTime() + (date.getTimezoneOffset() * 60000);

    // Singapore is GMT+8
    offset = 8;

    nd = new Date(utc + (3600000 * offset));
    date = nd.toJSON()
    console.log("the data is", date)
    dateToIso = date;
    console.log("the date to iso", dateToIso)

    endDate = dateToIso.split(".")[0]
    console.log("The ending Date", endDate)
    startDate = dateToIso.split("T")[0] + "T" + "00:00:00"


    let options = {
      method: "get",


      url: "https://api-dev.peak360.fitness/sales?start_date=" + startDate + "&end_date=" + endDate,

    };
    axios(options).then(function (response) {
      // handle success
      console.log("the axios api response", response.data.total_sales.Sales);
      setTodaySales(response.data.total_sales.Sales)
      countSales(response.data.total_sales.Sales)

    }).catch((err) => {
      console.log('Customer API error:', err);


    });

    getClientId()


  }, []);
  let handleStartDate = (date) => {
    setStartDate(date);
  };
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function countSales(sales) {
    console.log("Count api data is", sales[0].Payments[0].Amount)
    var Sales = sales.reduce(reducerFunc);
    settodaySalesCount(Sales.Payments[0].Amount)
    console.log("the today sales", todaySales)

  }
  function getClientId() {
    axios.get('https://api-dev.peak360.fitness/client').then((response) => {
      // handle success
      console.log("the client id isresponse", response);
      setClientId(response.data.client_id[0].client_id)




    }).catch((err) => {
      console.error("Due to some Error request failed: ", err);


    });
  }

  function reducerFunc(total, num) {
    var totalSales = total.Payments[0].Amount + num.Payments[0].Amount;
    return { "Payments": [{ "Amount": totalSales }] }
  }
  function retrieveStartDate() {

    return startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + '-' + startDate.getDate();
  }
  function downloadTxtFile() {
    var year = startDate.getFullYear()
    var month = (startDate.getMonth() + 1)
    var day = startDate.getDate();
    var data = { file: "TD_" + String(year) + "0" + String(month) + String(day), file_content: `${clientId}`, date: `${year}-${month}-${day}` }

    axios.post('https://3645-103-152-116-131.ngrok.io/sales_data', data).then((response) => {
      // handle success
      console.log("the axios api response", response);
      setMessage(response.data.message)
      handleClick()
      const myTimeout = setTimeout(() => { handleClose() }, 3000);
      let element = document.createElement("a");
      let file = new Blob([`${response.data.file_content}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = response.data.file_name;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();





    }).catch((err) => {
      console.error("Due to some Error request failed: ", err);


    });



    var recordAcessingDate = String(startDate.getFullYear()) + String((startDate.getMonth() + 1)) + String(startDate.getDate());
    console.log(recordAcessingDate)






  }
  function SendToServer() {
    var year = startDate.getFullYear()
    var month = (startDate.getMonth() + 1)
    var day = startDate.getDate();
    if (month < 10) { month = "0" + String(month) }
    if (day < 10) { day = "0" + String(day) }
    var data = { file: "TD_" + String(year) + String(month) + String(day), file_content: `${clientId}`, date: `${year}-${month}-${day}` }
    axios.post('https://3645-103-152-116-131.ngrok.io/send_to_server', data).then((response) => {
      // handle success
      console.log("the axios api response", response);
      setMessage(response.data.message)
      handleClick()
      const myTimeout = setTimeout(() => { handleClose() }, 3000);




    }).catch((err) => {
      console.error("Due to some Error request failed: ", err);


    });
  }

  const handleChange = (newValue) => {
    startDate = newValue
    setStartDate(startDate);
  };
  function getDataOfParticularDate() {
    console.log("interactive work")
    console.log("Data of a particular data ", startDate)
    var startDateinIsOFormat = startDate.toISOString().split('T')[0]
    console.log("the start date in iso", startDateinIsOFormat)
    var d = new Date();
    var n = d.toLocaleTimeString();
    var currentTime = n.split(' ')[0];
    var endDate = startDateinIsOFormat + "T" + currentTime
    var startDatee = startDateinIsOFormat + "T" + "00:00:00"

    let options = {
      method: "get",


      url: "https://api-dev.peak360.fitness/sales?start_date=" + startDatee + "&end_date=" + endDate,

    };

    axios(options).then(function (response) {
      // handle success
      console.log("the axios api response", response.data.total_sales.Sales);
      setTodaySales(response.data.total_sales.Sales)

    }).catch((err) => {
      console.error("Customer API error: ", err);

    });
    SendToServer()
  }
  return (<div>
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}

    />
    <center>
      <table>
        <thead>
          <tr>

            <th>
              <Typography>To choose past dates, please use the calander dropdown!</Typography><br /><br />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  label="Date desktop"
                  inputFormat="MM/dd/yyyy"
                  value={startDate}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <p></p>
              <Typography>You have selected {retrieveStartDate()}</Typography><br />
              <Button variant="contained" onClick={getDataOfParticularDate}> Get Sales </Button>
              <br />

              <br /><br />

              <AppWeeklySales sx={{ marginTop: "30px", marginBottom: "30px" }} label="Today Sales $USD" salesCount={todaySalesCount} />

            </th>
          </tr>
        </thead>
      </table>
    </center>
    <br></br>
    <br></br>

    <center><Button variant="contained" onClick={downloadTxtFile}>Download .Txt </Button> <Button variant="contained" onClick={SendToServer}>Send to Server</Button></center>
    <br></br>
    <MuiDataCard salesData={todaySales} />
  </div>
  );
}
