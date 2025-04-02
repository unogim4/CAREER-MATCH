import React from 'react';
import styled from 'styled-components';

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

const Header = () => {
  return (
    <HeaderContainer>
      <h1>커리어매치</h1>
      <p>개발자 맞춤형 취업 추천 서비스</p>
    </HeaderContainer>
  );
};

export default Header;
