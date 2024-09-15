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
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  userId: number;

}

function DeleteDialog({ deleteDialogOpen, setDeleteDialogOpen, userId }: Props) {
  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const handleSubmit = async () => {
    const response = await AccountApiService.delete(userId);
    if (response) {
      closeDialog();
      window.location.reload()
    }
  };

  const closeDialog = () => {
    setDeleteDialogOpen(false);
  };
  return (
    <Dialog
      open={deleteDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={closeDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Delete account?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this account?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={handleSubmit}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
