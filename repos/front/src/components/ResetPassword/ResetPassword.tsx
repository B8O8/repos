import { Button, Card, CircularProgress, TextField } from '@mui/material'
import React, { useState } from 'react'
import AccountApiService from '../../utils/apis/accounts';
import { ToastType, notify } from '../../utils/helpers';

interface Props {}

function ResetPassword(props: Props) {
    const [formData, setFormData] = useState<{
        oldPassword: string,
        newPassword: string,
    }>({
        oldPassword: "",
        newPassword: ""
    })
    const [isSubmitting, setIsSubmitting] = useState<Boolean>(false);
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };

    const submit = async() => {
        setIsSubmitting(true)
        try{
            const response = await AccountApiService.updatePassword(formData.oldPassword, formData.newPassword)
            if(response?.response === "ok") notify("Password reset successfully", ToastType.SUCCESS);
            else {
                notify("Error while resetting password", ToastType.ERROR)
                setIsSubmitting(false)
            }
            setIsSubmitting(false)
        }catch(error: any) {
            notify("Error while resetting password", ToastType.ERROR)
            setIsSubmitting(false)
        }
    }

    
    return (
        <Card
      sx={{
        width: "95vw",
        marginLeft: "2.5vw",
        marginTop: "2.5vh",
        height: "87vh",
        borderRadius: "7px",
        boxShadow: 5,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowY: "scroll",
      }}
    >
        <form>
        <TextField
            sx={{  }}
            label="Old password"
            type="string"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            variant='filled'
            fullWidth
            margin="normal"
        />
        <TextField
            label="New password"
            type="string"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            variant='filled'
            fullWidth
            margin="normal"
        /> 
        <Button disabled={!formData.oldPassword || !formData.newPassword} sx={{width: "100%", color: "white", height: "35px"}} variant='contained' onClick={submit}>
              {isSubmitting ? <CircularProgress sx={{color: "white", fontSize: "8px"}} size={20} /> : "Submit"}
        </Button>
        </form>
        </Card>
    )
}

export default ResetPassword
