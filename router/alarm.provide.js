import { getAlarm } from "./alarm.sql.js";

const router = require("express").Router()

// 알림 불러오기 api
router.get("/all", async (req, res) => {  // 원래 entry point가 /alarm/all인데 server.js app.use에서 써줬으니 /alarm은 생략하는 느낌
    // 참고로 req는 프론트에서 오는 정보, res는 프론트로 보내는 정보입니당
    // const userIndex = req.decoded.userIndex // 여기는 session관련 부분인데 jwt랑 같이 공부해보시면 좋을 것 같아요
    const userIndex = 1 // 예를 들어 req로 1을 받았다고 치고

    const result = { // result값은 default로 선언해두고
        "success": false,
        "message": null,
        "data": []
    }
    
    try { // 여기서부터 db접속 관련이에요

        client = new Client()

        await client.connect()
        
        const values = [userIndex] // sql문에 들어갈 value들을 저장하는 곳 여기서는 userIndex가 되겠죠?

        const data = await client.query(getAlarm, values) // db에 쿼리문을 날리는데 그에 대한 데이터 값들을 저장하는 거에요
        const row = data.rows
 
        if (row.length > 0) { // 받아온 데이터 값들이 있으면 result에 저장해두고
            result.data.push(row)
        } else { // 없으면 message에 없다고 적으면 되겠죠?
            result.message = '알림이 존재하지 않습니다.'
        }
        
        result.success = true // 여기까지 왔으면 받은 데이터의 유무와 상관없이 api가 다 작동한 거니까 success true를 주고
    } catch(err) { // 위 과정에서 에러가 있다면 예를 들어서 뭐 db접속이 안됐다거나 하면 에러가 떠서 여기로 와요
        result.message = err.message // 어떤 에러인지 message값에 적어주면 됩니당
    }

    if (client) client.end() // db 관련된거 끝났으니까 db접속도 끊어주고

    res.send(result) // 위의 결과들을 프론트로 보내주면 됩니당
})

// 아직 db접속을 안해서 이 코드를 돌리면 아마 에러가 뜰건데 db접속 해서 위에 적은 코드같이 해서 하시면 이해되실거에요