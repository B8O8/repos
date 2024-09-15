interface IUserGroupGetAdmin {
    id: number
    name: string
    totalCommission: number
    superAdminCommission: number
    dispensedCommission: number
    totalUsersCount: number
}

interface IUserGroupGet {
    id: number
    name: string
    dispensedCommission: number
}

interface IUserGroupSet {
    name: string
    totalCommission: number
    superAdminCommission: number
    dispensedCommission: number
}
