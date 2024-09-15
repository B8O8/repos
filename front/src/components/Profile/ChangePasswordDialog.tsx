import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { CircularProgress } from "@mui/material";
import { ToastType, notify } from "../../utils/helpers";
import AccountApiService from "../../utils/apis/accounts";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IFormData {
  newPassword: string;
}

export default function ChangePasswordDialog({ open, setOpen }: IProps) {
  const [formData, setFormData] = React.useState<IFormData>({
    newPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const isButtonDisabled = () => {
    if (formData.newPassword.length) return false;
    return true;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async() => {
    setIsSubmitting(true)
    try {
      const {newPassword} = formData;
      await AccountApiService.changePassword(newPassword);
      notify("Password updated", ToastType.SUCCESS)
      setIsSubmitting(false)
      setOpen(false)
        
    } catch (error: any) {
      notify(error.message, ToastType.ERROR);
      setIsSubmitting(false)

    }

}

  return (
    <React.Fragment>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="newPassword"
            onChange={handleChange}
            label="New Password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button sx={{width: "80px",height: "35px"}} variant="contained" color="error" onClick={handleClose}>Cancel</Button>
          <Button sx={{width: "80px",height: "35px"}} disabled={isButtonDisabled() || isSubmitting} variant="contained" type="submit" onClick={handleSubmit}>
            {isSubmitting ? <CircularProgress sx={{color: 'white'}} size={21} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
