import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({
    // 사용자 기본 정보
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
        setMatchResults 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};