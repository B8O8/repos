import React from "react";
import { Link } from "react-router-dom";
import classes from "./LinkExpired.module.css"; // Import the CSS module for styling

const LinkExpired = () => {
  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h1 className={classes.title}>Link Expired</h1>
        <p className={classes.message}>
          Oops! It seems like this password reset link has expired or is invalid.
        </p>
        <Link to="/forgot-password" className={classes.button}>
          Request a New Link
        </Link>
      </div>
    </div>
  );
};

export default LinkExpired;
