import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FormContainer from '../components/FormContainer';
import ProgressBar from '../components/ProgressBar';
import TabPanel from '../components/TabPanel';
import JobCard from '../components/JobCard';
import Button, { ButtonGroup } from '../components/Button';
import { UserContext } from '../context/UserContext';

const SummaryBox = styled.div`
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
`;

const SummaryTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.primary};
`;

const AnalysisSection = styled.div`
  margin-bottom: 20px;
`;

const AnalysisTitle = styled.h3`
  font-weight: bold;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.primary};
`;

const SkillAnalysis = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SkillCategory = styled.div`
  width: 48%;
  margin-right: 2%;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 5px;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
  }
`;

const CategoryTitle = styled.h4`
  margin-bottom: 10px;
  color: ${props => props.theme.colors.primary};
`;

const SkillList = styled.ul`
  list-style-type: none;
`;

const SkillItem = styled.li`
  margin-bottom: 5px;
  padding: 5px;
  border-radius: 3px;
  background-color: ${props => props.type === 'strength' ? '#e8f5e9' : props.type === 'weakness' ? '#ffebee' : 'transparent'};
`;

const SkillSuggestion = styled.div`
  background-color: #fff8e1;
  border-left: 3px solid ${props => props.theme.colors.warning};
  padding: 10px;
  margin-bottom: 10px;
`;

const RoadMapItem = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  border-left: 3px solid ${props => props.theme.colors.primary};
  background-color: #f9f9f9;
`;

const RoadMapTitle = styled.h4`
  margin-bottom: 5px;
  color: ${props => props.theme.colors.primary};
`;

const ResultsScreen = () => {
  const navigate = useNavigate();
  const { matchResults, setUserInfo, setDevType, setSelectedSkills, setMatchResults } = useContext(UserContext);

  useEffect(() => {
    // 결과가 없으면 이전 페이지로 리다이렉트
    if (!matchResults) {
      navigate('/loading');
    }
  }, [matchResults, navigate]);

  const handleReset = () => {
    // 모든 상태 초기화
    setUserInfo({
      name: '',
      email: '',
      phone: '',
      github: '',
      portfolio: '',
      education: '',
      major: '',
      career: '',
      introduction: ''
    });
    setDevType('');
    setSelectedSkills([]);
    setMatchResults(null);
    navigate('/');
  };

  const handleSaveResults = () => {
    // 실제 구현에서는 PDF 다운로드 등으로 대체
    alert('분석 결과가 저장되었습니다. (데모 기능)');
  };

  if (!matchResults) {
    return null;
  }

  const { jobs, analysis, improvement } = matchResults;

  // 추천 기업 탭 내용
  const recommendationsTab = (
    <>
      <SummaryBox>
        <SummaryTitle>매칭 결과 요약</SummaryTitle>
        <p>총 <strong>{jobs.length}</strong>개의 기업이 귀하의 프로필과 매칭되었습니다.</p>
        <p>최고 매칭도: <strong>{jobs[0]?.matchScore || 0}%</strong></p>
      </SummaryBox>
      <div>
        {jobs.map((job, index) => (
          <JobCard key={index} job={job} />
        ))}
      </div>
    </>
  );

  // 기술 분석 탭 내용
  const analysisTab = (
    <AnalysisSection>
      <AnalysisTitle>기술 스택 분석</AnalysisTitle>
      <SkillAnalysis>
        <SkillCategory>
          <CategoryTitle>보유 기술 강점</CategoryTitle>
          <SkillList>
            {analysis.strengths.map((item, index) => (
              <SkillItem key={index} type="strength">
                <strong>{item.skill}</strong>: {item.description}
              </SkillItem>
            ))}
          </SkillList>
        </SkillCategory>
        <SkillCategory>
          <CategoryTitle>산업 수요 대비 현황</CategoryTitle>
          <SkillList>
            {analysis.market.map((item, index) => (
              <SkillItem 
                key={index} 
                type={item.level === 'missing' ? 'weakness' : 'neutral'}
              >
                <strong>{item.skill}</strong>: {item.description} {item.level === 'missing' ? '(부재)' : '(보완 필요)'}
              </SkillItem>
            ))}
          </SkillList>
        </SkillCategory>
      </SkillAnalysis>
      <SkillCategory style={{ width: '100%' }}>
        <CategoryTitle>경력 수준 분석</CategoryTitle>
        <p>{analysis.careerAnalysis}</p>
      </SkillCategory>
    </AnalysisSection>
  );

  // 기술 개선점 탭 내용
  const improvementTab = (
    <AnalysisSection>
      <AnalysisTitle>추천 학습 경로</AnalysisTitle>
      <SkillSuggestion>
        <h4>우선 추천 기술</h4>
        <p>{improvement.prioritySkills}</p>
      </SkillSuggestion>
      <div>
        {improvement.roadmap.map((item, index) => (
          <RoadMapItem key={index}>
            <RoadMapTitle>{item.title}</RoadMapTitle>
            <p>{item.description}</p>
          </RoadMapItem>
        ))}
      </div>
    </AnalysisSection>
  );

  const tabs = [
    { label: '추천 기업', content: recommendationsTab },
    { label: '기술 분석', content: analysisTab },
    { label: '기술 개선점', content: improvementTab }
  ];

  return (
    <>
      <ProgressBar currentStep={3} />
      <FormContainer>
        <TabPanel tabs={tabs} />
        <ButtonGroup>
          <Button secondary margin="0 10px 0 0" onClick={handleReset}>
            처음부터 다시
          </Button>
          <Button onClick={handleSaveResults}>
            결과 저장하기
          </Button>
        </ButtonGroup>
      </FormContainer>
    </>
  );
};

export default ResultsScreen;