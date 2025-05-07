import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FormContainer from '../components/FormContainer';
import ProgressBar from '../components/ProgressBar';
import { UserContext } from '../context/UserContext';
import { getJobRecommendations, getSkillAnalysis, getImprovement } from '../api/api';

const LoadingContainer = styled.div`
  text-align: center;
  padding: 30px;
`;

const LoadingSpinner = styled.div`
  border: 5px solid #f3f3f3;
  border-top: 5px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingTitle = styled.h3`
  margin-bottom: 10px;
`;

const LoadingScreen = () => {
  const navigate = useNavigate();
  const { userInfo, devType, selectedSkills, setMatchResults } = useContext(UserContext);

  useEffect(() => {
    // 필수 정보가 없으면 이전 페이지로 리다이렉트
    if (!devType || selectedSkills.length === 0) {
      navigate('/skills');
      return;
    }

    const fetchData = async () => {
      try {
        // API 호출을 병렬로 처리
        const [jobs, analysis, improvement] = await Promise.all([
          // 사용자 정보를 함께 전달하여 맞춤형 분석 요청
          getJobRecommendations(devType, selectedSkills.map(item => item.skill), userInfo),
          getSkillAnalysis(devType, selectedSkills.map(item => item.skill), userInfo.career),
          getImprovement(devType, selectedSkills.map(item => item.skill), userInfo)
        ]);
        
        // 결과를 상태에 저장
        setMatchResults({
          jobs,
          analysis,
          improvement
        });
        
        // 잠시 후 결과 페이지로 이동
        setTimeout(() => {
          navigate('/results');
        }, 1500);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('데이터를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/skills');
      }
    };

    fetchData();
  }, [devType, selectedSkills, userInfo, setMatchResults, navigate]);

  return (
    <>
      <ProgressBar currentStep={3} />
      <FormContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingTitle>이력서 분석 중...</LoadingTitle>
          <p>고객님의 이력서와 기술 스택을 분석하여 최적의 직무와 기업을 매칭하고 있습니다.</p>
        </LoadingContainer>
      </FormContainer>
    </>
  );
};

export default LoadingScreen;