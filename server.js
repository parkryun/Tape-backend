const express = require("express")
const cookieParser = require("cookie-parser")
const path = require("path")
const app = express()
const PORT = process.env.PORT || 3000;

require("dotenv").config()

const alarmApi = require("./router/alarm.provide.js")
const followApi = require("./router/follow.services.js")
const profileProvideApi = require("./router/profile.provide.js")
const profileServicesApi = require("./router/profile.services.js")
const acconutApi = require('./router/account.provider')
const commentProvideApi = require('./router/comment.provide.js')
const commentServiceApi = require('./router/comment.service.js')

// const tapeApi = require("./router/tape.services")

// app.use ---------------------------------------------------
app.use(express.urlencoded({extended:false}));
app.use(express.json())

// app.get ---------------------------------------------------
app.use(cookieParser())
// app.use("/alarm", alarmApi)
// app.use("/follow", followApi)
// app.use("/profile", profileProvideApi)
// app.use("/profile", profileServicesApi)
// app.use('/account', acconutApi);
// // app.use("/tape", tapeApi)
app.use('/tape', commentProvideApi);
app.use('/tape', commentServiceApi);

// app.get ---------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.listen(port, () => {
    console.log(`${port} 번에서 웹 서버가 시작됨`)
})