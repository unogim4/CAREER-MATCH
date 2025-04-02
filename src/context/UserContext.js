import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // 기존 사용자 입력 데이터
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    github: '',
    portfolio: '',
    education: '',
    major: '',
    career: '',
    introduction: ''
  });

  const [devType, setDevType] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [matchResults, setMatchResults] = useState(null);

  // ✅ 로그인된 사용자 상태 추가
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ 로그인 여부 실시간 반영 (Firebase 인증 상태 변화 감지)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // 로그인 상태 업데이트
    });
    return () => unsubscribe(); // cleanup
  }, []);

  // ✅ 로그아웃 함수
  const logout = () => {
    signOut(auth).catch((error) => {
      console.error('로그아웃 에러:', error);
    });
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        devType,
        setDevType,
        selectedSkills,
        setSelectedSkills,
        matchResults,
        setMatchResults,
        currentUser,      // ✅ 현재 로그인된 사용자
        logout            // ✅ 로그아웃 함수
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
