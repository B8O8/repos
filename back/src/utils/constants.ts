export const USER_GET_FIELDS = `
    users.id as id,
    users.email as email,
    users.username as username,
    users.firstName as firstName,
    users.lastname as lastName,
    users.phoneNumber as phoneNumber,
    users.md5Id as md5Id,
    users.createdAt as createdAt,
    users.charged as charged,
    users.dispensed as dispensed,
    users.cashout as cashout,
    users.resetToken as resetToken,          
    users.resetTokenExpiry as resetTokenExpiry 
`;
