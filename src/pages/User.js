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
import DashboardLayout from 'src/layouts/dashboard';



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
const headers = {
  'Authorization':process.env.REACT_APP_API_KEY
}

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
    

    let options = {
      method: "get",
      url: `${process.env.REACT_APP_SERVER_URL}/sales?start_date=${endDate.split("T")[0]}T00:00:00&end_date=${endDate.split("+")[0]}`,
      headers:headers
    };
    axios(options).then(function (response) {
      // handle success
     
      
      setSalesData(response.data.total_sales.Sales,endDate)
      
      
      setTimeout(handleSpinnerClose(), 3000);

    }).catch((err) => {
      


    });

    getClientId()


  }, []);

  function setSalesData(salesData,endDate)
  {todaySales=[]
    setTodaySales(todaySales)
    salesData.forEach((data)=>{

      if(data.SaleTime<=endDate.split("T")[1])
      {todaySales.push(data)}
      
    })
    setTodaySales(todaySales)
    countSales(todaySales)

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
    
    var year = startDate.getFullYear()
    var month = (startDate.getMonth() + 1)
    var day = startDate.getDate();
    if (month<10 && month.toString().split("")[0]!="0")
    {month="0"+month}
    if(day <10 && day.toString().split("")[0]!="0")
    {day="0"+day}
    

    var data = { file: `TD_${String(year)}${String(month)}${String(day)}`, file_content: `${clientId}`, date: `${year}-${month}-${day}` }

    axios.post(`${process.env.REACT_APP_SERVER_URL}/sales_data`, data,{headers}).then((response) => {

      // handle success
      
      setMessage("Downloading File..")

      handleClick()
      let myTimeout = setTimeout(() => { handleClose() }, 1000);
      let element = document.createElement("a");
      let file = new Blob([`${response.data.file_content}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = response.data.file_name;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      setMessage("File Downloaded..")
       myTimeout = setTimeout(() => { handleClose() }, 3000);


      

    }).catch((err) => {
      console.error("Due to some Error request failed: ", err);
      setMessage("We Can't Process Your Request at the Moment")


    });

  }
  function getClientId() {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/client`,{headers}).then((response) => {
      // handle success
      
      setClientId(response.data.client_id[0].client_id)




    }).catch((err) => {
      console.error("Due to some Error request failed: ", err);


    });
  }
  function getDataOfParticularDate() {
    handleSpinnerToggle()
  
    var currentMonth=startDate.getMonth()+1
    currentMonth="0"+currentMonth
    var currentDate=parseInt(startDate.getDate())<=9 &&String(startDate.getDate()).slice(0,1)!='0'?"0"+String(startDate.getDate()):String(startDate.getDate())
  
    endDate = moment().tz("Asia/Singapore").format().split("+")[0]
    if(currentDate===endDate.split("-")[2].split("T")[0])
    {
    endDateTime=endDate.split("T")[1]
    endDateTime="T"+endDateTime
  }
  else{endDateTime="T23:59:59"}
    

    let options = {
      method: "get",     
      url: `${process.env.REACT_APP_SERVER_URL}/sales?start_date=${startDate.getFullYear()}-${currentMonth}-${currentDate}T00:00:00&end_date=${startDate.getFullYear()}-${currentMonth}-${currentDate}${endDateTime}`,
    headers:headers
    };

    axios(options).then(function (response) {
      // handle success

      setSalesData(response.data.total_sales.Sales,`${startDate.getFullYear()}-${currentMonth}-${currentDate}${endDateTime}`)
      
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
    
  
    startDate = newValue
    setStartDate(startDate);
  };
  



  function retrieveStartDate() {


     return (startDate.getMonth() + 1)+'-' + startDate.getDate()+'-'+startDate.getFullYear()
  }

  
  function SendToServer() {
    
    var year =  String(startDate.getFullYear())
    var month =  "0"+String((startDate.getMonth() + 1))
    var day = parseInt(startDate.getDate())<=9 &&String(startDate.getDate()).slice(0,1)!='0'?"0"+String(startDate.getDate()):String(startDate.getDate())

  var data = { file: "TD_" + String(year) + String(month) + String(day), file_content: `${clientId}`, date: `${year}-${month}-${day}` }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/send_to_server`, data,{headers}).then((response) => {
      // handle success
     
    }).catch((err) => {

      setMessage(err.data.message)
      handleClick()
      const myTimeout = setTimeout(() => { handleClose() }, 3000);
    });
  }

  function sendToFtp()
  {
  var year =  String(startDate.getFullYear())
  var month = parseInt(startDate.getMonth() + 1)<=9 ?"0"+String((startDate.getMonth() + 1)):String((startDate.getMonth() + 1))
  var day = parseInt(startDate.getDate())<=9 &&String(startDate.getDate()).slice(0,1)!='0'?"0"+String(startDate.getDate()):String(startDate.getDate())
  var data = { date: `${year}-${month}-${day}` }
  axios.post(`${process.env.REACT_APP_SERVER_URL}/send_to_ftp`, data,{headers}).then((response) => {
    // handle success
    
    setMessage(response.data.message)
    handleClick()
    const myTimeout = setTimeout(() => { handleClose() }, 3000);
  }).catch((err) => {
   
    setMessage(err.data.message)
    handleClick()
    const myTimeout = setTimeout(() => { handleClose() }, 3000);
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

    <center><Tooltip title="To download a .txt file based on the date selected" arrow><Button variant="contained" onClick={downloadTxtFile}>Download </Button></Tooltip> <Tooltip title="To send a consolidated .txt file to landlord server, based on date selected" arrow><Button variant="contained" onClick={sendToFtp}>Send
    </Button></Tooltip></center>
    <br></br>
    <MuiDataCard salesData={todaySales} />
  </div>
  );
}