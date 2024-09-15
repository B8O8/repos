import React, { useEffect, useState } from "react";
import AccountApiService from "../../utils/apis/accounts";
import {
  Button,
  MenuItem,
  TextField,
  Paper,
  Typography,
  Fade,
  Zoom,
} from "@mui/material";
import classes from "./styles.module.css";
import { ToastType, isUserAdmin, notify } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { IUserGet, IUserInsert } from "../../utils/interfaces/IUser";

function AddAccountForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IUserInsert>({
    email: "",
    username: "",
    firstName: "",
    lastName: "",
    md5Id: "",
    phoneNumber: "",
  });
  const [uplineId, setUplineId] = useState<number>();
  const [downlineIds, setDownlineIds] = useState<number[]>([]);
  const [allAccounts, setAllAccounts] = useState<IUserGet[]>([]);
  const [emailError, setEmailError] = useState<string>("");
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (isUserAdmin()) fetchAllAccounts();
  }, []);

  const fetchAllAccounts = async () => {
    const response = await AccountApiService.getAllAccounts();
    setAllAccounts(response);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) setEmailError("Invalid email");
      else setEmailError("");
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (emailError) return;
    try {
      await AccountApiService.createAccount(formData, uplineId, downlineIds);
      notify("Downline created successfully", ToastType.SUCCESS);
      navigate("/genealogy");
    } catch (error: any) {
      notify(error.message, ToastType.ERROR);
    }
  };

  const handleMultiSelectChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setDownlineIds(typeof value === "string" ? value.split(",") : value);
  };

  const isDisabled = () => {
    return (
      !formData.email ||
      !formData.username ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.phoneNumber ||
      !formData.md5Id
    );
  };

  return (
    <Fade in={true} timeout={1000}>
      <Paper className={classes.mainContainer} elevation={3}>
        <Zoom in={true} timeout={1000}>
          <div className={classes.container}>
            <Typography variant="h4" gutterBottom>
              Add Account
            </Typography>
            <form onSubmit={handleSubmit} className={classes.form}>
              <TextField
                label="MT5 ID"
                type="string"
                name="md5Id"
                value={formData.md5Id}
                onChange={handleChange}
                variant="filled"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                type="email"
                name="email"
                error={!!emailError}
                helperText={emailError}
                value={formData.email}
                onChange={handleChange}
                required
                variant="filled"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone number"
                type="number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                variant="filled"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                variant="filled"
                fullWidth
                margin="normal"
              />
              <TextField
                label="First Name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="filled"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="filled"
                fullWidth
                margin="normal"
              />
              {isUserAdmin() && (
                <>
                  <TextField
                    sx={{
                      width: "100%",
                      marginTop: "15px",
                    }}
                    fullWidth
                    label="Upline ID"
                    select
                    value={uplineId}
                    onChange={(e) => {
                      setUplineId(parseInt(e.target.value));
                      setDownlineIds([]);
                    }}
                  >
                    {allAccounts.map((account) => (
                      <MenuItem key={account.id} value={account.id}>
                        {account.username}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    sx={{
                      width: "100%",
                      marginTop: "15px",
                    }}
                    fullWidth
                    disabled={typeof uplineId === "undefined"}
                    label="Downline IDs"
                    value={downlineIds}
                    SelectProps={{
                      multiple: true,
                      value: downlineIds,
                      onChange: handleMultiSelectChange,
                    }}
                  >
                    {allAccounts
                      .filter((e) => e.uplineId === uplineId)
                      .map((account) => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.username}
                        </MenuItem>
                      ))}
                  </TextField>
                </>
              )}
              <Button
                className={classes.submitButton}
                sx={{ marginTop: "25px" }}
                disabled={isDisabled() || !!emailError}
                type="submit"
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </form>
          </div>
        </Zoom>
      </Paper>
    </Fade>
  );
}

export default AddAccountForm;

// import React, { useEffect, useState } from "react";
// import AccountApiService from "../../utils/apis/accounts";
// import { Button, MenuItem, TextField } from "@mui/material";
// import classes from "./styles.module.css";
// import { ToastType, isUserAdmin, notify } from "../../utils/helpers";
// import { useNavigate } from "react-router-dom";
// import { IUserGet, IUserInsert } from "../../utils/interfaces/IUser";

