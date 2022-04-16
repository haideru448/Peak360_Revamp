import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import _ from "lodash"

let dt;
let PaymentAmount;
let payments;
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
    {
        id: 'population',
        label: 'Population',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'size',
        label: 'Size\u00a0(km\u00b2)',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'density',
        label: 'Density',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
];

function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
}


export default function StickyHeadTable(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>

                            <TableCell

                            >
                                Sales Description
                            </TableCell>
                            <TableCell

                            >
                                Sales Cost
                            </TableCell>
                            <TableCell


                            >
                                Sale Time
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.salesData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                


                                <TableRow hover role="checkbox" tabIndex={-1} key={row.Id}>
                                    <TableCell>
                                    <span style={{display:"none"}}>{PaymentAmount=0}</span>
                                        {row.Payments[0].Type}

                                    </TableCell>
                                    <TableCell >
                                        
                
                                        {
                                        row.PurchasedItems.forEach((payment)=>
                                        {PaymentAmount+=Number(payment.UnitPrice)}
                                        )
                                        }
                                        {
                                        Number(PaymentAmount).toFixed(2)
                                        }
                                    


                                    </TableCell>
                                    <TableCell >
                                        {row.SaleDateTime.split("-")[2].slice(0, 2)}&nbsp;
                                        {monthNames[parseInt(row.SaleDateTime.split("-")[1], 10) - 1]}&nbsp;&nbsp;
                                        {row.SaleDateTime.split("-")[0]

                                        },&nbsp;
                                        {row.SaleDateTime.split("T")[1].slice(0, 8)


                                        } &nbsp;
                                        



                                    </TableCell>



                                </TableRow>

                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={props.salesData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper >
    );
}
