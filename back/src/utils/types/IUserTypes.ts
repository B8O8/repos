export type IProfile = {
  id: number;
  email: string;
  username: string;
  md5Id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: Date;
  sponsorFirstName: string;
  sponsorLastName: string;
  sponsorEmail: string;
  sponsorPhoneNumber: string;
};

export type IUserWithPassword = {
  id: number;
  md5Id: string;
  password: string;
  isAdmin: boolean;
};

export type IUserGet = {
  id: number;
  email: string;
  username: string;
  md5Id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin: boolean;
};

export type IUserSet = {
  email: string;
  username: string;
  md5Id: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isAdmin: boolean;
  charged: number;
  dispensed: number;
  cashout: number;
};

export type IRelationshipGet = {
  id: number;
  accountId: number;
  sponsorId: number;
  level: number;
};

export type IRelationshipSet = {
  id?: number;
  accountId: number;
  sponsorId: number;
  level: number;
};

export type IParentGet = {
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