// function AddAccountForm() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<IUserInsert>({
//     email: "",
//     username: "",
//     firstName: "",
//     lastName: "",
//     md5Id: "",
//     phoneNumber: "",
//   });
//   const [uplineId, setUplineId] = useState<number>();
//   const [downlineIds, setDownlineIds] = useState<number[]>([]);
//   const [allAccounts, setAllAccounts] = useState<IUserGet[]>([]);
//   const [emailError, setEmailError] = useState<string>("");
//   const isMobile = window.innerWidth <= 768;

//   useEffect(() => {
//     if (isUserAdmin()) fetchAllAccounts();
//   }, []);

//   const fetchAllAccounts = async () => {
//     // should check if is admin
//     if (true) {
//       const response = await AccountApiService.getAllAccounts();
//       setAllAccounts(response);
//     }
//   };

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     if (name === "email") {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(value)) setEmailError("unvalidEmail");
//       else setEmailError("");
//     }
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     if (emailError) return;
//     try {
//       await AccountApiService.createAccount(formData, uplineId, downlineIds);
//       notify("Downline created successfully", ToastType.SUCCESS);
//       navigate("/genealogy");
//     } catch (error: any) {
//       notify(error.message, ToastType.ERROR);
//     }
//   };

//   const handleMultiSelectChange = (event: any) => {
//     const {
//       target: { value },
//     } = event;

//     setDownlineIds(
//       // On autofill we get a the stringified value.
//       typeof value === "string" ? value.split(",") : value
//     );
//   };

//   const isDisabled = () => {
//     if (
//       !formData.email ||
//       !formData.username ||
//       !formData.firstName ||
//       !formData.lastName ||
//       !formData.phoneNumber ||
//       !formData.md5Id
//     )
//       return true;
//     return false;
//   };

//   return (
//     <div className={classes.mainContainer}>
//       <div className={classes.container}>
//         <form onSubmit={handleSubmit} className={classes.container}>
//           <TextField
//             label="MT5 ID"
//             type="string"
//             name="md5Id"
//             value={formData.md5Id}
//             onChange={handleChange}
//             variant="filled"
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Email"
//             type="email"
//             name="email"
//             error={emailError ? true : false}
//             value={formData.email}
//             onChange={handleChange}
//             required
//             variant="filled"
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Phone number"
//             type="number"
//             name="phoneNumber"
//             value={formData.phoneNumber}
//             onChange={handleChange}
//             required
//             variant="filled"
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Username"
//             type="text"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//             variant="filled"
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="First Name"
//             type="text"
//             name="firstName"
//             value={formData.firstName}
//             onChange={handleChange}
//             variant="filled"
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Last Name"
//             type="text"
//             name="lastName"
//             value={formData.lastName}
//             onChange={handleChange}
//             variant="filled"
//             fullWidth
//             margin="normal"
//           />
//           {isUserAdmin() && (
//             <>
//               <TextField
//                 sx={{ width: !isMobile ? "85%" : "100%", marginTop: "15px" }}
//                 fullWidth={isMobile}
//                 label="Upline ID"
//                 select
//                 value={uplineId}
//                 onChange={(e) => {
//                   setUplineId(parseInt(e.target.value));
//                   setDownlineIds([]);
//                 }}
//               >
//                 {allAccounts.map((account) => {
//                   return (
//                     <MenuItem value={account.id}>{account.username}</MenuItem>
//                   );
//                 })}
//               </TextField>

//               <TextField
//                 select
//                 sx={{ width: !isMobile ? "85%" : "100%", marginTop: "15px" }}
//                 fullWidth={isMobile}
//                 disabled={typeof uplineId === "undefined"}
//                 label="Downline IDs"
//                 value={downlineIds}
//                 SelectProps={{
//                   multiple: true,
//                   value: downlineIds,
//                   onChange: handleMultiSelectChange,
//                 }}
//               >
//                 {allAccounts
//                   .filter((e) => e.uplineId === uplineId)
//                   .map((account) => {
//                     return (
//                       <MenuItem value={account.id}>{account.username}</MenuItem>
//                     );
//                   })}
//               </TextField>
//             </>
//           )}
//           <Button
//             className={classes.submitButton}
//             sx={{ marginTop: "25px" }}
//             disabled={isDisabled() || emailError ? true : false}
//             type="submit"
//             variant="contained"
//             color="primary"
//           >
//             Submit
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddAccountForm;
