import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AddAccountForm from "../AddAccountForm/AddAccountForm";
import { ToastContainer } from "react-toastify";
import LoginForm from "../LoginForm/LoginForm";
import UploadCommissions from "../UploadCommissions/UploadCommissions";
import ChildrenTable from "../ChildrenTable/ChildrenTable";
import FloatingNavigationBarButton from "../FloatingNavigationBarButton/FloatingNavigationBarButton";
import Profile from "../Profile/Profile";
import ResetPassword from "../ResetPassword/ResetPassword";
import CommissionsTable from "../CommissionsTable/CommissionsTable";
import Dashboard from "../Dashboard/Dashboard";
import { ROUTES } from "../../utils/routes";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EditRelationships from "../EditRelationships/EditRelationships";
import EditAccountForm from "../AddAccountForm/EditAccountForm";
import MonthlyEmailForm from "../UploadCommissions/MonthlyEmailForm";
import UploadCsvTest from "../UploadCommissionsTest/UploadCommissionsTest";
import ForgotPasswordForm from "../ForgotPassword/ForgotPasswordForm";
import ResetPasswordForm from "../ResetPassword/ResetPasswordForms";
import LinkExpired from "../LinkExpired/LinkExpired";
import "../../global.css";

const AppRouter = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  let location = useLocation();
  const navigate = useNavigate();
  const path = window.location.pathname;
  const isMobile = window.innerWidth <= 768;
  const isLoggedIn = localStorage.getItem("token");

  useEffect(() => {
    if (
      location.pathname === "/forgot-password" ||
      location.pathname.startsWith("/change-password") ||
      location.pathname === "/link-expired"
    )
      return;

    if (location.pathname === "/") {
      if (isLoggedIn) {
        navigate("/dashboard");
      }
    } else {
      if (!isLoggedIn) {
        navigate("/");
      }
    }
  }, [location, isLoggedIn, navigate]); // Add missing dependencies

  return (
    <div className="app-container">
      <ToastContainer />
      {path !== ROUTES.ROUTE_LOGIN &&
        path !== "/" &&
        path !== "/forgot-password" &&
        !path.startsWith("/change-password") &&
        path !== "/link-expired" && (
          <FloatingNavigationBarButton
            isOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        )}

      {isMobile &&
        path !== ROUTES.ROUTE_LOGIN &&
        path !== "/" &&
        path !== "/forgot-password" &&
        !path.startsWith("/change-password") &&
        path !== "/link-expired" && (
          <IconButton
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`menu-icon-button ${isMenuOpen ? "open" : ""}`}
          >
            <MenuIcon />
          </IconButton>
        )}

      <div
        className={`content-container ${
          isLoggedIn ? "logged-in" : "full-width"
        }`}
      >
        <Routes>
          <Route path={ROUTES.ROUTE_LOGIN} element={<LoginForm />} />
          <Route path={ROUTES.ROUTE_DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.ROUTE_ADD_ACCOUNT} element={<AddAccountForm />} />
          <Route
            path={`${ROUTES.ROUTE_EDIT_ACCOUNT}/:id`}
            element={<EditAccountForm />}
          />
          <Route
            path={ROUTES.ROUTE_UPLOAD_COMMISSIONS}
            element={<UploadCommissions />}
          />
          <Route
            path={ROUTES.ROUTE_UPLOAD_COMMISSIONS_TEST}
            element={<UploadCsvTest />}
          />
          <Route
            path={ROUTES.ROUTE_MONTHLY_EMAIL_FORM}
            element={<MonthlyEmailForm />}
          />
          <Route path={ROUTES.ROUTE_PROFILE} element={<Profile />} />
          <Route
            path={ROUTES.ROUTE_RESET_PASSWORD}
            element={<ResetPassword />}
          />
          <Route path={ROUTES.ROUTE_GENEALOGY} element={<ChildrenTable />} />
          <Route
            path={ROUTES.ROUTE_COMMISSIONS}
            element={<CommissionsTable />}
          />
          <Route
            path={`${ROUTES.ROUTE_EDIT_ACCOUNT_RELATIONSHIPS}/:id`}
            element={<EditRelationships />}
          />
          <Route
            path={`${ROUTES.ROUTE_CHANGE_PASSWORD_USER}/:token/:id`}
            element={<ResetPasswordForm />}
          />

          <Route
            path={ROUTES.ROUTE_FORGOT_PASSWORD}
            element={<ForgotPasswordForm />}
          />

          <Route path={ROUTES.ROUTE_LINK_EXPIRED} element={<LinkExpired />} />
        </Routes>
      </div>
    </div>
  );
};

export default AppRouter;
