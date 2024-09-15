import React, { useEffect, useState } from "react";
import CommissionApiService from "../../utils/apis/commissions";
import {
  Button,
  Card,
  CircularProgress,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { ToastType, notify } from "../../utils/helpers";
import CustomButton from "../GenericComponents/CustomButton";
import { useNavigate } from "react-router-dom";
interface Props {}

function UploadCommissions(props: Props) {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<string>();
  const [uploadDisabled, setUploadDisabled] = useState<Boolean>(false);
  const [isUploading, setIsUploading] = useState<Boolean>(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true);
      handleUpload(e.target.files[0]);
    }
  };
  const handleUpload = async (tempFile: File) => {
    try {
      if (!dateFilter) return;
      await CommissionApiService.uploadCsv(tempFile, dateFilter);
      setTimeout(() => {
        notify("File uploaded successfully", ToastType.SUCCESS);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }, 2000);
    } catch (error: any) {
      notify("An error occured while uploading the file", ToastType.ERROR);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  useEffect(() => {
    if (dateFilter && dayjs(dateFilter).isValid()) setUploadDisabled(false);
    else setUploadDisabled(true);
  }, [dateFilter]);

  return (
    <>
      <CustomButton
        title="Back"
        onSubmit={() => navigate("/commissions")}
        isLoading={false}
        disabled={false}
        width="200px"
      />
      <Card
        sx={{
          width: "80",
          marginLeft: "1vw",
          marginTop: "2.5vh",
          height: "87vh",
          borderRadius: "7px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {isUploading ? (
          <div>
            <CircularProgress sx={{ fontSize: "120px", color: "white" }} />
          </div>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                top: "0",
              }}
            >
              <DatePicker
                sx={{
                  marginTop: "25px",
                  marginBottom: "25px",
                }}
                value={dateFilter}
                name="dateFilter"
                onChange={(value) =>
                  setDateFilter(dayjs(value).toDate().toDateString())
                }
              />
            </div>

            <div
              style={{
                width: "50vw",
                height: "50vh",
                display: "flex",
                marginTop: "25vh",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                cursor: !uploadDisabled ? "pointer" : "not-allowed",
              }}
            >
              <CloudUploadIcon
                sx={{
                  cursor: !uploadDisabled ? "pointer" : "not-allowed",
                  color: !uploadDisabled ? "#050d31" : "grey",
                  fontSize: "135px",
                }}
              />
              <div>
                <Typography
                  sx={{ color: !uploadDisabled ? "#050d31" : "grey" }}
                >
                  Upload File
                </Typography>
              </div>
              {!uploadDisabled ? (
                <input
                  id="file"
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  style={{
                    width: "80vw",
                    height: "80vh",
                    opacity: 0,
                    marginTop: "-20vh",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "80vw",
                    height: "80vh",
                    opacity: 0,
                    marginTop: "-20vh",
                    cursor: "pointer",
                  }}
                ></div>
              )}
            </div>
          </>
        )}
      </Card>
    </>
  );
}

export default UploadCommissions;
