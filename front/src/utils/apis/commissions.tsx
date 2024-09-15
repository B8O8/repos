// apiService.js
import { axiosInstance } from "../axiosInstance";
import { API_BASE_URL } from "../constants";
import { asFormattedDate, notify } from "../helpers";

const BASE_URL = `${API_BASE_URL}/commission`;

class CommissionApiService {
  static async getCommissionBetween(from: string, to: string) {
    const url = `${BASE_URL}/between`;
    try {
      const response = await axiosInstance.post(url, { from, to });
      console.log("response", response.data);
      return response.data;
    } catch (error: any) {
      return [];
    }
  }

  static async uploadCsv(file: any, date: string) {
    const url = `${BASE_URL}/upload`;
    const formData = new FormData();
    formData.append("csvFile", file);
    formData.append("date", asFormattedDate(date));
    const response = await axiosInstance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async uploadCsvTest(file: any) {
    const url = `${BASE_URL}/upload-test`;
    const formData = new FormData();
    formData.append("csvFile", file);
    try {
      const response = await axiosInstance.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      return response.data;
    } catch (error: any) {
      return [];
    }
  }

  static async sendMonhtlyEmail(from: string, to: string) {
    const url = `${BASE_URL}/monthly`;
    try {
      const response = await axiosInstance.post(url, { from, to });
      return response.data;
    } catch (error: any) {
      return undefined;
    }
  }

  static async getCommissions() {
    const url = `${BASE_URL}/`;
    try {
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      return [];
    }
  }

// this method is to get all users commissions for a week and a month
static async getAllUsersCommissions(weekDates: {firstDay: string, lastDay: string}, monthDates: {firstDay: string, lastDay: string}): Promise<any[]> {
  const url = `${BASE_URL}/all-users-commissions`; 
  try {
    const response = await axiosInstance.post(url, {
      weekStart: weekDates.firstDay,
      weekEnd: weekDates.lastDay,
      monthStart: monthDates.firstDay,
      monthEnd: monthDates.lastDay
    });
    
    return response.data; // Expect the backend to return a list of users with their commissions
  } catch (error: any) {
    notify(error.response?.data || "Something went wrong", error);
    return [];
  }
}

  // Add more methods as needed for your API
}

export default CommissionApiService;
