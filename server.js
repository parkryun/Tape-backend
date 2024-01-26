const express = require("express")
const path = require("path")
const app = express()
const port = 3000
const acconutApi = require('./router/account.provider')
const jwt = require('jsonwebtoken');

// app.use ---------------------------------------------------
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use('/account', acconutApi);

// app.get ---------------------------------------------------


app.listen(port, () => {
    console.log(`${port} 번에서 웹 서버가 시작됨`)
})