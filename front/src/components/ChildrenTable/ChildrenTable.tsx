import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  TextField,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { isUserAdmin } from "../../utils/helpers";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import LanIcon from "@mui/icons-material/Lan";
import LevelFilter from "./LevelFilter";
import CustomButton from "../GenericComponents/CustomButton";
import AccountApiService from "../../utils/apis/accounts";
import { IUserGet } from "../../utils/interfaces/IUser";
import { ROUTES } from "../../utils/routes";
import DeleteDialog from "./Dialogs/DeleteDialog";
import ResetPasswordDialog from "./Dialogs/ResetPasswordDialog";
import { levelFilterOption } from "./TableData";

export default function ChildrenTable() {
  const navigate = useNavigate();
  const [levelFilter, setLevelFilter] = React.useState<string>("All");
  const isAdmin = isUserAdmin();
  const [deleteDialogOpen, setDeleteDialogOpen] =
    React.useState<boolean>(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] =
    React.useState<boolean>(false);
  const [selectedId, setSelectedId] = React.useState<number>(-1);
  const [rows, setRows] = React.useState<IUserGet[]>([]);
  const [filteredRows, setFilteredRows] = React.useState<IUserGet[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchData = async () => {
    const downlines = await AccountApiService.getDownlines();
    setRows(downlines);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    const levelFilterAsNumber = parseInt(levelFilter);
    let filtered = rows;

    if (!isNaN(levelFilterAsNumber)) {
      filtered = filtered.filter((e) => e.level === levelFilterAsNumber);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (row) =>
          `${row.firstName} ${row.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          row.md5Id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRows(filtered);
  }, [rows, levelFilter, searchQuery]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
        sx={{ marginTop: 5, padding: "0 16px" }}
      >
        {!isAdmin && (
          <Grid item xs={12} sm={6} md={4}>
            <LevelFilter
              options={levelFilterOption}
              selectedLevel={levelFilter}
              setSelectedLevel={setLevelFilter}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CustomButton
            title="Add"
            onSubmit={() => navigate(ROUTES.ROUTE_ADD_ACCOUNT)}
            isLoading={false}
            disabled={false}
          
          />
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{ margin: "20px auto", maxWidth: "95vw", overflowX: "auto" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {!isAdmin && <TableCell>Level</TableCell>}
              <TableCell align="left">Fullname</TableCell>
              <TableCell align="left">MT5 ID</TableCell>
              <TableCell align="left">Phone</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Upline Fullname</TableCell>
              {!!isAdmin && <TableCell align="left">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  {!isAdmin && <TableCell>{row.level}</TableCell>}
                  <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
                  <TableCell>{row.md5Id}</TableCell>
                  <TableCell>{row.phoneNumber}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    {(row.uplineFirstName || "") + (row.uplineLastName || "")}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Tooltip title="Edit User">
                        <IconButton onClick={() => navigate(`${ROUTES.ROUTE_EDIT_ACCOUNT}/${row.id}`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reset Password">
                        <IconButton onClick={() => {
                          setSelectedId(row.id);
                          setResetPasswordDialogOpen(true);
                        }}>
                          <LockResetIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton onClick={() => {
                          setSelectedId(row.id);
                          setDeleteDialogOpen(true);
                        }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Uplines">
                        <IconButton onClick={() => navigate(`${ROUTES.ROUTE_EDIT_ACCOUNT_RELATIONSHIPS}/${row.id}`)}>
                          <LanIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {deleteDialogOpen && (
        <DeleteDialog
          userId={selectedId}
          deleteDialogOpen={deleteDialogOpen}
          setDeleteDialogOpen={setDeleteDialogOpen}
        />
      )}
      {resetPasswordDialogOpen && (
        <ResetPasswordDialog
          userId={selectedId}
          resetPasswordDialogOpen={resetPasswordDialogOpen}
          setResetPasswordDialogOpen={setResetPasswordDialogOpen}
        />
      )}
    </div>
  );
}

// import * as React from "react";
// import { useNavigate } from "react-router-dom";
// import { isUserAdmin } from "../../utils/helpers";
// import {
//   Button,
//   IconButton,
//   Paper,
//   SxProps,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Tooltip,
// } from "@mui/material";
// import { levelFilterOption } from "./TableData";
// import DeleteIcon from "@mui/icons-material/Delete";
// import LockResetIcon from "@mui/icons-material/LockReset";
// import DeleteDialog from "./Dialogs/DeleteDialog";
// import EditIcon from "@mui/icons-material/Edit";
// import LanIcon from "@mui/icons-material/Lan";
// import ResetPasswordDialog from "./Dialogs/ResetPasswordDialog";
// import LevelFilter from "./LevelFilter";
// import AccountApiService from "../../utils/apis/accounts";
// import { IUserGet } from "../../utils/interfaces/IUser";
// import { ROUTES } from "../../utils/routes";

// const tableContainerSx: SxProps = {
//   width: "95%",
//   marginLeft: "2.5%",
//   marginTop: "5px",
//   marginBottom: "5vh",
// };

// const tableHeadSx: SxProps = {
//   background: "#050d31",
// };

// const tableHeadRowSx: SxProps = {
//   color: "white",
//   whiteSpace: "nowrap",
//   overflow: "hidden",
//   textOverflow: "ellipsis",
//   width: "200px",
// };

// const tableBodyRowSx: SxProps = {
//   color: "black",
//   whiteSpace: "nowrap",
//   overflow: "hidden",
//   textOverflow: "ellipsis",
//   width: "200px",
// };

// export default function ChildrenTable() {
//   const navigate = useNavigate();
//   const [levelFilter, setLevelFilter] = React.useState<string>("All");
//   const isAdmin = isUserAdmin();
//   const [deleteDialogOpen, setDeleteDialogOpen] =
//     React.useState<boolean>(false);
//   const [resetPasswordDialogOpen, setResetPasswordDialogOpen] =
//     React.useState<boolean>(false);
//   const [selectedId, setSelectedId] = React.useState<number>(-1);
//   const [rows, setRows] = React.useState<IUserGet[]>([]);
//   const [filteredRows, setFilteredRows] = React.useState<IUserGet[]>([]);

//   const fetchData = async () => {
//     const downlines = await AccountApiService.getDownlines();
//     setRows(downlines);
//   };

//   React.useEffect(() => {
//     fetchData();
//   }, []);

//   React.useEffect(() => {
//     const levelFilterAsNumber = parseInt(levelFilter);
//     if (isNaN(levelFilterAsNumber)) {
//       return setFilteredRows(rows);
//     }
//     const filtered = rows.filter((e) => {
//       if (e.level && e.level === levelFilterAsNumber) return true;
//       return false;
//     });
//     setFilteredRows(filtered);
//   }, [rows, levelFilter]);

//   return (
//     <div>
//       <div style={{ marginLeft: "2.5%", display: "flex" }}>
//         {!isAdmin && (
//           <LevelFilter
//             options={levelFilterOption}
//             selectedLevel={levelFilter}
//             setSelectedLevel={setLevelFilter}
//           />
//         )}
//         <Button onClick={() => navigate(ROUTES.ROUTE_ADD_ACCOUNT)}>Add</Button>
//       </div>
//       <TableContainer sx={tableContainerSx} component={Paper}>
//         <Table>
//           <TableHead sx={tableHeadSx}>
//             <TableRow sx={{ height: "15px" }}>
//               <TableCell sx={tableHeadRowSx}>Level</TableCell>
//               <TableCell sx={tableHeadRowSx}>Fullname</TableCell>
//               <TableCell sx={tableHeadRowSx}>MT5 ID</TableCell>
//               <TableCell sx={tableHeadRowSx}>Phone</TableCell>
//               <TableCell sx={tableHeadRowSx}>Email</TableCell>
//               <TableCell sx={tableHeadRowSx}>Upline Fullname</TableCell>
//               {!!isAdmin && <TableCell sx={tableHeadRowSx}>Actions</TableCell>}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredRows.map((row) => {
//               return (
//                 <TableRow sx={{ height: "15px" }}>
//                   <TableCell>{row.level}</TableCell>
//                   <TableCell>{`${row.firstName} ${row.lastName}`}</TableCell>
//                   <TableCell>{row.md5Id}</TableCell>
//                   <TableCell>{row.phoneNumber}</TableCell>
//                   <TableCell>{row.email}</TableCell>
//                   <TableCell>
//                     {(row.uplineFirstName || "") + (row.uplineLastName || "")}
//                   </TableCell>
//                   {isAdmin && (
//                     <TableCell sx={tableBodyRowSx}>
//                       <Tooltip title="Delete">
//                         <IconButton
//                           onClick={() => {
//                             setSelectedId(row.id);
//                             setDeleteDialogOpen(true);
//                           }}
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="Reset password">
//                         <IconButton
//                           onClick={() => {
//                             setSelectedId(row.id);
//                             setResetPasswordDialogOpen(true);
//                           }}
//                         >
//                           <LockResetIcon />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="Edit User">
//                         <IconButton
//                           onClick={() => {
//                             setSelectedId(row.id);
//                             navigate(`${ROUTES.ROUTE_EDIT_ACCOUNT}/${row.id}`);
//                           }}
//                         >
//                           <EditIcon />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="Edit Uplines">
//                         <IconButton
//                           onClick={() => {
//                             setSelectedId(row.id);
//                             navigate(
//                               `${ROUTES.ROUTE_EDIT_ACCOUNT_RELATIONSHIPS}/${row.id}`
//                             );
//                           }}
//                         >
//                           <LanIcon />
//                         </IconButton>
//                       </Tooltip>
//                     </TableCell>
//                   )}
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//         {deleteDialogOpen && (
//           <DeleteDialog
//             userId={selectedId}
//             deleteDialogOpen={deleteDialogOpen}
//             setDeleteDialogOpen={setDeleteDialogOpen}
//           />
//         )}
//         {resetPasswordDialogOpen && (
//           <ResetPasswordDialog
//             userId={selectedId}
//             resetPasswordDialogOpen={resetPasswordDialogOpen}
//             setResetPasswordDialogOpen={setResetPasswordDialogOpen}
//           />
//         )}
//       </TableContainer>
//     </div>
//   );
// }
