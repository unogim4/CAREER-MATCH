// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Navigate } from 'react-router-dom'; // Navigate를 사용합니다
import { UserContext } from '../context/UserContext'; // 로그인 상태를 확인

const PrivateRoute = ({ element, ...rest }) => {
  const { currentUser } = useContext(UserContext); // 로그인 상태 확인

  return (
    <Route
      {...rest}
      element={currentUser ? element : <Navigate to="/login" />} // 로그인되지 않으면 /login으로 리디렉션
    />
  );
};

export default PrivateRoute;
