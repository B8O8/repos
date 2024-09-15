import axios from "axios";

export const getToken = () => {
    const token = localStorage.getItem("token");
    return token ? token : null;
  };
  
  export const getAuthorizationHeader = () => `Bearer ${getToken()}`;
  export const axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getAuthorizationHeader()
      },
    });