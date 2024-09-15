export type IProfile = {
  id: number;
  email: string;
  username: string;
  md5Id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: Date;
  isAdmin: boolean;
  uplineFirstName: string;
  uplineLastName: string;
  uplineEmail: string;
  uplinePhoneNumber: string;
};

export type IChildrenGet = {
  id: number;
  email: string;
  username: string;
  md5Id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  level: number;
  directSponsorFirstName: string;
  directSponsorLastName: string;
};

export type IUserGet = {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin: boolean;
  md5Id: string;
  createdAt: Date;
  charged?: number;
  dispensed?: number;
  cashout?: number;
  level?: number;
  commissionChunk?: number;
  uplineId?: number;
  uplineEmail?: string;
  uplineMd5Id?: string;
  uplineFirstName?: string;
  uplineLastName?: string;
};

export interface IUserInsert {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  md5Id: string;
}

export type IUserUpdateRelationships = {
  uplineId: number;
  downlineId: number;
  commissionChunk: number;
};

export type IUserUpdateChargedAndRelationships = {
  charged: number;
  relationships: IUserUpdateRelationships[];
};
