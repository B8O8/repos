export type UserUpdateDTO = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  md5Id: string;
  charged: number;
  dispensed: number;
  cashout: number;
  password?: string;         // Add password field for updates
  resetToken?: string | null;       // Token for password reset
  resetTokenExpiry?: string | null; // Expiry for password reset token
};

export type UserInsertDTO = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin: boolean;
  md5Id: string;
  createdAt: Date;
  charged: number;
  dispensed: number;
  cashout: number;
  resetToken?: string;       // Optional reset token for new users
  resetTokenExpiry?: string ; // Optional token expiry for new users
};

export type UserGetDTO = {
  id: number;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin: boolean;
  charged: number;
  dispensed: number;
  cashout: number;
  md5Id: string;
  createdAt: Date;
  level?: number;
  commissionChunk?: number;
  uplineId?: number;
  uplineEmail?: string;
  uplineMd5Id?: string;
  uplineFirstName?: string;
  uplineLastName?: string;
  uplinePhoneNumber?: string;
  resetToken?: string;       // Token for password reset
  resetTokenExpiry?: string ; // Token expiry for password reset
};
