import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { Dispatch, SetStateAction } from "react";
import AccountApiService from "../../../utils/apis/accounts";

interface Props {
  resetPasswordDialogOpen: boolean;
  setResetPasswordDialogOpen: Dispatch<SetStateAction<boolean>>;
  userId: number;
}

function ResetPasswordDialog({
  resetPasswordDialogOpen,
  setResetPasswordDialogOpen,
  userId,
}: Props) {
  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const handleSubmit = async () => {
    const response = await AccountApiService.resetPassword(userId);
    if (response) closeDialog();
  };

  const closeDialog = () => {
    setResetPasswordDialogOpen(false);
  };
  return (
    <Dialog
      open={resetPasswordDialogOpen}
      TransitionComponent={Transition}
      onClose={closeDialog}
    >
      <DialogTitle>Reset password?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to reset the password for this account?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={handleSubmit}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ResetPasswordDialog;
