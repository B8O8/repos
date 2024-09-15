import { toast } from "react-toastify";
import {jwtDecode} from 'jwt-decode';

export enum ToastType {
    SUCCESS,
    ERROR,
}
export const notify = (message: string, type: ToastType) => {
    if(type === ToastType.SUCCESS) {
        toast.success(message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
            autoClose: 3000

        });
    }
    else {
        toast.error(message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            hideProgressBar: true,
            autoClose: 3000
        });        
    }
};

export const asFormattedDate = (origin: any): string => {
    return new Date(origin)?.toISOString()?.split("T")[0] || "";
};
  

export const isUserAdmin = () => {
    const token = localStorage.getItem('token');
    if(!token) return false
    const decodedToken = jwtDecode(token);
    const isAdmin = (decodedToken as any).isAdmin ? true : false;
    return isAdmin
}

export const getLoggedInUserId = () => {
    const token = localStorage.getItem('token');
    if(!token) return false
    const decodedToken = jwtDecode(token) as any;
    const userId = decodedToken.userId || "";
    return userId
}

