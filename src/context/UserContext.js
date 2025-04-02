// src/context/UserContext.js

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase'; // firebase에서 auth import

// UserContext 생성
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // currentUser 상태를 설정
  const [currentUser, setCurrentUser] = useState(null);

  // Firebase 인증 상태가 변경되면 호출되는 함수
  useEffect(() => {
    // onAuthStateChanged는 인증 상태가 변경될 때마다 호출됩니다.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // 로그인 상태를 업데이트
    });
    return () => unsubscribe(); // 컴포넌트 언마운트 시 Firebase 리스너 제거
  }, []);

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}  {/* 자식 컴포넌트에 currentUser 값 전달 */}
    </UserContext.Provider>
  );
};
