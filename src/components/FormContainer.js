import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: ${props => props.theme.colors.white};
  padding: 30px;
  border-radius: ${props => props.theme.borders.radius};
  box-shadow: ${props => props.theme.shadows.small};
  margin-bottom: 30px;
`;

const FormContainer = ({ children }) => {
  return <Container>{children}</Container>;
};

export default FormContainer;