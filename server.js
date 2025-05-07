// server.js - Express 서버 설정

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// 라우터 불러오기
const profileRouter = require('./routes/profile');
const jobsRouter = require('./routes/jobs');

// Express 앱 초기화
const app = express();

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

// 라우트 설정
app.use('/api/profile', profileRouter);
app.use('/api/jobs', jobsRouter);

// React 앱 제공 (프로덕션 모드)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다`);
});
