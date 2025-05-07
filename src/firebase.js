// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 인증용 추가

const firebaseConfig = {
  apiKey: "AIzaSyBlwiRKvyvV8au9EfrDUOiVWaRMuH9Ofhs",
  authDomain: "career-match-3451a.firebaseapp.com",
  projectId: "career-match-3451a",
  storageBucket: "career-match-3451a.firebasestorage.app",
  messagingSenderId: "566146740486",
  appId: "1:566146740486:web:d9bafa9e0ad380b31bee87"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// 인증 객체 가져오기
export const auth = getAuth(app);
