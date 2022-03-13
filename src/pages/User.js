/* eslint-disable */
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
let startDate;
// ----------------------------------------------------------------------


export default function User() {
  let [todaySales, setTodaySales] = React.useState([]);
  let [startDate, setStartDate] = React.useState(new Date());

  React.useEffect(() => {
    date = new Date();
    dateToIso = date.toISOString();

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

    }).catch((err) => {
      console.log('Customer API error:', err);


    });




  }, []);
  let handleStartDate = (date) => {
    setStartDate(date);
  };
  function retrieveStartDate() {

    return startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + '-' + startDate.getDate();
  }
  function downloadTxtFile() {
    let element = document.createElement("a");
    var recordAcessingDate = String(startDate.getFullYear()) + String((startDate.getMonth() + 1)) + String(startDate.getDate());
    console.log(recordAcessingDate)

    let file = new Blob(["888899999999|" + recordAcessingDate + "|1|2|40.19|0.00"], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "TD_" + recordAcessingDate + "| 1 | 2 | 40.19 | 0.00.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
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
  }
  return (<div>
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
            </th>
          </tr>
        </thead>
      </table>
    </center>
    <br></br>
    <br></br>

    <center><Button variant="contained" onClick={downloadTxtFile}>Download .Txt </Button> <Button variant="contained">Send to Server</Button></center>
    <br></br>
    <MuiDataCard salesData={todaySales} />
  </div>
  );
}
