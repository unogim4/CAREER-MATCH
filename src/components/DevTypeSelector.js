import React from 'react';
import styled from 'styled-components';

const TypeContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TypeButton = styled.div`
  padding: 15px 25px;
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
  width: 45%;
  background-color: ${props => props.selected ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.selected ? props.theme.colors.white : 'inherit'};
  
  &:hover {
    background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.lightBlue};
  }
  
  @media (max-width: 768px) {
    width: 80%;
    margin-bottom: 10px;
  }
`;

const DevTypeSelector = ({ selectedType, onSelectType }) => {
  return (
    <TypeContainer>
      <TypeButton 
        selected={selectedType === 'frontend'} 
        onClick={() => onSelectType('frontend')}
      >
        프론트엔드 개발자
      </TypeButton>
      <TypeButton 
        selected={selectedType === 'backend'} 
        onClick={() => onSelectType('backend')}
      >
        백엔드 개발자
      </TypeButton>
    </TypeContainer>
  );
};

export default DevTypeSelector;