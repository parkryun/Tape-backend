const express = require("express")
const cookieParser = require("cookie-parser")
const path = require("path")
const app = express()
const PORT = process.env.PORT || 3000;
const router = express.Router();

require("dotenv").config()

const commentProvideApi = require("./router/comment.provide.js")
const commentServiceApi = require('./router/comment.service.js')

// app.use ---------------------------------------------------
app.use(express.urlencoded({extended:false}));
app.use(express.json())

// app.get ---------------------------------------------------
app.use(cookieParser())
app.get("/tape", commentProvideApi);
app.all("/tape/comment", commentServiceApi);
// app.get ---------------------------------------------------
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.listen(PORT, () => {
    console.log(`${PORT} 번에서 웹 서버가 시작됨`)
})