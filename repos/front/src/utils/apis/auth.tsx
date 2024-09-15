import { axiosInstance } from "../axiosInstance";
import { API_BASE_URL } from "../constants";
import { ToastType, notify } from "../helpers";
import { IAccountLoginForm } from "../interfaces";

const BASE_URL = `${API_BASE_URL}`;

class AuthApiService {
    static async login(payload: IAccountLoginForm) {
        try {
          const url = `${BASE_URL}/login`;
          const response = await axiosInstance.post(url, payload);
          const token = response.data.token;
          localStorage.setItem("token", token);
          notify("Login successful", ToastType.SUCCESS);
          setTimeout(() => {
            window.location.reload();
          }, 300);
          return;
        } catch (error: any) {
    
          notify(error.response.data.error, ToastType.ERROR);
        }
      }
}

export default AuthApiService;
