import React, { useEffect, useState } from "react";
import LoadingIndicator from "../GenericComponents/LoadingIndicator";
import PageTitle from "../PageTitle/PageTitle";
import classes from "./styles.module.css";
import logo from "../FloatingNavigationBarButton/logo.jpeg";
import { Button, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { ToastType, getLoggedInUserId, notify } from "../../utils/helpers";
import AccountApiService from "../../utils/apis/accounts";
import { IUserGet, IProfile } from "../../utils/interfaces/IUser";
import { API_BASE_URL } from "../../utils/constants";
import CustomButton from "../GenericComponents/CustomButton";

function Profile() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<IProfile>();
  const isLoggedIn = localStorage.getItem("token");
  const userId = getLoggedInUserId();

  const fetchData = async (): Promise<void> => {
    const data = await AccountApiService.getProfile();
    setProfile(data);
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    fetchData();
  }, [isLoggedIn]);

  useEffect(() => {
    if (profile?.id) setIsLoading(false);
  }, [profile]);

  const handleFileInputChange = async (e: any) => {
    try {
      const selectedFile = e.target.files[0];
      const formData = new FormData();
      formData.append("filename", userId);
      formData.append("image", selectedFile);
      await AccountApiService.uploadProfile(formData);
      notify("Profile picture updated successfully", ToastType.SUCCESS);
      window.location.reload();
    } catch (error: any) {
      notify(error.message, ToastType.ERROR);
    }
  };

  if (isLoading) return <LoadingIndicator />;
  return (
    <div className={classes.profileContainer}>
      <PageTitle color="black" title="Profile" />

      <div className={classes.picSection}>
        <div className={classes.picContainer}>
          <img
            src={`${API_BASE_URL}/profile-images/${userId}.png`}
            alt="User"
            onError={(e: any) => {
              e.target.src = logo;
            }}
          />
        </div>
        <div style={{ position: "relative" }}>
          <input
            type="file"
            id="fileInput"
            style={{
              opacity: "0",
              width: "100%",
              height: "120%",
              position: "absolute",
              zIndex: 55,
            }}
            accept=".jpg, .jpeg, .png"
            onChange={handleFileInputChange}
          />
          <Button endIcon={<EditIcon />}>Edit</Button>
        </div>
      </div>
      {/* <div className={classes.picSection}>
        <div className={classes.picContainer}>
          <img
            src={`${API_BASE_URL}/profile-images/${userId}.png`}
            alt="User"
            onError={(e: any) => {
              e.target.src = logo;
            }}
          />
        </div>
        <input
          type="file"
          id="fileInput"
          className={classes.fileInput}
          accept=".jpg, .jpeg, .png"
          onChange={handleFileInputChange}
        />
        <Button variant="contained" color="primary" endIcon={<EditIcon />}>
          Edit
        </Button>
      </div> */}
      <div className={classes.infoSection}>
        <ul>
          <li>
            <label className={classes.label}>Fullname</label>
            <TextField
              variant="outlined"
              fullWidth
              value={`${profile?.firstName} ${profile?.lastName}`}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black",
                },
              }}
            />
          </li>
          <li>
            <label className={classes.label}>E-Mail</label>
            <TextField
              variant="outlined"
              fullWidth
              value={profile?.email}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black",
                },
              }}
            />
          </li>
          <li>
            <label className={classes.label}>Phone Number</label>
            <TextField
              variant="outlined"
              fullWidth
              value={profile?.phoneNumber}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black",
                },
              }}
            />
          </li>
          <li>
            <label className={classes.label}>MT5 ID</label>
            <TextField
              variant="outlined"
              fullWidth
              value={profile?.md5Id}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black",
                },
              }}
            />
          </li>
          <li>
            <label className={classes.label}>Created At</label>
            <TextField
              variant="outlined"
              fullWidth
              value={
                profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString()
                  : ""
              }
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black",
                },
              }}
            />
          </li>
        </ul>

        <div style={{ marginTop: "20px" }}>
          <CustomButton
            title="Change Password"
            width="100%"
            onSubmit={() => setIsDialogOpen(true)}
            disabled={false}
            isLoading={false}
          />
        </div>
      </div>
      {profile?.uplineEmail && (
        <>
          <PageTitle title="Upline" />
          <div className={classes.infoSection}>
            <ul>
              <li>
                <label>Fullname</label>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={`${profile?.uplineFirstName} ${profile?.uplineLastName}`}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </li>
              <li>
                <label>Email</label>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={profile?.uplineEmail}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </li>
              <li>
                <label>Phone Number</label>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={profile?.uplinePhoneNumber}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </li>
            </ul>
          </div>
        </>
      )}
      {isDialogOpen && (
        <ChangePasswordDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
      )}
    </div>
  );
}

