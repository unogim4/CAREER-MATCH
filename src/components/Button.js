import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  display: inline-block;
  background-color: ${props => props.secondary ? '#ccc' : props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
  transition: background-color 0.3s;
  margin: ${props => props.margin || '0'};
  
  &:hover {
    background-color: ${props => props.secondary ? '#bbb' : props.theme.colors.primaryDark};
  }
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const Button = ({ children, onClick, secondary, margin, type = "button" }) => {
  return (
    <StyledButton 
      onClick={onClick} 
      secondary={secondary}
      margin={margin}
      type={type}
    >
      {children}
    </StyledButton>
  );
};

export const ButtonGroup = ({ children }) => {
  return <ButtonContainer>{children}</ButtonContainer>;
};

export default Button;