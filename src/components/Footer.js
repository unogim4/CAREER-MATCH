import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  text-align: center;
  margin-top: 30px;
  color: ${props => props.theme.colors.darkGray};
  font-size: 14px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <p>&copy; 2025 커리어매치. 모든 권리 보유.</p>
    </FooterContainer>
  );
};

export default Footer;