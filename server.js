const express = require("express")
const app = express()
const port = 3000 

const path = require("path")
const cookieParser = require("cookie-parser")
const expressSession = require('express-session');

require("dotenv").config()

const alarmApi = require("./router/alarm.provide.js")
const followApi = require("./router/follow.services.js")
const profileProvideApi = require("./router/profile.provide.js")
const profileServicesApi = require("./router/profile.services.js")
const tapeServicesApi = require("./router/tape.services.js")
const tapeProvideApi = require("./router/tape.provide.js")
// const musicProvideApi = require("./router/music.provide.js")
const acconutProviderApi = require('./router/account.provider')
const kakaoRegisterApi = require('./router/kakao.account.js');
const createSessionConfig = require('./config/session');

// app.use ---------------------------------------------------
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(cookieParser())

app.use("/alarm", alarmApi)
app.use("/follow", followApi)
app.use("/profile", profileProvideApi)
app.use("/profile", profileServicesApi)
app.use("/tape", tapeServicesApi)
app.use("/tape", tapeProvideApi)
// app.use("/music", musicProvideApi)
app.use('/account', acconutProviderApi);
app.use("/kakao", kakaoRegisterApi);

// app.get ---------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.listen(port, () => {
    console.log(`${port} 번에서 웹 서버가 시작됨`)
})