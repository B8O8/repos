// apiService.js

import { API_BASE_URL } from "../constants";
import { axiosInstance } from "../axiosInstance";
import { ToastType, notify } from "../helpers";
import {
  IProfile,
  IUserGet,
  IUserInsert,
  IUserUpdateChargedAndRelationships,
} from "../interfaces/IUser";

const BASE_URL = `${API_BASE_URL}/user`;

class AccountApiService {
  static async uploadProfile(formData: FormData): Promise<boolean> {
    const url = `${API_BASE_URL}/profile-picture`;
    try {
      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Something went wrong');
    }
  }

  static async getGroupDispensedAmount(id: number): Promise<number> {
    const url = `${BASE_URL}/get-dispensed-commission/${id}`;
    try {
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      notify(
        error.response?.data || "Something went wrong",
        ToastType.ERROR
      );
      return 0;
    }
  }

  static async updateRelationships(
    data: IUserUpdateChargedAndRelationships
  ): Promise<IUserGet[] | undefined> {
    const url = `${BASE_URL}/update-rlt`;
    try {
      const response = await axiosInstance.post(url, data);
      if (response.data.error) {
        notify("An error occured", ToastType.ERROR);
        return undefined;
      }
      return response.data;
    } catch (error: any) {
      notify(
        error.response?.data || "Something went wrong",
        ToastType.ERROR
      );
      return undefined;
    }
  }

  static async getUplines(id: string): Promise<IUserGet[]> {
    const url = `${BASE_URL}/uplines/${id}`;
    try {
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      notify(
        error.response?.data || "Something went wrong",
        ToastType.ERROR
      );
      return [];
    }
  }

  static async getProfile(): Promise<IProfile | undefined> {
    const url = `${BASE_URL}/profile`;
    try {
      const response = await axiosInstance.get(url);
      return response.data as IProfile;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Something went wrong');
    }
  }

  static async changePassword(password: string): Promise<boolean> {
    const url = `${BASE_URL}/update-password`;
    try {
      const response = await axiosInstance.post(url, {
        password,
      });
      return true;
      // return response.data as IProfile;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Something went wrong');

    }
  }

  static async getAllAccounts() {
    const url = `${BASE_URL}/all`;
    try {
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      notify(
        error.response?.data || "Something went wrong",
        ToastType.ERROR
      );
      return [];
    }
  }

  static async getUser(id: number): Promise<IUserGet | undefined> {
    const url = `${BASE_URL}/${id}`;
    try {
      const response = await axiosInstance.get(url);
     
      return response.data;
    } catch (error: any) {
      notify(
        error.response?.data || "Something went wrong",
        ToastType.ERROR
      );
      return undefined;
    }
  }

  static async updatePassword(oldPassword: string, newPassword: string) {
    const url = `${BASE_URL}/reset-password`;
    try {
      const response = await axiosInstance.post(url, {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      notify(
        error.response?.data || "Something went wrong",
        ToastType.ERROR
      );
      return null;
    }
  }

  static async updateUser(
    id: number,
    args: Partial<IUserInsert>
  ): Promise<boolean> {
    const url = `${BASE_URL}/update/${id}`;
    try {

      const response = await axiosInstance.post(url, args);
      if (!response.data) {
        throw new Error('Something went wrong');

      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Something went wrong');

    }
  }

  static async resetPassword(userId: number) {
    const url = `${BASE_URL}/reset-password`;
    try {
      const response = await axiosInstance.post(url, { userId });
      if ((response as any).data)
        notify("Password reset successfully", ToastType.SUCCESS);
      return response.data;
    } catch (error: any) {
      notify(
        error.response?.data || "Something went wrong",
        ToastType.SUCCESS
      );
    }
  }

  static async delete(userId: number) {
    const url = `${BASE_URL}/${userId}`;
    try {
      const response = await axiosInstance.delete(url);
      notify("Account deleted successfully", ToastType.SUCCESS);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Something went wrong');

    }
  }

  static async createAccount(
    payload: IUserInsert,
    uplineId?: number,
    downlineIds?: number[]
  ) {
    const url = `${BASE_URL}/`;
    const accountToSend: any = {
      args: { ...payload, username: payload.username.replaceAll(" ","") },
    };
    if (uplineId) {
      accountToSend.uplineId = uplineId;
    }
    if (downlineIds) {
      accountToSend.downlineIds = downlineIds;
    }

    try {
      const response = await axiosInstance.post(url, accountToSend);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data || 'Something went wrong');
    }
  }

  static logout() {
    localStorage.removeItem("token");
    window.location.reload();
  }

  static async getDownlines(): Promise<IUserGet[]> {
    const url = `${BASE_URL}/downlines`;
    try {
      const response = await axiosInstance.get(url);
      return response.data as IUserGet[];
    } catch (error: any) {
      return [];
    }
  }

  static async requestPasswordReset(payload: { email: string }) {
    const url = `${BASE_URL}/request-password-reset`;
    return await axiosInstance.post(url, payload);
  }

  static async resetPasswordUser(payload: { userId: number, token: string, newPassword: string }) {
    const url = `${BASE_URL}/reset-password-byuser`;
    return await axiosInstance.post(url, payload);
  }

  static async validateResetToken(payload: { userId: number; token: string }) {
    const url = `${BASE_URL}/validate-reset-token`;
    return await axiosInstance.post(url, payload);
  }
}

export default AccountApiService;
