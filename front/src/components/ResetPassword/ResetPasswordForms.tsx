import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AccountApiService from "../../utils/apis/accounts";
import { ToastType, notify } from "../../utils/helpers";
import styles from "./styles.module.css"; // Import the CSS module

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { token, id } = useParams<{ token: string; id: string }>(); // Extract token and id from URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null); // Track token validity

  // Check token validity on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        if (token && id) {
          await AccountApiService.validateResetToken({ userId: parseInt(id), token });
          setIsTokenValid(true); // Token is valid
        } else {
          setIsTokenValid(false); // Invalid token or missing parameters
        }
      } catch (error: any) {
        setIsTokenValid(false); // Token is invalid or expired
        navigate("/link-expired"); // Redirect to link expired page
      }
    };

    validateToken();
  }, [token, id, navigate]);

  // Handle form submission
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate that the password is at least 6 characters
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Validate that the passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      if (token && id) {
        await AccountApiService.resetPasswordUser({ userId: parseInt(id), token, newPassword });
        notify("Password reset successfully!", ToastType.SUCCESS);
        navigate("/login"); // Redirect to login after successful reset
      } else {
        setError("Invalid link.");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError("This reset link is invalid or has expired.");
        navigate("/link-expired"); // Redirect to 'link expired' page
      } else {
        setError("Failed to reset the password. Please try again.");
      }
    }
  };

  // Don't render the form if the token is still being validated or is invalid
  if (isTokenValid === false) {
    return null; // Redirected to /link-expired, so no need to render the form
  }

  if (isTokenValid === null) {
    return <div className={styles.loadingText}>Validating reset link...</div>; // Show a loading message during token validation
  }

  return (
    <div className={styles.resetPasswordContainer}>
      <div className={styles.resetPasswordCard}>
        <h2>Reset Password</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handlePasswordChange}>
          <div>
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError(""); // Clear error when user starts typing
              }}
              required
              minLength={6} // Enforce minimum password length on input field
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(""); // Clear error when user starts typing
              }}
              required
              minLength={6} // Enforce minimum password length on input field
            />
          </div>
          <button className={styles.resetPasswordButton} type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
