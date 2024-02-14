const jwt = require("jsonwebtoken")
require("dotenv").config(); //환경변수

const authVerify = async (req, res, next) => {

    const result = {
        "success": false,
        "message": null
    }
    console.log(req);
    const authToken = req.cookies.token
    try {
        if (authToken == undefined) { // 존재하지 않는 토큰 예외
            throw new Error("토큰이 존재하지 않습니다.")
        }
        
        req.decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY)
        result.success = true
        return next()
    } catch (err){
        // 유효하지 않는 토큰 예외
        result.message = err.message
        return res.send(result)
    }
}

module.exports = authVerify