export default Profile;

// import React, { useEffect, useState } from "react";
// import LoadingIndicator from "../GenericComponents/LoadingIndicator";
// import PageTitle from "../PageTitle/PageTitle";
// import classes from "./styles.module.css";
// import logo from "../FloatingNavigationBarButton/logo.jpeg";
// import { Button, IconButton } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import ChangePasswordDialog from "./ChangePasswordDialog";
// import { ToastType, getLoggedInUserId, notify } from "../../utils/helpers";
// import AccountApiService from "../../utils/apis/accounts";
// import { IUserGet, IProfile } from "../../utils/interfaces/IUser";
// import { API_BASE_URL } from "../../utils/constants";
// import PersonIcon from "@mui/icons-material/Person";
// import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
// import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
// import ShowChartIcon from "@mui/icons-material/ShowChart";
// import WatchLaterIcon from "@mui/icons-material/WatchLater";

// function Profile() {
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//   const [profile, setProfile] = useState<IProfile>();
//   const isLoggedIn = localStorage.getItem("token");
//   const userId = getLoggedInUserId();
//   const fetchData = async (): Promise<void> => {
//     const data = await AccountApiService.getProfile();
//     setProfile(data);
//   };

//   const capitalizeFirstLetter = (str: string | undefined): string => {
//     if (!str) return "";
//     return str.charAt(0).toUpperCase() + str.slice(1);
//   };

//   useEffect(() => {
//     if (!isLoggedIn) return;
//     setIsLoading(true);
//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isLoggedIn]);

//   useEffect(() => {
//     if (profile?.id) setIsLoading(false);
//   }, [profile]);

//   const handleFileInputChange = async (e: any) => {
//     try {
//       const selectedFile = e.target.files[0];
//       const formData = new FormData();
//       formData.append("filename", userId);
//       formData.append("image", selectedFile);
//       await AccountApiService.uploadProfile(formData);
//       notify("Profile picture updated successfully", ToastType.SUCCESS);
//       window.location.reload();
//     } catch (error: any) {
//       notify(error.message, ToastType.ERROR);
//       setTimeout(() => {
//         // window.location.reload()
//       }, 1000);
//     }
//     // You can now handle the selected file as needed
//   };

//   const iconSx = {
//     color: "#1a3199",
//     fontWeight: "bold",
//     marginRight: "5px",
//     fontSize: "28px !important",
//   };

