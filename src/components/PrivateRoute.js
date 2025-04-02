// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom'; // Navigate 사용
import { UserContext } from '../context/UserContext'; // 로그인 상태 확인

const PrivateRoute = ({ element, ...rest }) => {
  const { currentUser } = useContext(UserContext); // 로그인 상태 확인

  // 로그인 상태가 없으면 로그인 페이지로 리디렉션
  return (
    <Route
      {...rest}
      element={currentUser ? element : <Navigate to="/login" />} // 로그인 상태에 따라 렌더링
    />
  );
};

export default PrivateRoute;
