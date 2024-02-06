const db = require('../data/database');
const query = require('../router/account.sql');

async function validateNickname(nickname){
    const existingUser = await db.query(query.findUserByNickname, nickname);;
    const regex = /^[A-Za-z0-9._]+$/;
    if(!regex.test(nickname)){ // 정규표현식 불만족
        return '사용자 이름은 영문, 숫자, 마침표, 밑줄만 사용할 수 있습니다.';
    }
    if(nickname.trim().length>20){ // 닉네임 길이 최대 제한 초과
        return '사용자 이름은 20자 이내로 작성해주세요.';
    }
    if(existingUser[0].length!==0){ // 이미 존재하는 닉네임
        return '이 닉네임은 이미 사용중입니다.';
    }
    return null;
}

module.exports = validateNickname;