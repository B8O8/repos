export type IAccount = {
    _id: string
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    md5Id: string;
}

export type IAccountData = IAccount & {
    _id: string,
    accountLevel: number,
    parentAccount: IAccount
}

export type IAccountForm = Omit<IAccount, '_id' |'password' | 'isAdmin' | 'linkedAccounts'>;

export type IAccountFormAsAdmin =  Omit<IAccountForm & {
    parentAccountId: string
    childAccountId: string
}, '_id'>

export interface IAccountLoginForm {
    email: string;
    password: string;
}