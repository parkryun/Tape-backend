const getKakaoUserByEmail = `
    SELECT * 
    FROM kakao_login 
    WHERE email = ?
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
    getKakaoUserByEmail: getKakaoUserByEmail,
    kakaoRegister: kakaoRegister,
    findUserByEmail: findUserByEmail,
    userRegister: userRegister
}