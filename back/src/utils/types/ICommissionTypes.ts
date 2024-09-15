export type ICommission = {
    email: string
    firstName: string
    lastName: string
    phone: string
    country: string
    isVerified: boolean
    md5Id: string
    totalTradedLots: number
    lots: number
    balanceUsd: number
    equityUsd: number
    commissionUsd: number
    plClosedUsd: number
    depositsUsd: number
    withdrawalsUsd: number
    netDepositsUsd: number
    commissionDate: Date
}