/* eslint-disable */

import { useState,useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';

import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import moment from "moment-timezone"
import Tooltip from '@mui/material/Tooltip';
import AdapterDateFns from '@mui/lab/AdapterDateFns';



// material
import {
  Button,
  Typography,
} from '@mui/material';
// components

import MuiDataCard from "../components/CustomDataCard"
import React from "react"
import axios from "axios"
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { AppWeeklySales } from 'src/sections/@dashboard/app';

import USERLIST from '../_mocks_/user';


// ----------------------------------------------------------------------


let endDate;
let endDateTime;
let i=0;
let j=0;
// ----------------------------------------------------------------------


export default function User() {
  let [todaySales, setTodaySales] = useState([]);
  let [startDate, setStartDate] = useState(new Date());
  let [todaySalesCount, settodaySalesCount] = useState("");
  let [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [openSpinner, setOpenSpinner] = useState(false);

  let [clientId, setClientId] = React.useState("")

  useEffect(() => {
    handleSpinnerToggle()
    endDate = moment().tz("Asia/Singapore").format().split("+")[0]
    console.log(process.env.REACT_APP_SERVER_URL)

    let options = {
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/sales?start_date=${endDate.split("T")[0]}T00:00:00&end_date=${endDate.split("+")[0]}`,

    };
    axios(options).then(function (response) {
      // handle success
      console.log("the axios api response", response.data.total_sales.Sales);
      console.log(endDate.split("T")[1])
      setSalesData(response.data.total_sales.Sales,endDate)
      
      countSales(response.data.total_sales.Sales)
      setTimeout(handleSpinnerClose(), 3000);

    }).catch((err) => {
      console.log('Customer API error:', err);


    });

    getClientId()


  }, []);

  function setSalesData(salesData,endDate)
  {
    salesData.forEach((data)=>{

      if(data.SaleTime<=endDate.split("T")[1])
      {todaySales.push(data)}
      
    })
    setTodaySales(todaySales)

  }

  function countSales(Sales) {
    var totalSales=0;
   
    for(i=0;i<Sales.length;i++)
    {for (j=0;j<Sales[i].PurchasedItems.length;j++)
    {totalSales+=Sales[i].PurchasedItems[j].TotalAmount-Sales[i].PurchasedItems[j].TaxAmount}
    }
    
    settodaySalesCount(totalSales)
  }

  function downloadTxtFile() {
    console.log("The start date is", startDate)
    var year = startDate.getFullYear()
    var month = (startDate.getMonth() + 1)
    var day = startDate.getDate();
    var data = { file: `TD_${String(year)}0${String(month)}${String(day)}`, file_content: `${clientId}`, date: `${year}-${month}-${day}` }

    axios.post(`${process.env.REACT_APP_SERVER_URL}/sales_data`, data).then((response) => {
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
      setMessage("Downloading Files ....")

    }).catch((err) => {
      console.error("Due to some Error request failed: ", err);
      setMessage("We Can't Process Your Request at the Moment")


    });

  }
  function getClientId() {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/client`).then((response) => {
      // handle success
      console.log("the client id isresponse", response);
      setClientId(response.data.client_id[0].client_id)




    }).catch((err) => {
      console.error("Due to some Error request failed: ", err);


    });
  }
  function getDataOfParticularDate() {
    handleSpinnerToggle()
    console.log("The start Date without converting to anything",startDate)
    console.log(startDate.getMonth()+1)
    console.log("The date",startDate.getDate())
    console.log("The date",startDate.getFullYear())
    var currentMonth=startDate.getMonth()+1
    currentMonth="0"+currentMonth
    var currentDate=parseInt(startDate.getDate())<=9 &&String(startDate.getDate()).slice(0,1)!='0'?"0"+String(startDate.getDate()):String(startDate.getDate())
  
    endDate = moment().tz("Asia/Singapore").format().split("+")[0]
    if(currentDate===endDate.split("-")[2].split("T")[0])
    {console.log("Yes")
    endDateTime=endDate.split("T")[1]
    endDateTime="T"+endDateTime
  }
  else{endDateTime="T23:59:59"}
    

    let options = {
      method: "get",     
      url: `${process.env.REACT_APP_SERVER_URL}/sales?start_date=${startDate.getFullYear()}-${currentMonth}-${currentDate}T00:00:00&end_date=${startDate.getFullYear()}-${currentMonth}-${currentDate}${endDateTime}`,
    };

    axios(options).then(function (response) {
      // handle success
      console.log("the axios api response", response.data.total_sales.Sales);
      setSalesData(response.data.total_sales.Sales,`${startDate.getFullYear()}-${currentMonth}-${currentDate}${endDateTime}`)
      countSales(response.data.total_sales.Sales)
      handleSpinnerClose()

    }).catch((err) => {
      console.error("Customer API error: ", err);

    });
    SendToServer() 
  }
  const handleSpinnerClose = () => {
    setOpenSpinner(false);
  };
  const handleSpinnerToggle = () => {
    setOpenSpinner(!openSpinner);
  };

  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (newValue) => {
    console.log("the new valuee", newValue)
  
    startDate = newValue
    setStartDate(startDate);
  };
  



  function retrieveStartDate() {

    return startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + '-' + startDate.getDate();
  }

  
  function SendToServer() {
    
    var year =  String(startDate.getFullYear())
    var month =  "0"+String((startDate.getMonth() + 1))
    var day = parseInt(startDate.getDate())<=9 &&String(startDate.getDate()).slice(0,1)!='0'?"0"+String(startDate.getDate()):String(startDate.getDate())

  var data = { file: "TD_" + String(year) + String(month) + String(day), file_content: `${clientId}`, date: `${year}-${month}-${day}` }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/send_to_server`, data).then((response) => {
      // handle success
      console.log("the axios api response", response);
      setMessage(response.data.message)
      handleClick()
      const myTimeout = setTimeout(() => { handleClose() }, 3000);
    }).catch((err) => {
      console.error("Due to some Error request failed: ", err);
    });
  }



  return (<div>
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}

    />
    <center>
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openSpinner}
        onClick={handleSpinnerClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
                  maxDate={new Date()} 
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              <p></p>
              <Typography>You have selected {retrieveStartDate()}</Typography><br />
              <Tooltip title="To retrieve sales based on the date selected" arrow><Button variant="contained" onClick={getDataOfParticularDate}> Show Records </Button></Tooltip>
              <br />

              <br /><br />

              <AppWeeklySales sx={{ marginTop: "30px", marginBottom: "30px" }} label="Total Sales" salesCount={todaySalesCount} />

            </th>
          </tr>
        </thead>
      </table>
    </center>
    <br></br>
    <br></br>

    <center><Tooltip title="To download a .txt file based on the date selected" arrow><Button variant="contained" onClick={downloadTxtFile}>Download </Button></Tooltip> <Tooltip title="To send the same .txt file to your server, based on the date selected" arrow><Button variant="contained" onClick={SendToServer}>Send</Button></Tooltip></center>
    <br></br>
    <MuiDataCard salesData={todaySales} />
  </div>
  );
}