import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext'; // ✅ 로그인 상태 불러오기

const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borders.radius};

  h1 {
    margin-bottom: 10px;
  }
`;

const NavLinks = styled.nav`
  margin-top: 10px;

  a, button {
    color: ${props => props.theme.colors.white};
    margin: 0 10px;
    text-decoration: underline;
    font-weight: bold;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1em;

    &:hover {
      text-decoration: none;
    }
  }
`;

const Header = () => {
  const { currentUser, logout } = useContext(UserContext); // ✅ 로그인 정보 가져오기

  return (
    <HeaderContainer>
      <h1>커리어매치</h1>
      <p>개발자 맞춤형 취업 추천 서비스</p>

      <NavLinks>
        {currentUser ? (
          <>
            <span>{currentUser.email}님</span>
            <button onClick={logout}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </>
        )}
      </NavLinks>
    </HeaderContainer>
  );
};

export default Header;
