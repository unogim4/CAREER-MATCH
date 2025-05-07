import React from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const ProgressBarStyled = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ProgressStep = styled.div`
  position: relative;
  text-align: center;
  width: 33%;
  
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #ddd;
    z-index: -1;
  }
  
  &:first-child::before {
    left: 50%;
  }
  
  &:last-child::before {
    right: 50%;
  }
`;

const StepCircle = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.gray};
  color: white;
  line-height: 30px;
  text-align: center;
  font-weight: bold;
`;

const StepLabel = styled.span`
  display: block;
  margin-top: 5px;
  font-size: 14px;
`;

const ProgressBar = ({ currentStep }) => {
  return (
    <ProgressContainer>
      <ProgressBarStyled>
        <ProgressStep>
          <StepCircle active={currentStep >= 1}>1</StepCircle>
          <StepLabel>이력서 작성</StepLabel>
        </ProgressStep>
        <ProgressStep>
          <StepCircle active={currentStep >= 2}>2</StepCircle>
          <StepLabel>기술 스택 선택</StepLabel>
        </ProgressStep>
        <ProgressStep>
          <StepCircle active={currentStep >= 3}>3</StepCircle>
          <StepLabel>결과 분석</StepLabel>
        </ProgressStep>
      </ProgressBarStyled>
    </ProgressContainer>
  );
};

export default ProgressBar;