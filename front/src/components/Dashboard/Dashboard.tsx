import React, { useEffect, useState } from "react";
import PageTitle from "../PageTitle/PageTitle";
import DashboardCard from "./DashboardCard";
import LoadingIndicator from "../GenericComponents/LoadingIndicator";
import { asFormattedDate, getLoggedInUserId } from "../../utils/helpers";
import AccountApiService from "../../utils/apis/accounts";
import CommissionApiService from "../../utils/apis/commissions";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import { isUserAdmin } from "../../utils/helpers";
import * as XLSX from 'xlsx';
import CustomButton from "../GenericComponents/CustomButton";



function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCommission, setTotalCommission] = useState<number | string>("");
  const [weekCommission, setWeekCommission] = useState<number | string>("");
  const [childrenCount, setChildrenCount] = useState<number | string>("");
  const isAdmin = isUserAdmin();
  const [adminCommissionData, setAdminCommissionData] = useState<any[]>([]); // Admin data
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query

  const getWeekDates = () => {
    const today = new Date();
    const previousWeekLastDay = new Date(
      today.setDate(today.getDate() - today.getDay())
    );
    const previousWeekFirstDay = new Date(previousWeekLastDay);
    previousWeekFirstDay.setDate(previousWeekFirstDay.getDate() - 6);

    return {
      firstDay: asFormattedDate(previousWeekFirstDay),
      lastDay: asFormattedDate(previousWeekLastDay),
    };
  };

  const getMonthDates = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    return {
      firstDay: asFormattedDate(firstDay),
      lastDay: asFormattedDate(lastDay),
    };
  };

  const sumCommissions = (commissions: any[]): number => {
    return commissions.reduce((accumulator: number, currentValue: any) => {
      return (
        accumulator + (parseFloat(currentValue.commissionValue.toString()) || 0)
      );
    }, 0);
  };

  

  const fetchData = async () => {
    const downlines = await AccountApiService.getDownlines();
    setChildrenCount(downlines.length ? downlines.length : "0");

    const userCommission = await CommissionApiService.getCommissionBetween(
      getMonthDates().firstDay,
      getMonthDates().lastDay
    );
    setTotalCommission(sumCommissions(userCommission).toFixed(2));

    const weekCommissions = await CommissionApiService.getCommissionBetween(
      getWeekDates().firstDay,
      getWeekDates().lastDay
    );
    setWeekCommission(sumCommissions(weekCommissions));

    if (isAdmin) {
      const adminData = await CommissionApiService.getAllUsersCommissions(
        getWeekDates(),
        getMonthDates()
      );

      // Log the admin commission data to check for correctness
      // console.log("Admin Commission Data: ", adminData);

      setAdminCommissionData(adminData);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
 
  // Filter by both firstName and lastName
  const filteredAdminData = adminCommissionData.filter((userCommission) =>
    `${userCommission.firstName} ${userCommission.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) &&
      parseFloat(userCommission.weeklyCommission) > 0
  );

  // Slice the data for pagination
  const paginatedData = filteredAdminData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredAdminData.map(userCommission => ({
      User: `${userCommission.firstName} ${userCommission.lastName}`,
      MT5_ID: userCommission.mt5Id,
      Broker_ID: userCommission.brokerId,
      Weekly_Commission: `$${parseFloat(userCommission.weeklyCommission || 0).toFixed(2)}`
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Commissions");
    
    // Write the file
    XLSX.writeFile(wb, "Commissions.xlsx");
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <Container maxWidth="xl"> {/* Adjust the maxWidth for better responsiveness */}
      <PageTitle title="Dashboard" />
      <Grid container spacing={3} style={{ marginBottom: "20px", marginTop: "20px" }}>
        {/* Adjust grid item sizes for different screens */}
        <Grid item xs={12} sm={6} md={4} lg={6}>
          <DashboardCard
            title="Number of Downlines"
            value={childrenCount + " accounts"}
            icon="people"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={6}>
          <DashboardCard
            title="Weekly Commission"
            value={weekCommission + "$"}
            icon="attach_money"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={6}>
          <DashboardCard
            title="My User ID"
            value={getLoggedInUserId()}
            icon="person"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={6}>
          <DashboardCard
            title="Monthly Commission"
            value={totalCommission + "$"}
            icon="trending_up"
          />
        </Grid>
      </Grid>

      {isAdmin && (
        <>
          <Grid container spacing={3} justifyContent="space-between">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Search by Name"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                fullWidth
                style={{ marginBottom: "20px", marginTop: "20px" }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3} style={{ marginTop: "20px" }}>
              <CustomButton
                title="Export to Excel"
                onSubmit={exportToExcel}
                isLoading={false}
                disabled={false}
              />
            </Grid>
          </Grid>
          <div style={{ overflowX: "auto" }}> {/* Enables horizontal scrolling for the table on smaller screens */}
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="admin commission table">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell align="left">MT5 ID</TableCell>
                    <TableCell align="left">Broker ID</TableCell>
                    <TableCell align="left">Weekly Commission</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((userCommission) => (
                    <TableRow key={userCommission.userId}>
                      <TableCell component="th" scope="row">
                        {`${userCommission.firstName} ${userCommission.lastName}`}
                      </TableCell>
                      <TableCell align="left">{userCommission.mt5Id}</TableCell>
                      <TableCell align="left">{userCommission.brokerId}</TableCell>
                      <TableCell align="left">
                        {`$${parseFloat(userCommission.weeklyCommission || 0).toFixed(2)}`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredAdminData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Container>
  );
}


export default Dashboard;




// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import PageTitle from "../PageTitle/PageTitle";
// import classes from "./styles.module.css";
// import DashboardCard from "./DashboardCard";
// import LoadingIndicator from "../GenericComponents/LoadingIndicator";
// import {
//   asFormattedDate,
//   getLoggedInUserId,
//   isUserAdmin,
// } from "../../utils/helpers";
// import AccountApiService from "../../utils/apis/accounts";
// import CommissionApiService from "../../utils/apis/commissions";

// function Dashboard() {
//   const [isLoading, setIsLoading] = React.useState<boolean>(true);
//   const [totalCommission, setTotalCommission] = React.useState<number | string>(
//     ""
//   );
//   const [weekCommission, setWeekCommission] = React.useState<number | string>(
//     ""
//   );
//   const [childrenCount, setChildrenCount] = React.useState<number | string>("");

//   const getWeekDates = () => {
//     const today = new Date();
//     const previousWeekLastDay = new Date(
//       today.setDate(today.getDate() - today.getDay())
//     ); // Adjusted to last Sunday
//     const previousWeekFirstDay = new Date(previousWeekLastDay);
//     previousWeekFirstDay.setDate(previousWeekFirstDay.getDate() - 6); // Adjusted to last Monday
//     // Now previousWeekFirstDay is the first day of the previous week (Monday)
//     // previousWeekLastDay is the last day of the previous week (Sunday)

//     // Formatting the dates
//     return {
//       firstDay: asFormattedDate(previousWeekFirstDay),
//       lastDay: asFormattedDate(previousWeekLastDay),
//     };
//   };

//   const getMonthDates = () => {
//     const currentDate = new Date();

//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1

//     const validatedMonth = Math.max(1, Math.min(12, month));
//     const firstDay = new Date(year, validatedMonth - 1, 1);
//     const lastDay = new Date(year, validatedMonth, 0);
//     return {
//       firstDay: asFormattedDate(firstDay),
//       lastDay: asFormattedDate(lastDay),
//     };
//   };

//   const sumCommissions = (commission: any[]): number => {
//     return commission.reduce((accumulator: number, currentValue: any) => {
//       return (
//         accumulator + (parseFloat(currentValue.commissionValue.toString()) || 0)
//       );
//     }, 0);
//   };

//   const fetchData = async () => {
//     const downlines = await AccountApiService.getDownlines();
//     if (!downlines.length) setChildrenCount("0");
//     else setChildrenCount(downlines.length);
//     const commission = await CommissionApiService.getCommissionBetween(
//       getMonthDates().firstDay,
//       getMonthDates().lastDay
//     );
//     setTotalCommission(sumCommissions(commission).toFixed(2));
//     console.log(getWeekDates().firstDay);
//     console.log(getWeekDates().lastDay);

//     const weekCommissions = await CommissionApiService.getCommissionBetween(
//       getWeekDates().firstDay,
//       getWeekDates().lastDay
//     );
//     setWeekCommission(sumCommissions(weekCommissions));

//     setIsLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   if (isLoading) return <LoadingIndicator />;
//   // if (isAdmin) return <>Welcome Admin !</>
//   return (
//     <div>
//       <PageTitle title="Dashboard" />
//       <div className={classes.gridContainer}>
//         <DashboardCard
//           title="Number of downlines"
//           value={childrenCount + " accounts"}
//         />
// <DashboardCard title="Weekly commission" value={weekCommission + "$"} />
//       </div>
//       <div className={classes.gridContainer}>
//         <DashboardCard title="My User ID" value={getLoggedInUserId()} />
//         <DashboardCard
//           title="Monthly commission"
//           value={totalCommission + "$"}
//         />
//       </div>
//     </div>
//   );
// }

// export default Dashboard;
