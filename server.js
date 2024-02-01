const express = require('express');
require('dotenv').config(); // 환경 변수를 로드합니다.
const publishingRouter = require('./router/publishing.provider');

const app = express();

app.use(express.json()); 
app.use('/api', publishingRouter);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행중입니다.`);
});