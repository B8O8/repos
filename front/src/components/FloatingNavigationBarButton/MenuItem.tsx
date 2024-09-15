import React from "react";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import classes from "./styles.module.css"; // Assuming you have a CSS module for styles

interface Props {
  isActive: boolean;
  path: string;
  Icon: any;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  text: string; // New prop for text
}

function MenuItem({ isActive, path, Icon, setIsMenuOpen, text }: Props) {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <li
      className={`${classes.menuItem} ${isActive ? classes.active : ""}`}
      onClick={() => handleNavigation(path)}
    >
      <IconButton>
        <Icon style={{ color: isActive ? "#42a5f5" : "white" }} />
        <span className={classes.text}>{text}</span>
      </IconButton>
    </li>
  );
}

export default MenuItem;
