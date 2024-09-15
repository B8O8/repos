import * as React from "react";
import CommissionApiService from "../../utils/apis/commissions";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  TablePagination,
} from "@mui/material";
import {
  ToastType,
  asFormattedDate,
  isUserAdmin,
  notify,
} from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { IUserGet } from "../../utils/interfaces/IUser";
import AccountApiService from "../../utils/apis/accounts";
import CustomButton from "../GenericComponents/CustomButton";
import { useMediaQuery } from "@mui/material";

const tableRowOddSx = {
  color: "black",
  backgroundColor: "white",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "200px",
};
const tableRowEvenSx = {
  backgroundColor: "#D5D5D5",
  color: "black",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "200px",
};
const tableHeaderSx = {
  color: "white",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "200px",
};

export default function CommissionsTable() {
  const navigate = useNavigate();
  const [from, setFrom] = React.useState<string>();
  const [to, setTo] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [commissionsData, setCommissionsData] = React.useState<any>();
  const [filteredCommissionsData, setFiltererdCommissionsData] =
    React.useState<any>();
  const isAdmin = isUserAdmin();
  const fetchData = async () => {
    setIsLoading(true);
    const response = await CommissionApiService.getCommissions();
    setCommissionsData(response);
    setFiltererdCommissionsData(response);
    const downlines = await AccountApiService.getDownlines();
    setUserOptions(downlines);
    setIsLoading(false);
  };
  const [userFilter, setUserFilter] = React.useState<string>("");
  const [userOptions, setUserOptions] = React.useState<IUserGet[]>([]);
  const isMobile = window.innerWidth <= 768;

  const isMobileDiv = useMediaQuery("(max-width:1129px)");

  // Pagination state
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const reset = async () => {
    setFrom(undefined);
    setTo(undefined);
    const response = await CommissionApiService.getCommissions();
    setFiltererdCommissionsData(response);
  };

  const submit = async () => {
    if (!from || !to)
      return notify("Please specify date range", ToastType.ERROR);
    const arr = userFilter ? filteredCommissionsData : commissionsData;
    setFiltererdCommissionsData(
      arr.filter((e: any) => {
        const d = new Date(e.date);
        const fromD = new Date(from);
        const toD = new Date(to);
        if (d >= fromD && d <= toD) {
          return e;
        }
      })
    );
  };

  if (isLoading)
    return (
      <div
      // style={{
      //   width: "100vw",
      //   height: "100vh",
      //   display: "flex",
      //   justifyContent: "center",
      //   alignItems: "center",
      // }}
      >
        <CircularProgress size={55} />
      </div>
    );
  if (isAdmin)
    return (
      <div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <TextField
            sx={{ flex: "1 1 100%", marginTop: "15px" }}
            fullWidth
            label="Upline ID"
            select
            value={userFilter}
            onChange={(e) => {
              setUserFilter(e.target.value);
              if (e.target.value !== undefined) {
                setFiltererdCommissionsData(
                  commissionsData.filter(
                    (row: any) =>
                      row.uplineEmail ===
                      userOptions.find(
                        (option) => option.id === parseInt(e.target.value)
                      )?.email
                  )
                );
              }
            }}
          >
            {userOptions.map((user) => {
              return (
                <MenuItem key={user.id} value={user.id}>
                  {user.firstName + " " + user.lastName}
                </MenuItem>
              );
            })}
          </TextField>
          <DatePicker
            label="from"
            sx={{ flex: "1 1 45%", marginTop: "15px" }}
            value={from ? dayjs(from) : null}
            name="dateFilter"
            onChange={(value) => setFrom(dayjs(value).toDate().toDateString())}
          />
          <DatePicker
            label="to"
            sx={{ flex: "1 1 45%", marginTop: "15px" }}
            value={to ? dayjs(to) : null}
            name="dateFilter"
            onChange={(value) => setTo(dayjs(value).toDate().toDateString())}
          />
          <CustomButton
            width="200px"
            title="Reset"
            onSubmit={reset}
            isLoading={false}
            disabled={false}
            // sx={{ flex: "1 1 20%", marginTop: "15px" }}
          />
          <CustomButton
            width="200px"
            title="Search"
            onSubmit={submit}
            isLoading={false}
            disabled={false}
            // sx={{ flex: "1 1 20%", marginTop: "15px" }}
          />
          <CustomButton
            width="200px"
            title="Upload commission"
            onSubmit={() => navigate("/upload-commissions")}
            isLoading={false}
            disabled={false}
            // sx={{ flex: "1 1 100%", marginTop: "15px" }}
          />
          <CustomButton
            width="200px"
            title="Send monthly email"
            onSubmit={() => navigate("/send-monthly-email")}
            isLoading={false}
            disabled={false}
            // sx={{ flex: "1 1 100%", marginTop: "15px" }}
          />

          <CustomButton
            width="250px"
            title=" Upload commission test"
            onSubmit={() => navigate("/upload-commissions-test")}
            isLoading={false}
            disabled={false}
          />

          {/* <Button
            style={{
              background: "#050d31",
              color: "white",
              marginRight: "15px",
            }}
            onClick={() => navigate("/upload-commissions-test")}
          >
            Upload commission test
          </Button> */}
        </div>
        <TableContainer component={Paper} style={{ marginTop: "40px" }}>
          <Table sx={{ minWidth: 650 }} aria-label="transaction table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="left">Upline</TableCell>
                <TableCell align="left">Downline</TableCell>
                <TableCell align="right">Commission</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCommissionsData && filteredCommissionsData.length > 0 ? (
                <>
                  {filteredCommissionsData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any, index: number) => {
                      const sx =
                        index % 2 === 0 ? tableRowEvenSx : tableRowOddSx;
                      return (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {asFormattedDate(row.date)}
                          </TableCell>
                          <TableCell align="left">
                            {row.uplineFirstName + " " + row.uplineLastName}
                          </TableCell>
                          <TableCell align="left">
                            {row.downlineFirstName + " " + row.downlineLastName}
                          </TableCell>
                          <TableCell align="right">
                            {row.commissionValue}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell align="right">Total: </TableCell>
                    <TableCell align="right">
                      {filteredCommissionsData
                        .reduce(
                          (accumulator: number, currentValue: any) =>
                            accumulator +
                            parseFloat(currentValue.commissionValue),
                          0
                        )
                        .toFixed(2)}
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                <span style={{ color: "white" }}>
                  No Commissions for this date, try changing the filter
                </span>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={filteredCommissionsData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
    );
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
        <DatePicker
          label="from"
          sx={{
            flex: "1 1 45%",
            marginTop: isMobile ? "5px" : "25px",
            marginBottom: isMobile ? "5px" : "25px",
            marginRight: isMobile ? "0px" : "15px",
          }}
          value={from ? from : null}
          name="dateFilter"
          onChange={(value) => setFrom(dayjs(value).toDate().toDateString())}
        />
        <DatePicker
          label="to"
          sx={{
            flex: "1 1 45%",
            marginTop: "25px",
            marginBottom: "25px",
          }}
          value={to ? to : null}
          name="dateFilter"
          onChange={(value) => setTo(dayjs(value).toDate().toDateString())}
        />
        <Button
          style={{
            background: "red",
            color: "white",
            height: isMobile ? "100%" : "50px",
          }}
          onClick={() => reset()}
        >
          Reset
        </Button>
        <Button
          style={{
            background: "#050d31",
            color: "white",
            height: isMobile ? "100%" : "50px",
          }}
          onClick={() => submit()}
        >
          Search
        </Button>
      </div>
      <TableContainer component={Paper} style={{ marginTop: "40px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="transaction table">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="left">Upline</TableCell>
              <TableCell align="left">Downline</TableCell>
              <TableCell align="right">Commission</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCommissionsData && filteredCommissionsData.length > 0 ? (
              <>
                {filteredCommissionsData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any, index: number) => {
                    const sx = index % 2 === 0 ? tableRowEvenSx : tableRowOddSx;
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {asFormattedDate(row.date)}
                        </TableCell>
                        <TableCell align="left">
                          {row.uplineFirstName + " " + row.uplineLastName}
                        </TableCell>
                        <TableCell align="left">
                          {row.downlineFirstName + " " + row.downlineLastName}
                        </TableCell>
                        <TableCell align="right">
                          {row.commissionValue}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right">Total: </TableCell>
                  <TableCell align="right">
                    {filteredCommissionsData
                      .reduce(
                        (accumulator: number, currentValue: any) =>
                          accumulator +
                          parseFloat(currentValue.commissionValue),
                        0
                      )
                      .toFixed(2)}
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <span style={{ color: "white" }}>
                No Commissions for this date, try changing the filter
              </span>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredCommissionsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
}

// import * as React from "react";
// import CommissionApiService from "../../utils/apis/commissions";
// import dayjs, { Dayjs } from "dayjs";
// import { DatePicker } from "@mui/x-date-pickers";
// import {
//   Button,
//   CircularProgress,
//   MenuItem,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
// } from "@mui/material";
// import {
//   ToastType,
//   asFormattedDate,
//   isUserAdmin,
//   notify,
// } from "../../utils/helpers";
// import { useNavigate } from "react-router-dom";
// import { IUserGet } from "../../utils/interfaces/IUser";
// import AccountApiService from "../../utils/apis/accounts";

// const tableRowOddSx = {
//   color: "black",
//   backgroundColor: "white",
//   whiteSpace: "nowrap",
//   overflow: "hidden",
//   textOverflow: "ellipsis",
//   width: "200px",
// };
// const tableRowEvenSx = {
//   backgroundColor: "#D5D5D5",
//   color: "black",
//   whiteSpace: "nowrap",
//   overflow: "hidden",
//   textOverflow: "ellipsis",
//   width: "200px",
// };
// const tableHeaderSx = {
//   color: "white",
//   whiteSpace: "nowrap",
//   overflow: "hidden",
//   textOverflow: "ellipsis",
//   width: "200px",
// };
// export default function CommissionsTable() {
//   const navigate = useNavigate();
//   const [from, setFrom] = React.useState<string>();
//   const [to, setTo] = React.useState<string>();
//   const [isLoading, setIsLoading] = React.useState<boolean>(true);
//   const [commissionsData, setCommissionsData] = React.useState<any>();
//   const [filteredCommissionsData, setFiltererdCommissionsData] =
//     React.useState<any>();
//   const isAdmin = isUserAdmin();
//   const fetchData = async () => {
//     setIsLoading(true);
//     const response = await CommissionApiService.getCommissions();
//     setCommissionsData(response);
//     setFiltererdCommissionsData(response);
//     const downlines = await AccountApiService.getDownlines();
//     setUserOptions(downlines);
//     setIsLoading(false);
//   };
//   const [userFilter, setUserFilter] = React.useState<string>("");
//   const [userOptions, setUserOptions] = React.useState<IUserGet[]>([]);
//   const isMobile = window.innerWidth <= 768;

//   React.useEffect(() => {
//     fetchData();
//   }, []);

//   const reset = async () => {
//     setFrom(undefined);
//     setTo(undefined);
//     const response = await CommissionApiService.getCommissions();
//     setFiltererdCommissionsData(response);
//   };

//   const submit = async () => {
//     if (!from || !to)
//       return notify("Please specify date range", ToastType.ERROR);
//     const arr = userFilter ? filteredCommissionsData : commissionsData;
//     setFiltererdCommissionsData(
//       arr.filter((e: any) => {
//         const d = new Date(e.date);
//         const fromD = new Date(from);
//         const toD = new Date(to);
//         console.log("d: ", asFormattedDate(d));
//         console.log("fromD: ", asFormattedDate(fromD));
//         console.log("toD: ", asFormattedDate(toD));
//         if (d >= fromD && d <= toD) {
//           return e;
//         }
//       })
//     );
//   };

//   if (isLoading)
//     return (
//       <div
//         style={{
//           width: "100vw",
//           height: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <CircularProgress size={55} />
//       </div>
//     );
//   if (isAdmin)
//     return (
//       <div>
//         <div style={{ marginLeft: "2.5%" }}>
//           <div>
//             <TextField
//               sx={{ width: !isMobile ? "85%" : "100%", marginTop: "15px" }}
//               fullWidth={isMobile}
//               label="Upline ID"
//               select
//               value={userFilter}
//               onChange={(e) => {
//                 setUserFilter(e.target.value);
//                 if (e.target.value !== undefined) {
//                   setFiltererdCommissionsData(
//                     commissionsData.filter(
//                       (row: any) =>
//                         row.uplineEmail ===
//                         userOptions.find(
//                           (option) => option.id === parseInt(e.target.value)
//                         )?.email
//                     )
//                   );
//                 }
//               }}
//             >
//               {userOptions.map((user) => {
//                 return (
//                   <MenuItem value={user.id}>
//                     {user.firstName + " " + user.lastName}
//                   </MenuItem>
//                 );
//               })}
//             </TextField>

//             <DatePicker
//               label="from"
//               sx={{
//                 marginTop: isMobile ? "5px" : "25px",
//                 marginBottom: isMobile ? "5px" : "25px",
//                 marginRight: isMobile ? "0px" : "15px",
//               }}
//               value={from ? dayjs(from) : null}
//               name="dateFilter"
//               onChange={(value) =>
//                 setFrom(dayjs(value).toDate().toDateString())
//               }
//             />
//             <DatePicker
//               label="to"
//               sx={{
//                 marginTop: "25px",
//                 marginBottom: "25px",
//               }}
//               value={to ? dayjs(to) : null}
//               name="dateFilter"
//               onChange={(value) => setTo(dayjs(value).toDate().toDateString())}
//             />
//             <Button
//               style={{
//                 background: "red",
//                 color: "white",
//                 height: isMobile ? "100%" : "50px",
//               }}
//               onClick={() => reset()}
//             >
//               Reset
//             </Button>
//             <Button
//               style={{
//                 background: "#050d31",
//                 color: "white",
//                 height: isMobile ? "100%" : "50px",
//               }}
//               onClick={() => submit()}
//             >
//               Search
//             </Button>
//           </div>
//           <Button
//             style={{
//               background: "#050d31",
//               color: "white",
//               marginRight: "15px",
//             }}
//             onClick={() => navigate("/upload-commissions")}
//           >
//             Upload commission
//           </Button>
//           <Button
//             style={{
//               background: "#050d31",
//               color: "white",
//               marginRight: "15px",
//             }}
//             onClick={() => navigate("/send-monthly-email")}
//           >
//             Send monthly email
//           </Button>
//         </div>
//         <TableContainer
//           sx={{
//             width: "95%",
//             marginLeft: "2.5%",
//             marginTop: "5px",
//             height: "80vh",
//             overflowY: "scroll",
//           }}
//           component={Paper}
//         >
//           <Table
//             sx={{ minWidth: 650, borderRadius: 0 }}
//             aria-label="simple table"
//           >
//             <TableHead sx={{ background: "#050d31" }}>
//               <TableRow sx={{ height: "15px" }}>
//                 <TableCell sx={tableHeaderSx}>Date</TableCell>
//                 <TableCell sx={tableHeaderSx}>Upline</TableCell>
//                 <TableCell sx={tableHeaderSx}>Downline</TableCell>
//                 <TableCell sx={tableHeaderSx}>Commission</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredCommissionsData && filteredCommissionsData.length > 0 ? (
//                 <>
//                   {filteredCommissionsData.map((row: any, index: number) => {
//                     const sx = index % 2 === 0 ? tableRowEvenSx : tableRowOddSx;
//                     return (
//                       <TableRow
//                         key={index}
//                         sx={{
//                           "&:last-child td, &:last-child th": { border: 0 },
//                         }}
//                       >
//                         <TableCell sx={sx}>
//                           {asFormattedDate(row.date)}
//                         </TableCell>
//                         <TableCell sx={sx}>
//                           {row.uplineFirstName + " " + row.uplineLastName}
//                         </TableCell>
//                         <TableCell sx={sx}>
//                           {row.downlineFirstName + " " + row.downlineLastName}
//                         </TableCell>
//                         <TableCell sx={sx}>{row.commissionValue}</TableCell>
//                       </TableRow>
//                     );
//                   })}
//                   <TableRow>
//                     <TableCell></TableCell>
//                     <TableCell></TableCell>
//                     <TableCell>Total: </TableCell>
//                     <TableCell>
//                       {filteredCommissionsData
//                         .reduce(
//                           (accumulator: number, currentValue: any) =>
//                             accumulator +
//                             parseFloat(currentValue.commissionValue),
//                           0
//                         )
//                         .toFixed(2)}
//                     </TableCell>
//                   </TableRow>
//                 </>
//               ) : (
//                 <span style={{ color: "white" }}>
//                   No Commissions for this date, try changing the filter
//                 </span>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>
//     );
//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           flexDirection: isMobile ? "column" : "row",
//           gap: isMobile ? "-5px" : "15px",
//           width: "95%",
//           marginLeft: "2.5%",
//           marginTop: "5px",
//           marginBottom: "50px",
//           justifyContent: "flex-start",
//           alignItems: "center",
//         }}
//       >
//         <DatePicker
//           label="from"
//           sx={{
//             marginTop: isMobile ? "5px" : "25px",
//             marginBottom: isMobile ? "5px" : "25px",
//             marginRight: isMobile ? "0px" : "15px",
//           }}
//           value={from ? from : null}
//           name="dateFilter"
//           onChange={(value) => setFrom(dayjs(value).toDate().toDateString())}
//         />
//         <DatePicker
//           label="to"
//           sx={{
//             marginTop: "25px",
//             marginBottom: "25px",
//           }}
//           value={to ? to : null}
//           name="dateFilter"
//           onChange={(value) => setTo(dayjs(value).toDate().toDateString())}
//         />
//         <Button
//           style={{
//             background: "red",
//             color: "white",
//             height: isMobile ? "100%" : "50px",
//           }}
//           onClick={() => reset()}
//         >
//           Reset
//         </Button>
//         <Button
//           style={{
//             background: "#050d31",
//             color: "white",
//             height: isMobile ? "100%" : "50px",
//           }}
//           onClick={() => submit()}
//         >
//           Search
//         </Button>
//       </div>
//       <TableContainer
//         sx={{
//           width: "95%",
//           marginLeft: "2.5%",
//           marginTop: "5px",
//           height: "80vh",
//           overflowY: "scroll",
//           marginBottom: "50px",
//         }}
//         component={Paper}
//       >
//         <Table
//           sx={{ minWidth: "100%", borderRadius: 0 }}
//           aria-label="simple table"
//         >
//           <TableHead
//             sx={{
//               background: "#050d31",
//             }}
//           >
//             <TableRow sx={{ height: "15px" }}>
//               <TableCell sx={tableHeaderSx}>Date</TableCell>
//               <TableCell sx={tableHeaderSx}>Level</TableCell>
//               <TableCell sx={tableHeaderSx}>Email</TableCell>
//               <TableCell sx={tableHeaderSx}>MT5 ID</TableCell>
//               <TableCell sx={tableHeaderSx}>My Commission</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {commissionsData && commissionsData.length > 0 ? (
//               commissionsData.map((row: any, index: number) => {
//                 const sx = index % 2 === 0 ? tableRowEvenSx : tableRowOddSx;
//                 return (
//                   <TableRow
//                     key={index}
//                     sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
//                   >
//                     <TableCell sx={sx}>{asFormattedDate(row.date)}</TableCell>
//                     <TableCell sx={sx}>{row.level}</TableCell>
//                     <TableCell sx={sx}>{row.downlineEmail}</TableCell>
//                     <TableCell sx={sx}>{row.downlineMd5Id}</TableCell>
//                     <TableCell sx={sx}>{row.commissionValue}</TableCell>
//                   </TableRow>
//                 );
//               })
//             ) : (
//               <span style={{ color: "white" }}>
//                 No Commissions for this date, try changing the filter
//               </span>
//             )}
//             <TableRow>
//               <TableCell></TableCell>
//               <TableCell></TableCell>
//               <TableCell></TableCell>
//               <TableCell></TableCell>
//               <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
//               <TableCell style={{ fontWeight: "bold" }}>
//                 {commissionsData.reduce(
//                   (accumulator: number, currentValue: any) => {
//                     return (
//                       accumulator +
//                       (parseFloat(currentValue.commissionValue.toString()) || 0)
//                     );
//                   },
//                   0
//                 )}
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// }
