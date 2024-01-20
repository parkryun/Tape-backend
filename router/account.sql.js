const getUser = `
    SELECT * 
    FROM kakao_login 
    WHERE email = ?
`;
const userLogin = `
    INSERT INTO kakao_login (id,email,access_token)
    VALUE (?)
`;
const kakaoRegister = `
    INSERT INTO kakao_login (email, id)
    VALUE (?,?)
`;
const findUserByEmail = `
    SELECT * 
    FROM user
    WHERE email = ?
`;
const userRegister = `
    INSERT INTO user (email, nickname, profileImageUrl, introduce)
    VALUE (?,?,?,?)    
`

module.exports = {
    getUser: getUser,
    userLogin: userLogin,
    kakaoRegister: kakaoRegister,
    findUserByEmail: findUserByEmail,
    userRegister: userRegister
}