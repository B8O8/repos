// import React, { useEffect } from "react";
// import PageTitle from "../PageTitle/PageTitle";
// import DashboardCard from "./DashboardCard";
// import LoadingIndicator from "../GenericComponents/LoadingIndicator";
// import { asFormattedDate, getLoggedInUserId } from "../../utils/helpers";
// import AccountApiService from "../../utils/apis/accounts";
// import CommissionApiService from "../../utils/apis/commissions";
// import Grid from "@mui/material/Grid";
// import Container from "@mui/material/Container";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";

// function createData(date: string, description: string, amount: string) {
//   return { date, description, amount };
// }

// const rows = [
//   createData("2024-08-20", "Commission Payment", "$120.00"),
//   createData("2024-08-19", "Product Purchase", "$80.00"),
//   createData("2024-08-18", "Commission Payment", "$100.00"),
//   createData("2024-08-17", "Referral Bonus", "$50.00"),
//   createData("2024-08-16", "Product Purchase", "$75.00"),
// ];

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
//     );
//     const previousWeekFirstDay = new Date(previousWeekLastDay);
//     previousWeekFirstDay.setDate(previousWeekFirstDay.getDate() - 6);

//     return {
//       firstDay: asFormattedDate(previousWeekFirstDay),
//       lastDay: asFormattedDate(previousWeekLastDay),
//     };
//   };

//   const getMonthDates = () => {
//     const currentDate = new Date();
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth() + 1;
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

//   return (
//     <Container maxWidth="lg">
//       <PageTitle title="Dashboard" />
//       <Grid style={{ marginTop: "15px" }} container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <DashboardCard
//             title="Number of Downlines"
//             value={childrenCount + " accounts"}
//             icon="people"
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <DashboardCard
//             title="Weekly Commission"
//             value={weekCommission + "$"}
//             icon="attach_money"
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <DashboardCard
//             title="My User ID"
//             value={getLoggedInUserId()}
//             icon="person"
//           />
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <DashboardCard
//             title="Monthly Commission"
//             value={totalCommission + "$"}
//             icon="trending_up"
//           />
//         </Grid>
//       </Grid>

//       {/* Table Section */}
//       <TableContainer component={Paper} style={{ marginTop: "40px" }}>
//         <Table sx={{ minWidth: 650 }} aria-label="transaction table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Date</TableCell>
//               <TableCell align="left">Description</TableCell>
//               <TableCell align="right">Amount</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row) => (
//               <TableRow
//                 key={row.date}
//                 sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//               >
//                 <TableCell component="th" scope="row">
//                   {row.date}
//                 </TableCell>
//                 <TableCell align="left">{row.description}</TableCell>
//                 <TableCell align="right">{row.amount}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// }

// export default Dashboard;
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
      return accumulator + (parseFloat(currentValue.commissionValue.toString()) || 0);
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
      .includes(searchQuery.toLowerCase())
  );

  // Slice the data for pagination
  const paginatedData = filteredAdminData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <Container maxWidth="lg">
      <PageTitle title="Dashboard" />
      <Grid style={{ marginTop: "15px" }} container spacing={3}>
        <Grid item xs={12} md={6}>
          <DashboardCard
            title="Number of Downlines"
            value={childrenCount + " accounts"}
            icon="people"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCard
            title="Weekly Commission"
            value={weekCommission + "$"}
            icon="attach_money"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCard
            title="My User ID"
            value={getLoggedInUserId()}
            icon="person"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DashboardCard
            title="Monthly Commission"
            value={totalCommission + "$"}
            icon="trending_up"
          />
        </Grid>
      </Grid>

      {isAdmin && (
        <>
          <TextField
            label="Search by Name"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              width: "25%", // Set the width to a quarter of the table's width
            }}
          />
          <TableContainer component={Paper} style={{ marginTop: "20px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="admin commission table">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell align="left">Monthly Commission</TableCell>
                  <TableCell align="left">Weekly Commission</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((userCommission) => (
                  <TableRow
                    key={userCommission.userId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {`${userCommission.firstName} ${userCommission.lastName}`}
                    </TableCell>
                    <TableCell align="left">
                      {parseFloat(userCommission.monthlyCommission || 0).toFixed(2) + "$"}
                    </TableCell>
                    <TableCell align="left">
                      {parseFloat(userCommission.weeklyCommission || 0).toFixed(2) + "$"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredAdminData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
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
