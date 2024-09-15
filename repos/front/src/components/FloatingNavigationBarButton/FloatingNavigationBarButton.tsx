import * as React from "react";
import IconButton from "@mui/material/IconButton";
import logo from "./logo.png";
import classes from "./styles.module.css";
import HomeIcon from "@mui/icons-material/Home";
import LanIcon from "@mui/icons-material/Lan";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountApiService from "../../utils/apis/accounts";
import { ROUTES } from "../../utils/routes";
import MenuItem from "./MenuItem";
import { API_BASE_URL } from "../../utils/constants";
import { getLoggedInUserId } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { IProfile } from "../../utils/interfaces/IUser";

interface IProps {
  isOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function FloatingNavigationBarButton({ isOpen, setIsMenuOpen }: IProps) {
  const navigate = useNavigate();
  const [activeRoute, setActiveRoute] = React.useState<string>("/");
  const userId = getLoggedInUserId();
  const [profile, setProfile] = React.useState<IProfile>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    React.useState<boolean>(false);

  const fetchData = async (): Promise<void> => {
    try {
      const data = await AccountApiService.getProfile();
      setProfile(data);
    } catch (error: any) {
      console.error("Error in fetchData:", error.message || error);
      // Optionally, you can set an error state here to display an error message to the user
    }
  };
  React.useEffect(() => {
    fetchData();
  }, []);

  const getActiveRoute = (path: string): void => {
    switch (path) {
      case "/":
      case ROUTES.ROUTE_DASHBOARD:
        setActiveRoute(ROUTES.ROUTE_DASHBOARD);
        break;
      case ROUTES.ROUTE_GENEALOGY:
        setActiveRoute(ROUTES.ROUTE_GENEALOGY);
        break;
      case ROUTES.ROUTE_COMMISSIONS:
      case ROUTES.ROUTE_UPLOAD_COMMISSIONS:
        setActiveRoute(ROUTES.ROUTE_COMMISSIONS);
        break;
      case ROUTES.ROUTE_PROFILE:
      case ROUTES.ROUTE_RESET_PASSWORD:
        setActiveRoute(ROUTES.ROUTE_PROFILE);
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    getActiveRoute(window.location.pathname);
  }, [window.location.pathname]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <div className={classes.parentContainer}>
      <nav
        className={`${classes.navbar} ${
          isMobileMenuOpen ? classes.navbarOpen : ""
        }`}
      >
        <div
          className={classes.logoContainer}
          onClick={() => navigate(ROUTES.ROUTE_DASHBOARD)}
        >
          <img src={logo} alt="logo" />
        </div>
        <div className={classes.menuButtonHead}>
          <div
            className={`${classes.menuButton} ${
              isMobileMenuOpen ? classes.menuButtonOpen : ""
            }`}
            onClick={handleMobileMenuToggle}
          >
            <div
              className={`${classes.hamburger} ${
                isMobileMenuOpen ? classes.open : ""
              }`}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <ul
          className={`${classes.menuContainer} ${
            isMobileMenuOpen ? classes.menuOpen : ""
          }`}
        >
          <MenuItem
            setIsMenuOpen={setIsMenuOpen}
            Icon={HomeIcon}
            isActive={activeRoute === ROUTES.ROUTE_DASHBOARD}
            path={ROUTES.ROUTE_DASHBOARD}
            text="Home"
          />
          <MenuItem
            setIsMenuOpen={setIsMenuOpen}
            Icon={LanIcon}
            isActive={activeRoute === ROUTES.ROUTE_GENEALOGY}
            path={ROUTES.ROUTE_GENEALOGY}
            text="Genealogy"
          />
          <MenuItem
            setIsMenuOpen={setIsMenuOpen}
            Icon={PriceChangeIcon}
            isActive={activeRoute === ROUTES.ROUTE_COMMISSIONS}
            path={ROUTES.ROUTE_COMMISSIONS}
            text="Commissions"
          />
          <MenuItem
            setIsMenuOpen={setIsMenuOpen}
            Icon={SettingsIcon}
            isActive={activeRoute === ROUTES.ROUTE_PROFILE}
            path={ROUTES.ROUTE_PROFILE}
            text="Profile"
          />
          <li>
            <IconButton onClick={AccountApiService.logout}>
              <LogoutIcon />
              <span className={classes.text}>Logout</span>
            </IconButton>
          </li>
          <div
            className={classes.profileContainer}
            onClick={() => navigate(ROUTES.ROUTE_PROFILE)}
          >
            <div className={classes.profileImageContainer}>
              <img
                src={`${API_BASE_URL}/profile-images/${userId}.png`}
                alt="User"
                onError={(e: any) => {
                  e.target.src = logo;
                }}
              />
            </div>
            <span style={{ color: "white", marginLeft: "10px" }}>
              {(profile?.firstName || "").substring(0, 10)}
            </span>
          </div>
        </ul>
      </nav>
      {/* Floating Bar visible only on mobile */}
      <div
        className={`${classes.floatingBar} ${
          isMobileMenuOpen ? classes.floatingBarOpen : ""
        }`}
      >
        <div
          className={`${classes.hamburger} ${
            isMobileMenuOpen ? classes.open : ""
          }`}
          onClick={handleMobileMenuToggle}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default FloatingNavigationBarButton;

// import * as React from "react";
// import IconButton from "@mui/material/IconButton";
// import logo from "./logo.png";
// import classes from "./styles.module.css";
// import HomeIcon from "@mui/icons-material/Home";
// import LanIcon from "@mui/icons-material/Lan";
// import PriceChangeIcon from "@mui/icons-material/PriceChange";
// import LogoutIcon from "@mui/icons-material/Logout";
// import SettingsIcon from "@mui/icons-material/Settings";
// import AccountApiService from "../../utils/apis/accounts";
// import { ROUTES } from "../../utils/routes";
// import MenuItem from "./MenuItem";
// import { API_BASE_URL } from "../../utils/constants";
// import { getLoggedInUserId } from "../../utils/helpers";
// import { useNavigate } from "react-router-dom";
// import { IProfile } from "../../utils/interfaces/IUser";

// interface IProps {
//   isOpen: boolean;
//   setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// function FloatingNavigationBarButton({ isOpen, setIsMenuOpen }: IProps) {
//   const navigate = useNavigate();
//   const [activeRoute, setActiveRoute] = React.useState<string>("/");
//   const userId = getLoggedInUserId();
//   const isMobile = window.innerWidth <= 768;
//   const [profile, setProfile] = React.useState<IProfile>();

//   const fetchData = async (): Promise<void> => {
//     const data = await AccountApiService.getProfile();
//     setProfile(data);
//   };

//   React.useEffect(() => {
//     fetchData();
//   }, []);

//   React.useEffect(() => {
//     handleToggleOpen();
//   }, [isOpen]);

//   const getActiveRoute = (path: string): void => {
//     switch (path) {
//       case "/":
//       case ROUTES.ROUTE_DASHBOARD:
//         setActiveRoute(ROUTES.ROUTE_DASHBOARD);
//         break;
//       case ROUTES.ROUTE_GENEALOGY:
//         setActiveRoute(ROUTES.ROUTE_GENEALOGY);
//         break;
//       case ROUTES.ROUTE_COMMISSIONS:
//       case ROUTES.ROUTE_UPLOAD_COMMISSIONS:
//         setActiveRoute(ROUTES.ROUTE_COMMISSIONS);
//         break;
//       case ROUTES.ROUTE_PROFILE:
//       case ROUTES.ROUTE_RESET_PASSWORD:
//         setActiveRoute(ROUTES.ROUTE_PROFILE);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleToggleOpen = () => {
//     if (isMobile) {
//       setIsMenuOpen(isOpen);
//     }
//   };

//   React.useEffect(() => {
//     getActiveRoute(window.location.pathname);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [window.location.pathname]);

//   return (
//     <div
//       style={{
//         zIndex: isMobile ? 2 : 0,
//       }}
//       className={`${classes.parentContainer} ${isOpen ? classes.open : ""}`}
//     >
//       <nav className={`${classes.menuContainer} ${isOpen ? "open" : ""}`}>
//         <ul>
//           <li>
//             <div
//               className={classes.logoContainer}
//               onClick={() => navigate(ROUTES.ROUTE_DASHBOARD)}
//             >
//               <img src={logo} alt="logo" />
//             </div>
//           </li>
//           <MenuItem
//             setIsMenuOpen={setIsMenuOpen}
//             Icon={HomeIcon}
//             isActive={activeRoute === ROUTES.ROUTE_DASHBOARD}
//             path={ROUTES.ROUTE_DASHBOARD}
//           />
//           <MenuItem
//             setIsMenuOpen={setIsMenuOpen}
//             Icon={LanIcon}
//             isActive={activeRoute === ROUTES.ROUTE_GENEALOGY}
//             path={ROUTES.ROUTE_GENEALOGY}
//           />
//           <MenuItem
//             setIsMenuOpen={setIsMenuOpen}
//             Icon={PriceChangeIcon}
//             isActive={activeRoute === ROUTES.ROUTE_COMMISSIONS}
//             path={ROUTES.ROUTE_COMMISSIONS}
//           />
//           <MenuItem
//             setIsMenuOpen={setIsMenuOpen}
//             Icon={SettingsIcon}
//             isActive={activeRoute === ROUTES.ROUTE_PROFILE}
//             path={ROUTES.ROUTE_PROFILE}
//           />
//           <li>
//             <IconButton onClick={AccountApiService.logout}>
//               <LogoutIcon />
//             </IconButton>
//           </li>
//         </ul>
//         <div
//           className={classes.profileContainer}
//           onClick={() => navigate(ROUTES.ROUTE_PROFILE)}
//         >
//           <div>
//             <div className={classes.profileImageContainer}>
//               <img
//                 src={`${API_BASE_URL}/profile-images/${userId}.png`}
//                 alt="User"
//                 onError={(e: any) => {
//                   e.target.src = logo; // Set the default image if the specified image fails to load
//                 }}
//               />
//             </div>
//           </div>
//           <span>{(profile?.firstName || "").substring(0, 10)}</span>
//         </div>
//       </nav>
//     </div>
//   );
// }

// export default FloatingNavigationBarButton;

// import * as React from "react";
// import IconButton from "@mui/material/IconButton";
// import logo from "./logo.png";
// import classes from "./styles.module.css";
// import HomeIcon from "@mui/icons-material/Home";
// import LanIcon from "@mui/icons-material/Lan";
// import PriceChangeIcon from "@mui/icons-material/PriceChange";
// import LogoutIcon from "@mui/icons-material/Logout";
// import SettingsIcon from "@mui/icons-material/Settings";
// import AccountApiService from "../../utils/apis/accounts";
// import { ROUTES } from "../../utils/routes";
// import MenuItem from "./MenuItem";
// import { API_BASE_URL } from "../../utils/constants";
// import { getLoggedInUserId } from "../../utils/helpers";
// import { useNavigate } from "react-router-dom";
// import { IProfile } from "../../utils/interfaces/IUser";

// interface IProps {
//   isOpen: boolean;
//   setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// function FloatingNavigationBarButton({ isOpen, setIsMenuOpen }: IProps) {
//   const navigate = useNavigate();
//   const [activeRoute, setActiveRoute] = React.useState<string>("/");
//   const [menuSx, setMenuSx] = React.useState<any>({});
//   const userId = getLoggedInUserId();
//   const isMobile = window.innerWidth <= 768;
//   const [profile, setProfile] = React.useState<IProfile>();

//   const fetchData = async (): Promise<void> => {
//     const data = await AccountApiService.getProfile();
//     setProfile(data);
//   };

//   React.useEffect(() => {
//     fetchData();
//   }, []);

//   React.useEffect(() => {
//     handleToggleOpen();
//   }, [isOpen]);

//   const getActiveRoute = (path: string): void => {
//     switch (path) {
//       case "/":
//       case ROUTES.ROUTE_DASHBOARD:
//         setActiveRoute(ROUTES.ROUTE_DASHBOARD);
//         break;
//       case ROUTES.ROUTE_GENEALOGY:
//         setActiveRoute(ROUTES.ROUTE_GENEALOGY);
//         break;
//       case ROUTES.ROUTE_COMMISSIONS:
//       case ROUTES.ROUTE_UPLOAD_COMMISSIONS:
//         setActiveRoute(ROUTES.ROUTE_COMMISSIONS);
//         break;
//       case ROUTES.ROUTE_PROFILE:
//       case ROUTES.ROUTE_RESET_PASSWORD:
//         setActiveRoute(ROUTES.ROUTE_PROFILE);
//         break;
//       default:
//         break;
//     }
//   };

//   const handleToggleOpen = () => {
//     if (isMobile) {
//       if (isOpen) {
//         setMenuSx({ translate: "0", display: "block" });
//       } else setMenuSx({ translate: "-50vw", display: "none" });
//     } else {
//       setMenuSx({});
//     }
//   };

//   React.useEffect(() => {
//     getActiveRoute(window.location.pathname);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [window.location.pathname]);

//   return (
//     <div
//       style={{
//         zIndex: isMobile ? 2 : 0,
//         width: isMobile ? "100vw" : "auto",
//       }}
//       className={classes.parentContainer}
//     >
//       <nav style={menuSx} className={classes.menuContainer}>
//         <ul>
//           <li>
//             <div
//               className={classes.logoContainer}
//               onClick={() => navigate(ROUTES.ROUTE_DASHBOARD)}
//             >
//               <img src={logo} alt="logo" />
//             </div>
//           </li>
//           <MenuItem
//             setIsMenuOpen={setIsMenuOpen}
//             Icon={HomeIcon}
//             isActive={activeRoute === ROUTES.ROUTE_DASHBOARD}
//             path={ROUTES.ROUTE_DASHBOARD}
//           />
//           <MenuItem
//             setIsMenuOpen={setIsMenuOpen}
//             Icon={LanIcon}
//             isActive={activeRoute === ROUTES.ROUTE_GENEALOGY}
//             path={ROUTES.ROUTE_GENEALOGY}
//           />
//           <MenuItem
//             setIsMenuOpen={setIsMenuOpen}
//             Icon={PriceChangeIcon}
//             isActive={activeRoute === ROUTES.ROUTE_COMMISSIONS}
//             path={ROUTES.ROUTE_COMMISSIONS}
//           />
//           <MenuItem
//             setIsMenuOpen={setIsMenuOpen}
//             Icon={SettingsIcon}
//             isActive={activeRoute === ROUTES.ROUTE_PROFILE}
//             path={ROUTES.ROUTE_PROFILE}
//           />
//           <li>
//             <IconButton onClick={AccountApiService.logout}>
//               <LogoutIcon />
//             </IconButton>
//           </li>
//         </ul>
//         <div
//           className={classes.profileContainer}
//           onClick={() => navigate(ROUTES.ROUTE_PROFILE)}
//           style={{ height: isMobile ? "23vh" : "15vh" }}
//         >
//           <div>
//             <div className={classes.profileImageContainer}>
//               <img
//                 src={`${API_BASE_URL}/profile-images/${userId}.png`}
//                 alt="User"
//                 onError={(e: any) => {
//                   e.target.src = logo; // Set the default image if the specified image fails to load
//                 }}
//               />
//             </div>
//           </div>
//           <span>{(profile?.firstName || "").substring(0, 10)}</span>
//         </div>
//       </nav>
//     </div>
//   );
// }

// export default FloatingNavigationBarButton;
