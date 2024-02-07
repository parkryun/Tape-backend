const findUserByEmail = `
    SELECT * 
    FROM user
    WHERE email = ?
`;
const findUserByNickname = `
    SELECT * 
    FROM user 
    WHERE Nickname = ?
`;
const userRegister = `
    INSERT INTO user (email, nickname, profileImageUrl, introduce, created_at, updated_at, is_deactived)
    VALUE (?,?,?,?,?,?,?)    
`

module.exports = {
    findUserByEmail: findUserByEmail,
    findUserByNickname: findUserByNickname,
    userRegister: userRegister
}