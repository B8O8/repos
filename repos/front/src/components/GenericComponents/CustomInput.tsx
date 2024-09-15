import { TextField } from '@mui/material'
import React, { Dispatch, SetStateAction } from 'react'

interface Props {
    label: string
    name: string
    value: string
    handleChange: (e: any) => void
    type: string
    isRequired: boolean
}

function CustomInput({
    label, 
    name, 
    value, 
    handleChange, 
    type = "text",
    isRequired = true
}: Props) {

    
    return (
        <TextField 
            type={type}
            name={name}
            value={value}
            sx={{
                borderBottom: 1,
                borderColor: "#EBEBE4",
                input: {
                   color: 'white',
                   "&::focus": {
                    borderColor: "#EBEBE4"
                   },
                   "&::placeholder": {    // <----- Add this.
                      opacity: 0.2,
                   },
                },
             }}
            InputLabelProps={{
                shrink: true,
                style: { color: 'white', background: "var(--primary-bg)" },

            }}
            placeholder={label}
            onChange={handleChange}
            required
            variant="standard"
            fullWidth
            margin="normal"
        />
    )
}

export default CustomInput
