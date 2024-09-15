import React, { useState } from "react";
import { IAccountLoginForm } from "../../utils/interfaces";
import classes from "./styles.module.css";
import AuthApiService from "../../utils/apis/auth";
import Logo from "../FloatingNavigationBarButton/logo.jpeg";
import { Link } from "react-router-dom";
import { ROUTES } from "../../utils/routes";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<IAccountLoginForm>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const isSubmitDisabled = () => !formData.email || !formData.password;

  const validateInput = (name: string, value: string) => {
    let error = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Please enter a valid email address.";
      }
    }
    if (name === "password") {
      if (value.length < 6) {
        error = "Password must be at least 6 characters long.";
      }
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitDisabled()) return;

    // Additional validation before submitting
    const emailError = validateInput("email", formData.email);
    const passwordError = validateInput("password", formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setIsLoading(true);
    await AuthApiService.login(formData);
    setIsLoading(false);
  };

  return (
    <div className={classes["login-mainContainer"]}>
      <div className={classes["login-container"]}>
        <form onSubmit={handleSubmit} className={classes.form}>
          <div className={classes["login-imageContainer"]}>
            <img src={Logo} alt="logo" className={classes["login-logo"]} />
          </div>
          <h2 className={classes["login-title"]}>Welcome Back</h2>
          <p className={classes["login-subtitle"]}>
            Please login to your account
          </p>
          <div className={classes["login-formGroup"]}>
            <label htmlFor="email" className={classes["login-label"]}>
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`${classes["login-input"]} ${
                errors.email ? classes["login-invalidInput"] : ""
              }`}
              required
            />
            {errors.email && (
              <p className={classes["login-errorText"]}>{errors.email}</p>
            )}
          </div>
          <div className={classes["login-formGroup"]}>
            <label htmlFor="password" className={classes["login-label"]}>
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className={`${classes["login-input"]} ${
                errors.password ? classes["login-invalidInput"] : ""
              }`}
              required
            />
            {errors.password && (
              <p className={classes["login-errorText"]}>{errors.password}</p>
            )}
          </div>
          {/* Forgot Password Link */}
          <div className={classes["login-forgotPassword"]}>
          <Link to={ROUTES.ROUTE_FORGOT_PASSWORD}>Forgot Password?</Link>

          </div>
          <button
            type="submit"
            className={classes["login-button"]}
            disabled={isSubmitDisabled() || isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

// import React, { useState } from "react";
// import { IAccountLoginForm } from "../../utils/interfaces";
// import classes from "./styles.module.css";
// import CustomInput from "../GenericComponents/CustomInput";
// import CustomButton from "../GenericComponents/CustomButton";
// import logo from "../FloatingNavigationBarButton/logo.jpeg";
// import AuthApiService from "../../utils/apis/auth";
// function LoginForm() {
//   const [formData, setFormData] = useState<IAccountLoginForm>({
//     email: "",
//     password: "",
//   });
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const isSubmitDisabled = () => {
//     if (formData.email && formData.password) return false;
//     return true;
//   };

//   const handleChange = (e: any) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();
//     if (!formData.email || !formData.password) return;
//     setIsLoading(true)
//     await AuthApiService.login(formData);
//     setIsLoading(false)
//   }

//   return (
//     <div className={classes.mainContainer}>
//       <div className={classes.container}>
//       <form onSubmit={handleSubmit}>

//         <div className={classes.imageContainer}>
//           <img src={logo} alt="logo" />
//         </div>
//         <div className={classes.formContainer}>
//           <CustomInput
//             name="email"
//             handleChange={handleChange}
//             isRequired={true}
//             label="Username"
//             value={formData.email}
//             type="text"
//           />
//           <CustomInput
//             name="password"
//             handleChange={handleChange}
//             isRequired={true}
//             label="Password"
//             value={formData.password}
//             type="text"
//           />
//           <CustomButton
//             disabled={isSubmitDisabled()}
//             isLoading={isLoading}
//             title="Login"
//             onSubmit={(e: any) => console.log(e)}
//           />
//         </div>
//       </form>
//       </div>

//     </div>
//   );

// }

// export default LoginForm;
