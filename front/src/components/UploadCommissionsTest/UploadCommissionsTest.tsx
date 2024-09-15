// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import CommissionApiService from "../../utils/apis/commissions";
// import * as XLSX from "xlsx";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { notify, ToastType } from "../../utils/helpers";
// import "./styles.css";
// import CustomButton from "../GenericComponents/CustomButton";

// function UploadCsvTest() {
//   const [file, setFile] = useState<File | null>(null);
//   const [nonExistentUsers, setNonExistentUsers] = useState<string[]>([]);
//   const [testCompleted, setTestCompleted] = useState(false);
//   const navigate = useNavigate();

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleUploadTest = async () => {
//     if (!file) return;

//     try {
//       const response = await CommissionApiService.uploadCsvTest(file);

//       if (response && Array.isArray(response)) {
//         setNonExistentUsers(response);
//         setTestCompleted(true);

//         if (response.length > 0) {
//           notify(
//             "Test successful! Found non-existent users.",
//             ToastType.SUCCESS
//           );
//         } else {
//           notify(
//             "Test successful! All users were found in the database.",
//             ToastType.SUCCESS
//           );
//         }
//       } else {
//         setNonExistentUsers([]);
//         setTestCompleted(false);
//         notify("Unexpected response format.", ToastType.ERROR);
//       }
//     } catch (error) {
//       console.error("Error during upload:", error); // Log any errors
//       setNonExistentUsers([]);
//       setTestCompleted(false);
//       notify("Error during upload. Please try again.", ToastType.ERROR);
//     }
//   };

//   const handleReset = () => {
//     setFile(null);
//     setNonExistentUsers([]);
//     setTestCompleted(false); // Reset the test completion state
//   };

//   const handleExportToExcel = () => {
//     if (nonExistentUsers.length === 0) return;

//     const ws = XLSX.utils.json_to_sheet(
//       nonExistentUsers.map((email) => ({ Email: email }))
//     );
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Non-existent Users");

//     XLSX.writeFile(wb, "NonExistentUsers.xlsx");
//   };

//   const handleBack = () => {
//     navigate(-1); // Navigate back to the previous page
//   };

//   return (
//     <>
//       <div className="upload-csv-test-container">
//         <ToastContainer />
//         <CustomButton
//           title="Back"
//           onSubmit={() => navigate("/upload-commissions")}
//           isLoading={false}
//           disabled={false}
//           width="200px"
//         />

//         <label className="file-upload-label">
//           <input
//             className="file-input"
//             type="file"
//             onChange={handleFileChange}
//           />
//           <span className={`file-upload-button ${file ? "active" : ""}`}>
//             {file ? file.name : "Choose File"}
//           </span>
//         </label>
//         <div className="button-container">
//           <CustomButton
//             title="Test Upload"
//             onSubmit={handleUploadTest}
//             isLoading={false}
//             disabled={!file}
//             width="200px"
//           />
//           <CustomButton
//             title="Reset"
//             onSubmit={handleReset}
//             isLoading={false}
//             disabled={!testCompleted && nonExistentUsers.length === 0}
//             width="200px"
//           />
//           <CustomButton
//             title="Export to Excel"
//             onSubmit={handleExportToExcel}
//             isLoading={false}
//             disabled={nonExistentUsers.length === 0}
//             width="200px"
//           />
//         </div>
//         {nonExistentUsers.length > 0 ? (
//           <div>
//             <h3 style={{ marginTop: "50px" }}>Non-existent Users:</h3>
//             <table className="user-table">
//               <thead>
//                 <tr>
//                   <th>Email</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {nonExistentUsers.map((email, index) => (
//                   <tr key={index}>
//                     <td>{email}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           testCompleted && (
//             <div className="No-Users">
//               <p>No non-existent users found.</p>
//             </div>
//           )
//         )}
//       </div>
//     </>
//   );
// }

// export default UploadCsvTest;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommissionApiService from "../../utils/apis/commissions";
import * as XLSX from "xlsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify, ToastType } from "../../utils/helpers";
import "./styles.css";
import CustomButton from "../GenericComponents/CustomButton";

function UploadCsvTest() {
  const [file, setFile] = useState<File | null>(null);
  const [nonExistentUsers, setNonExistentUsers] = useState<Record<string, string>[]>([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isTestButtonDisabled, setIsTestButtonDisabled] = useState(false); // New state to disable button
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setIsTestButtonDisabled(false); // Enable "Test Upload" on file change
    }
  };

  const handleUploadTest = async () => {
    if (!file) return;

    setIsTestButtonDisabled(true); // Disable "Test Upload" button on click

    try {
      const response = await CommissionApiService.uploadCsvTest(file);

      if (response && Array.isArray(response)) {
        setNonExistentUsers(response); // Update to handle full data objects
        setTestCompleted(true);

        if (response.length > 0) {
          notify(
            "Test successful! Found non-existent users.",
            ToastType.SUCCESS
          );
        } else {
          notify(
            "Test successful! All users were found in the database.",
            ToastType.SUCCESS
          );
        }
      } else {
        setNonExistentUsers([]);
        setTestCompleted(false);
        notify("Unexpected response format.", ToastType.ERROR);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setNonExistentUsers([]);
      setTestCompleted(false);
      setIsTestButtonDisabled(false); // Re-enable button in case of error
      notify("Error during upload. Please try again.", ToastType.ERROR);
    }
  };

  const handleReset = () => {
    setFile(null);
    setNonExistentUsers([]);
    setTestCompleted(false);
    setIsTestButtonDisabled(false); // Re-enable button on reset
  };

  const handleExportToExcel = () => {
    if (nonExistentUsers.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(nonExistentUsers); // Export full user data
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Non-existent Users");

    XLSX.writeFile(wb, "NonExistentUsers.xlsx");
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <>
      <div className="upload-csv-test-container">
        <ToastContainer />
        <CustomButton
          title="Back"
          onSubmit={() => navigate("/upload-commissions")}
          isLoading={false}
          disabled={false}
          width="200px"
        />

        <label className="file-upload-label">
          <input
            className="file-input"
            type="file"
            onChange={handleFileChange}
          />
          <span className={`file-upload-button ${file ? "active" : ""}`}>
            {file ? file.name : "Choose File"}
          </span>
        </label>

        <div className="button-container">
          <CustomButton
            title="Test Upload"
            onSubmit={handleUploadTest}
            isLoading={false}
            disabled={!file || isTestButtonDisabled} // Disable button when clicked
            width="200px"
          />
          <CustomButton
            title="Reset"
            onSubmit={handleReset}
            isLoading={false}
            disabled={!testCompleted && nonExistentUsers.length === 0}
            width="200px"
          />
          <CustomButton
            title="Export to Excel"
            onSubmit={handleExportToExcel}
            isLoading={false}
            disabled={nonExistentUsers.length === 0}
            width="200px"
          />
        </div>

        {/* Render table with all fields of non-existent users */}
        {nonExistentUsers.length > 0 ? (
          <div className="table-container"> {/* Added class for table container */}
            <h3 style={{ marginTop: "50px" }}>Non-existent Users:</h3>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country</th>
                  <th>Is Verified</th>
                  <th>Account Logins</th>
                  <th>Total Traded Lots</th>
                  <th>Lots</th>
                  <th>Balance (USD)</th>
                  <th>Equity (USD)</th>
                  <th>Commission (USD)</th>
                  <th>P/L Closed (USD)</th>
                  <th>Deposits (USD)</th>
                  <th>Withdrawals (USD)</th>
                  <th>Net Deposits (USD)</th>
                  <th>Last Trade Date</th>
                </tr>
              </thead>
              <tbody>
                {nonExistentUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.Level || "-"}</td>
                    <td>{user.FirstName || "-"}</td>
                    <td>{user.LastName || "-"}</td>
                    <td>{user.Email || "-"}</td>
                    <td>{user.Phone || "-"}</td>
                    <td>{user.Country || "-"}</td>
                    <td>{user.IsVerified || "-"}</td>
                    <td>{user.AccountLogins || "-"}</td>
                    <td>{user.TotalTradedLots || "-"}</td>
                    <td>{user.Lots || "-"}</td>
                    <td>{user.BalanceUSD || "-"}</td>
                    <td>{user.EquityUSD || "-"}</td>
                    <td>{user.CommissionUSD || "-"}</td>
                    <td>{user.PLClosedUSD || "-"}</td>
                    <td>{user.DepositsUSD || "-"}</td>
                    <td>{user.WithdrawalsUSD || "-"}</td>
                    <td>{user.NetDepositsUSD || "-"}</td>
                    <td>{user.LastTradeDate || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          testCompleted && (
            <div className="No-Users">
              <p>No non-existent users found.</p>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default UploadCsvTest;

