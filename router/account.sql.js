const getKakaoUserByEmail = `
    SELECT * 
    FROM kakao_login 
    WHERE email = ?
`;
const kakaoRegister = `
    INSERT INTO kakao_login (email, id, accessToken)
    VALUE (?,?,?)
`;
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
    INSERT INTO user (email, nickname, profileImageUrl, introduce, created_at, updated_at, is_deacitved)
    VALUE (?,?,?,?,?,?,?)    
`

module.exports = {
    getKakaoUserByEmail: getKakaoUserByEmail,
    kakaoRegister: kakaoRegister,
    findUserByEmail: findUserByEmail,
    findUserByNickname: findUserByNickname,
    userRegister: userRegister
}