//   if (isLoading) return <LoadingIndicator />;
//   return (
//     <div>
//       <PageTitle title="Profile" />
//       <div className={classes.gridContainer}>
// <div className={classes.picSection}>
//   <div className={classes.picContainer}>
//     <img
//       src={`${API_BASE_URL}/profile-images/${userId}.png`}
//       alt="User"
//       onError={(e: any) => {
//         e.target.src = logo; // Set the default image if the specified image fails to load
//       }}
//     />
//   </div>
//   <div style={{ position: "relative" }}>
//     <input
//       type="file"
//       id="fileInput"
//       style={{
//         opacity: "0",
//         width: "100%",
//         height: "120%",
//         position: "absolute",
//         zIndex: 55,
//       }}
//       accept=".jpg, .jpeg, .png" // Specify allowed file types
//       onChange={handleFileInputChange}
//     />
//     <Button endIcon={<EditIcon />}>Edit</Button>
//   </div>
//         </div>
//         <div className={classes.infoSection}>
//           <ul>
//             <li style={{ marginBottom: "15px" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-end",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <PersonIcon sx={iconSx} />
//                 <label className={classes.label} style={{ color: "#1a3199" }}>
//                   Fullname
//                 </label>
//               </div>
//               <span className={classes.value}>
//                 {capitalizeFirstLetter(profile?.firstName)}{" "}
//                 {capitalizeFirstLetter(profile?.lastName)}{" "}
//               </span>
//               <hr />
//             </li>
//             <li style={{ marginBottom: "15px" }}>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-end",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <AlternateEmailIcon sx={iconSx} />
//                 <label className={classes.label} style={{ color: "#1a3199" }}>
//                   E-Mail
//                 </label>
//               </div>
//               <span className={classes.value}>
//                 {capitalizeFirstLetter(profile?.email)}
//               </span>
//               <hr />
//             </li>
//             <li>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-end",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <LocalPhoneIcon sx={iconSx} />
//                 <label className={classes.label} style={{ color: "#1a3199" }}>
//                   Phone number
//                 </label>
//               </div>
//               <span className={classes.value}>
//                 {capitalizeFirstLetter(profile?.phoneNumber)}
//               </span>
//               <hr />
//             </li>
//             <li>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-end",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <ShowChartIcon sx={iconSx} />
//                 <label className={classes.label} style={{ color: "#1a3199" }}>
//                   MT5 ID
//                 </label>
//               </div>
//               <span className={classes.value}>
//                 {capitalizeFirstLetter(profile?.md5Id)}
//               </span>
//               <hr />
//             </li>
//             <li>
//               <div
//                 style={{
//                   display: "flex",
//                   alignItems: "flex-end",
//                   marginBottom: "5px",
//                 }}
//               >
//                 <WatchLaterIcon sx={iconSx} />
//                 <label className={classes.label} style={{ color: "#1a3199" }}>
//                   Created at
//                 </label>
//               </div>
//               <span className={classes.value}>
//                 {profile?.createdAt
//                   ? new Date(profile.createdAt).toLocaleDateString()
//                   : ""}
//               </span>
//               <hr />
//             </li>
//           </ul>
//           <Button
//             sx={{ marginTop: "15px" }}
//             variant="contained"
//             onClick={() => setIsDialogOpen(true)}
//           >
//             Change password
//           </Button>
//         </div>
//       </div>
//       {profile?.uplineEmail && (
//         <>
//           <PageTitle title="Upline" />
//           <div className={classes.gridContainer2}>
//             <div className={classes.picSection}></div>
//             <div className={classes.infoSection}>
//               <ul>
//                 <li style={{ marginBottom: "15px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "flex-end",
//                       marginBottom: "5px",
//                     }}
//                   >
//                     <PersonIcon sx={iconSx} />
//                     <label
//                       className={classes.label}
//                       style={{ color: "#1a3199" }}
//                     >
//                       Fullname
//                     </label>
//                   </div>
//                   <span className={classes.value}>
//                     {capitalizeFirstLetter(profile?.uplineFirstName)}{" "}
//                     {capitalizeFirstLetter(profile?.uplineLastName)}{" "}
//                   </span>
//                   <hr />
//                 </li>
//                 <li style={{ marginBottom: "15px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "flex-end",
//                       marginBottom: "5px",
//                     }}
//                   >
//                     <AlternateEmailIcon sx={iconSx} />
//                     <label
//                       className={classes.label}
//                       style={{ color: "#1a3199" }}
//                     >
//                       Email
//                     </label>
//                   </div>
//                   <div></div>
//                   <span className={classes.value}>
//                     {capitalizeFirstLetter(profile?.uplineEmail)}
//                   </span>
//                   <hr />
//                 </li>
//                 <li style={{ marginBottom: "15px" }}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "flex-end",
//                       marginBottom: "5px",
//                     }}
//                   >
//                     <LocalPhoneIcon sx={iconSx} />
//                     <label
//                       className={classes.label}
//                       style={{ color: "#1a3199" }}
//                     >
//                       Phone number
//                     </label>
//                   </div>
//                   <div></div>
//                   <span className={classes.value}>
//                     {profile?.uplinePhoneNumber}
//                   </span>
//                   <hr />
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </>
//       )}
//       {isDialogOpen && (
//         <ChangePasswordDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
//       )}
//     </div>
//   );
// }

// export default Profile;
