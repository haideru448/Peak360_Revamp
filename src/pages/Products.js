/* eslint-disable */
import React, { useEffect } from 'react';
import frLocale from 'date-fns/locale/fr';
import ruLocale from 'date-fns/locale/ru';
import arSaLocale from 'date-fns/locale/ar-SA';
import enLocale from 'date-fns/locale/en-US';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

import TableContainer from '@mui/material/TableContainer';
import toast, { Toaster } from 'react-hot-toast';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import _ from 'lodash';
import Tooltip from '@mui/material/Tooltip';
import { Button, Typography, Box } from '@mui/material';
import List from '../components/List';

const localeMap = {
  en: enLocale,
  fr: frLocale,
  ru: ruLocale,
  ar: arSaLocale
};

let j = 0;

export default function LocalizedTimePicker() {
  const [locale, setLocale] = React.useState('ru');
  let [value, setValue] = React.useState([
    new Date('2011-07-14 15:00'),
    new Date('2011-07-14 23:59'),
    new Date(),
    new Date(),
    new Date()
  ]);
  const [disabledState, setDisabledState] = React.useState(true);
  const [intervalsData, setIntervalsData] = React.useState([]);

  const [intervalData, setIntervalData] = React.useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/logs`).then((response) => {
      
      setIntervalData(response.data.logs);
    });
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/add_interval`)
      .then((response) => {
        
        

        setIntervalsData(response.data.intervals);
        
        if (response.data.intervals.length > 0) {
          setIntervalTimes(response?.data.intervals.length, response?.data.intervals);
        }
      })
      .catch((e) => {
        toast.error('Please Try Again Later');
        
      });

    const setIntervalTimes = (intervalsLength, intervalsData) => {
      
      value = [];

      setValue(value);
      
      for (j = 0; j < intervalsLength; j += 1) {
        

        value.push(new Date(`2011-07-14 ${intervalsData[j]}`));
      }
      setValue(value);
      setNoOfIntervals(intervalsLength)
      
    };
  }, []);



  const getIntervalData = (params) => {
    axios.get(`${process.env.REACT_APP_SERVER_URL}/logs`).then((response) => {
      
      setIntervalData(response.data.logs);
    });
    
    
  }

  let [noOfIntervals, setNoOfIntervals] = React.useState(3);
  const [noOfChange, setNoOfChange] = React.useState(0);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [intervalsArray, setIntervalsArray] = React.useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const sendIntervals = () => {
    const filteredArray = [];
    
    let i = 0;
    for (i = 0; i < noOfIntervals; i += 1) {
      
     if(value[i]===null || value[i]==='' || value[i]===undefined  )
     {continue} 
      

      filteredArray.push(
        `${value[i].getHours() < 10 ? `0${value[i].getHours()}` : value[i].getHours()}:${
          value[i].getMinutes() < 10 ? `0${value[i].getMinutes()}` : value[i].getMinutes()
        }:${value[i].getSeconds() < 10 ? `0${value[i].getSeconds()}` : value[i].getSeconds()}`
      );
    }

    const data = { intervals: filteredArray, count: noOfIntervals };
    axios
      .post(`${process.env.REACT_APP_SERVER_URL}/add_interval`, data)
      .then((response) => {
        
        toast.success('Intervals Added');
        
        getIntervalData()
      })
      .catch(() => {
        toast.error('Please Try Again Later');
      });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const changeTime = (newValue, index) => {
    value[index] = newValue;
    
    setValue(value);
  };

  const selectLocale = (newLocale) => {
    setLocale(newLocale);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={localeMap[locale]}>
        <div>
        <Toaster
  position="top-center"
  reverseOrder={false}
/>
          <center>
            {_.times(noOfIntervals, (index) => (
              <>
                <TimePicker
                  value={value[index]}
                  onChange={(newValue) => {
                    changeTime(newValue, index);
                    setNoOfChange(noOfChange + 1);

                    
                  }}
                  disabled={disabledState}
                  renderInput={(params) => <TextField {...params} disabled={disabledState} />}
                />
                <br /> <br />
              </>
            ))}
            <Tooltip title="Click Here to Insert more Intervals . 5(max)" arrow>
              <Button
                variant="contained"
                onClick={() => {
                  if (noOfIntervals !== 5){
                    setNoOfIntervals(noOfIntervals + 1)
                  } ;
                }}
              >
                +{' '}
              </Button>
            </Tooltip>
            <br />
            <br />
            <Button
              variant="contained"
              onClick={() => {
                sendIntervals();
              }}
            >
              Save
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              variant="contained"
              onClick={() => {
                
                setDisabledState(false);
              }}
            >
              Edit{' '}
            </Button>
          </center>
        </div>
      </LocalizationProvider>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Interval No</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Logs</TableCell>

                <TableCell>Past date Selection</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {intervalData.map((option) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={1}>
                  <TableCell>{option.date}</TableCell>
                  <TableCell>{option.interval_no}</TableCell>
                  <TableCell>{option.time}</TableCell>
                  <TableCell>{option.logs}</TableCell>
                  <TableCell>{option.past_date_selection}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count="12"
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
