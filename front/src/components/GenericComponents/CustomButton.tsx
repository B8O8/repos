import { Button, CircularProgress } from "@mui/material";
import React from "react";

interface Props {
  title: string;
  onSubmit: (e: any) => void;
  isLoading: boolean;
  disabled: boolean;
  width?: string;
  marginLeft?: string;
}

function CustomButton({
  title,
  onSubmit,
  isLoading = false,
  disabled = false,
  width = "100%",
  marginLeft = "0px",
}: Props) {
  const sx = {
    background: !disabled ? "var(--button-bg-color)" : "#D4D4D4",
    color: !disabled ? "white" : "grey",
    height: "45px",
    width: width,
    marginLeft: marginLeft,
    borderRadius: "25px",
    boxShadow: !disabled
      ? "0 3px 5px 2px var(--button-bg-color-hover)"
      : "none",
    transition: "background 0.3s, transform 0.3s, box-shadow 0.3s",
    "&:hover": {
      background: !disabled ? "var(--button-bg-color-hover)" : "#D4D4D4",
      transform: !disabled ? "scale(1.05)" : "none",
      boxShadow: !disabled ? "0 5px 7px 3px var(--button-bg-color)" : "none",
    },
    "&:active": {
      transform: !disabled ? "scale(0.95)" : "none",
    },
  };

  return (
    <Button
      onClick={onSubmit}
      disabled={disabled}
      sx={sx}
      type="submit"
      variant="contained"
    >
      {isLoading ? (
        <CircularProgress sx={{ color: "white" }} size={21} />
      ) : (
        title
      )}
    </Button>
  );
}

export default CustomButton;

// import { Button, CircularProgress } from '@mui/material'
// import React from 'react'

// interface Props {
//     title: string
//     onSubmit: (e: any) => void
//     isLoading: boolean
//     disabled: boolean
// }

// function CustomButton({
//     title,
//     onSubmit,
//     isLoading = false,
//     disabled = false,
// }: Props) {

//     const sx = {
//         background: !disabled ? "orange" : "#D4D4D4",
//         color: !disabled ? "white" : "grey",
//         height: "35px",
//         width: "100%"
//     }
//     return (
//         <Button
//             onSubmit={(e) => console.log(e)}
//             disabled={disabled}
//             style={sx}
//             type="submit"
//             variant="contained"
//         >
//             {isLoading ? <CircularProgress sx={{color: 'white'}} size={21}  /> : title}
//         </Button>
//     )
// }

// export default CustomButton
