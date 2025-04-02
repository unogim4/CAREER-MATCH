// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // 로그인 상태 확인

const PrivateRoute = ({ element, ...rest }) => {
  const { currentUser } = useContext(UserContext); // 로그인 상태 확인

  return (
    <Route
      {...rest}
      render={() =>
        currentUser ? ( // 로그인 되어 있으면 페이지 보여주기
          element
        ) : (
          <Navigate to="/login" /> // 로그인 안 되어 있으면 로그인 페이지로 리디렉션
        )
      }
    />
  );
};

export default PrivateRoute;
