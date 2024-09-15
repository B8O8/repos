import React, { useEffect, useState } from "react";
import AccountApiService from "../../utils/apis/accounts";
import {
  Button,
  TextField,
  Paper,
  Typography,
  Fade,
  Zoom,
} from "@mui/material";
import classes from "./styles.module.css";
import { ToastType, notify } from "../../utils/helpers";
import { useNavigate, useParams } from "react-router-dom";
import { IUserInsert } from "../../utils/interfaces/IUser";

function EditAccountForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<IUserInsert>>({
    username: "",
    firstName: "",
    lastName: "",
    md5Id: "",
    phoneNumber: "",
  });
  const [emailError, setEmailError] = useState<string>("");

  const fetchData = async () => {
    if (!id) return;
    const user = await AccountApiService.getUser(parseInt(id));
    setFormData({
      email: user?.email,
      username: user?.username,
      firstName: user?.firstName,
      lastName: user?.lastName,
      md5Id: user?.md5Id,
      phoneNumber: user?.phoneNumber,
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (!id) return;
    try {
      const response = await AccountApiService.updateUser(
        parseInt(id),
        formData
      );
      if (response) {
        notify("Downline updated successfully", ToastType.SUCCESS);
        setTimeout(() => {
          navigate("/genealogy");
        }, 300);
      }
    } catch (error: any) {
      notify(error.message, ToastType.ERROR);
    }
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
              Edit Account
            </Typography>
            <form onSubmit={handleSubmit} className={classes.form}>
              <TextField
                label="MT5 ID"
                type="string"
                name="md5Id"
                value={formData.md5Id}
                required
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
                InputLabelProps={{
                  shrink: !!formData.email,
                }}
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
                required
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
                required
                fullWidth
                margin="normal"
              />
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

export default EditAccountForm;

// import React, { useEffect, useState } from "react";
// import AccountApiService from "../../utils/apis/accounts";
// import {
//   Button,
//   TextField,
// } from "@mui/material";
// import classes from "./styles.module.css";
// import { ToastType, notify } from "../../utils/helpers";
// import { useNavigate, useParams } from "react-router-dom";
// import {  IUserInsert } from "../../utils/interfaces/IUser";

// function EditAccountForm() {
//     const { id } = useParams();

//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<Partial<IUserInsert>>({
//     username: "",
//     firstName: "",
//     lastName: "",
//     md5Id: "",
//     phoneNumber: "",
//   });
//   const [emailError, setEmailError] = useState<string>("");

//   const fetchData = async() => {
//     if (!id) return
//     const user = await AccountApiService.getUser(parseInt(id))
//     setFormData({
//         email: user?.email,
//         username: user?.username,
//         firstName: user?.firstName,
//         lastName: user?.lastName,
//         md5Id: user?.md5Id,
//         phoneNumber: user?.phoneNumber,
//     })
//   }

//   useEffect(() => {
//     fetchData()
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   },[])

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
//     if (!id) return
//     try {
//       const response = await AccountApiService.updateUser(parseInt(id), formData);
//       if (response) {
//           notify("Downline updated successfully", ToastType.SUCCESS);
//           setTimeout(() => {
//             navigate("/genealogy");
//           }, 300);
//       }
//     } catch (error: any) {
//       notify(error.message, ToastType.ERROR);
//     }
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
//             required
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
//             InputLabelProps={{
//                 shrink: !!formData.email,
//               }}
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
//             required
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
//             required
//             fullWidth
//             margin="normal"
//           />

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

// export default EditAccountForm;
