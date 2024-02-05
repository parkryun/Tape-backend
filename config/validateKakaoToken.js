const axios = require('axios');

async function verifyKakaoToken(token){
    try{
        const response = await axios({
            method: 'GET',
            url: 'https://kapi.kakao.com/v1/user/access_token_info',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if(response.status===200){
            return null;
        }
        else{
            return 'Wrong token';
        }
    } catch(error){
        return 'Can\'t verify token';
    }
}

module.exports = verifyKakaoToken;