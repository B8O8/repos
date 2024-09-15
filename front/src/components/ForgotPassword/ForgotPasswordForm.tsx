import React, { useState } from "react";
import AccountApiService from "../../utils/apis/accounts";
import { ToastType, notify } from "../../utils/helpers";
import classes from "./styles.module.css";

// Email validation function
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors(null); // Clear errors when user types
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setErrors("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setErrors("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setErrors(null); // Clear any existing errors

    try {
      await AccountApiService.requestPasswordReset({ email });
      notify("Password reset email sent. Check your inbox!", ToastType.SUCCESS);
      setEmail(""); // Clear the input field
    } catch (error) {
      setErrors("Error sending password reset email.");
      notify("Error sending password reset email.", ToastType.ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes["forgot-password-container"]}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <h2 className={classes.title}>Forgot Password?</h2>
        <p>Enter your email address to receive a password reset link.</p>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          className={classes.input}
          required
        />
        {errors && <p className={classes.error}>{errors}</p>}
        <button
          type="submit"
          className={classes["submit-button"]}
          disabled={isLoading || !validateEmail(email)} // Disable if invalid email
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
