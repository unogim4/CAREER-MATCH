import React, { useState, useEffect } from 'react';
import { saveUserProfile, getJobRecommendations } from '../api';
import './ResumeForm.css';

const ResumeForm = () => {
  // 상태 관리
  const [currentStep, setCurrentStep] = useState(1); // 1: 이력서, 2: 기술 스택, 3: 결과
  const [isLoading, setIsLoading] = useState(false);
  
  // 사용자 기본 정보 상태
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    github: '',
    portfolio: '',
    education: '',
    major: '',
    career: '',
    introduction: '',
    devType: '' // 'frontend' 또는 'backend'
  });
  
  // 선택된 기술 스택 상태
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // 분석 결과 상태
  const [analysisResults, setAnalysisResults] = useState({
    recommendations: [],
    analysis: null,
    improvement: null
  });

  // 현재 활성화된 탭 상태
  const [activeTab, setActiveTab] = useState('recommendations');
  
  // 입력 필드 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 개발자 유형 선택 처리
  const handleDevTypeSelect = (type) => {
    setUserInfo(prev => ({
      ...prev,
      devType: type
    }));
  };
  
  // 기술 스택 선택 처리
  const handleSkillSelect = (e) => {
    const { value, checked } = e.target;
    const type = e.target.name.includes('frontend') ? 'frontend' : 'backend';
    
    if (checked) {
      // 기술 추가
      setSelectedSkills(prev => [
        ...prev,
        { skill: value, type }
      ]);
    } else {
      // 기술 제거
      setSelectedSkills(prev => 
        prev.filter(item => item.skill !== value)
      );
    }
  };
  
  // 추가 기술 입력 처리
  const handleAddCustomSkill = (skillText, type) => {
    const skills = skillText.split(',').map(s => s.trim()).filter(s => s);
    
    if (skills.length > 0) {
      const newSkills = skills.map(skill => ({
        skill,
        type
      }));
      
      setSelectedSkills(prev => [...prev, ...newSkills]);
    }
  };
  
  // 다음 단계로 이동
  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  // 이전 단계로 이동
  const goToPrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // 이력서 제출 및 분석 요청
  const handleAnalyzeResume = async () => {
    try {
      setIsLoading(true);
      
      // 1. 이력서 정보 저장하기
      await saveUserProfile(userInfo, selectedSkills);
      
      // 2. 추천 정보 가져오기
      const recommendations = await getJobRecommendations(userInfo.devType, selectedSkills, userInfo);
      
      // 3. 결과 세팅 (실제 구현에서는 API 응답에서 받아옴)
      setAnalysisResults({
        recommendations: recommendations.jobs || [],
        analysis: recommendations.analysis || null,
        improvement: recommendations.improvement || null
      });
      
      // 4. 결과 화면으로 이동
      goToNextStep();
    } catch (error) {
      alert(`분석 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 처음부터 다시 시작하기
  const handleRestart = () => {
    setCurrentStep(1);
    setUserInfo({
      name: '',
      email: '',
      phone: '',
      github: '',
      portfolio: '',
      education: '',
      major: '',
      career: '',
      introduction: '',
      devType: ''
    });
    setSelectedSkills([]);
    setAnalysisResults({
      recommendations: [],
      analysis: null,
      improvement: null
    });
  };
  
  // 이력서 작성 단계 유효성 검사
  const validateResumeStep = () => {
    if (!userInfo.name || !userInfo.email) {
      alert('이름과 이메일은 필수 입력 항목입니다.');
      return false;
    }
    return true;
  };
  
  // 기술 스택 단계 유효성 검사
  const validateSkillsStep = () => {
    if (!userInfo.devType) {
      alert('개발자 유형을 선택해주세요.');
      return false;
    }
    
    if (selectedSkills.length === 0) {
      alert('최소 한 개 이상의 기술 스택을 선택해주세요.');
      return false;
    }
    
    return true;
  };

  // 탭 전환 기능
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // 탭 클릭 이벤트 설정
  useEffect(() => {
    const handleTabClick = (e) => {
      if (e.target.classList.contains('tab')) {
        const tabId = e.target.getAttribute('data-tab');
        handleTabChange(tabId);
      }
    };

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', handleTabClick);
    });

    return () => {
      tabs.forEach(tab => {
        tab.removeEventListener('click', handleTabClick);
      });
    };
  }, [currentStep]);
  
  // 이력서 작성 폼 단계 렌더링
  const renderResumeForm = () => (
    <div className="form-container">
      <form onSubmit={(e) => {
        e.preventDefault();
        if (validateResumeStep()) goToNextStep();
      }}>
        {/* 기본 정보 섹션 */}
        <div className="section">
          <h2 className="section-title">기본 정보</h2>
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={userInfo.name}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={userInfo.email}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">연락처</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={userInfo.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="github">GitHub 프로필</label>
            <input 
              type="url" 
              id="github" 
              name="github" 
              placeholder="https://github.com/username"
              value={userInfo.github}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="portfolio">포트폴리오/개인 웹사이트</label>
            <input 
              type="url" 
              id="portfolio" 
              name="portfolio" 
              placeholder="https://yourwebsite.com"
              value={userInfo.portfolio}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        {/* 교육 및 경력 섹션 */}
        <div className="section">
          <h2 className="section-title">교육 및 경력</h2>
          <div className="form-group">
            <label htmlFor="education">최종 학력</label>
            <select 
              id="education" 
              name="education"
              value={userInfo.education}
              onChange={handleInputChange}
            >
              <option value="">선택하세요</option>
              <option value="고등학교 졸업">고등학교 졸업</option>
              <option value="전문대 졸업/재학">전문대 졸업/재학</option>
              <option value="대학교 졸업/재학">대학교 졸업/재학</option>
              <option value="석사 졸업/재학">석사 졸업/재학</option>
              <option value="박사 졸업/재학">박사 졸업/재학</option>
              <option value="부트캠프 수료">부트캠프 수료</option>
              <option value="독학">독학</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="major">전공</label>
            <input 
              type="text" 
              id="major" 
              name="major" 
              placeholder="예: 컴퓨터공학"
              value={userInfo.major}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="career">경력 수준</label>
            <select 
              id="career" 
              name="career"
              value={userInfo.career}
              onChange={handleInputChange}
            >
              <option value="">선택하세요</option>
              <option value="신입">신입</option>
              <option value="1년 미만">1년 미만</option>
              <option value="1-3년">1-3년</option>
              <option value="3-5년">3-5년</option>
              <option value="5-10년">5-10년</option>
              <option value="10년 이상">10년 이상</option>
            </select>
          </div>
        </div>
        
        {/* 자기소개 섹션 */}
        <div className="section">
          <h2 className="section-title">자기소개</h2>
          <div className="form-group">
            <label htmlFor="introduction">간단한 자기소개</label>
            <textarea 
              id="introduction" 
              name="introduction" 
              placeholder="개발자로서의 경험, 관심사, 목표 등을 작성해주세요."
              value={userInfo.introduction}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
        
        {/* 다음 버튼 */}
        <div className="button-container">
          <button type="submit" className="button">다음: 기술 스택 선택</button>
        </div>
      </form>
    </div>
  );
  
  // 기술 스택 선택 폼 렌더링
  const renderSkillsForm = () => (
    <div className="form-container">
      <form onSubmit={(e) => {
        e.preventDefault();
        if (validateSkillsStep()) handleAnalyzeResume();
      }}>
        {/* 개발자 유형 선택 섹션 */}
        <div className="section">
          <h2 className="section-title">개발자 유형</h2>
          <div className="dev-type-container">
            <div 
              className={`dev-type ${userInfo.devType === 'frontend' ? 'selected' : ''}`}
              onClick={() => handleDevTypeSelect('frontend')}
            >
              프론트엔드 개발자
            </div>
            <div 
              className={`dev-type ${userInfo.devType === 'backend' ? 'selected' : ''}`}
              onClick={() => handleDevTypeSelect('backend')}
            >
              백엔드 개발자
            </div>
          </div>
        </div>
        
        {/* 프론트엔드 기술 스택 섹션 */}
        {userInfo.devType === 'frontend' && (
          <div className="section" id="frontend-section">
            <h2 className="section-title">프론트엔드 기술 스택</h2>
            <div className="form-group">
              <label>기본 기술</label>
              <div className="tech-options">
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="HTML5"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'HTML5')}
                  /> 
                  HTML5
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="CSS3"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'CSS3')}
                  /> 
                  CSS3
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="JavaScript"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'JavaScript')}
                  /> 
                  JavaScript
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="TypeScript"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'TypeScript')}
                  /> 
                  TypeScript
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>프레임워크/라이브러리</label>
              <div className="tech-options">
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="React"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'React')}
                  /> 
                  React
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="Vue.js"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Vue.js')}
                  /> 
                  Vue.js
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="Angular"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Angular')}
                  /> 
                  Angular
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="Next.js"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Next.js')}
                  /> 
                  Next.js
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>CSS 프레임워크/라이브러리</label>
              <div className="tech-options">
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="Bootstrap"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Bootstrap')}
                  /> 
                  Bootstrap
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="Tailwind CSS"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Tailwind CSS')}
                  /> 
                  Tailwind CSS
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="SASS/SCSS"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'SASS/SCSS')}
                  /> 
                  SASS/SCSS
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="frontend-skill" 
                    value="styled-components"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'styled-components')}
                  /> 
                  styled-components
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="frontend-other">추가 프론트엔드 기술</label>
              <input 
                type="text" 
                id="frontend-other" 
                placeholder="추가 기술을 입력하세요 (쉼표로 구분)"
              />
              <button 
                type="button" 
                className="button" 
                style={{ marginTop: '10px' }}
                onClick={() => {
                  const input = document.getElementById('frontend-other');
                  handleAddCustomSkill(input.value, 'frontend');
                  input.value = '';
                }}
              >
                추가
              </button>
            </div>
            
            <div className="skill-tag-container">
              {selectedSkills
                .filter(skill => skill.type === 'frontend')
                .map((skill, index) => (
                  <div key={index} className="skill-tag">
                    {skill.skill}
                    <span 
                      className="remove"
                      onClick={() => setSelectedSkills(prev => 
                        prev.filter(s => s !== skill)
                      )}
                    >
                      &times;
                    </span>
                  </div>
                ))
              }
            </div>
          </div>
        )}
        
        {/* 백엔드 기술 스택 섹션 */}
        {userInfo.devType === 'backend' && (
          <div className="section" id="backend-section">
            <h2 className="section-title">백엔드 기술 스택</h2>
            <div className="form-group">
              <label>프로그래밍 언어</label>
              <div className="tech-options">
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="JavaScript (Node.js)"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'JavaScript (Node.js)')}
                  /> 
                  JavaScript (Node.js)
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="Python"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Python')}
                  /> 
                  Python
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="Java"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Java')}
                  /> 
                  Java
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="Go"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Go')}
                  /> 
                  Go
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>프레임워크/라이브러리</label>
              <div className="tech-options">
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="Express.js"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Express.js')}
                  /> 
                  Express.js
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="Django"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Django')}
                  /> 
                  Django
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="Spring Boot"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Spring Boot')}
                  /> 
                  Spring Boot
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="Flask"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Flask')}
                  /> 
                  Flask
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>데이터베이스</label>
              <div className="tech-options">
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="MySQL"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'MySQL')}
                  /> 
                  MySQL
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="PostgreSQL"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'PostgreSQL')}
                  /> 
                  PostgreSQL
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="MongoDB"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'MongoDB')}
                  /> 
                  MongoDB
                </label>
                <label className="tech-option">
                  <input 
                    type="checkbox" 
                    name="backend-skill" 
                    value="Redis"
                    onChange={handleSkillSelect}
                    checked={selectedSkills.some(s => s.skill === 'Redis')}
                  /> 
                  Redis
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="backend-other">추가 백엔드 기술</label>
              <input 
                type="text" 
                id="backend-other" 
                placeholder="추가 기술을 입력하세요 (쉼표로 구분)"
              />
              <button 
                type="button" 
                className="button" 
                style={{ marginTop: '10px' }}
                onClick={() => {
                  const input = document.getElementById('backend-other');
                  handleAddCustomSkill(input.value, 'backend');
                  input.value = '';
                }}
              >
                추가
              </button>
            </div>
            
            <div className="skill-tag-container">
              {selectedSkills
                .filter(skill => skill.type === 'backend')
                .map((skill, index) => (
                  <div key={index} className="skill-tag">
                    {skill.skill}
                    <span 
                      className="remove"
                      onClick={() => setSelectedSkills(prev => 
                        prev.filter(s => s !== skill)
                      )}
                    >
                      &times;
                    </span>
                  </div>
                ))
              }
            </div>
          </div>
        )}
        
        {/* 버튼 */}
        <div className="button-container">
          <button 
            type="button" 
            className="button" 
            onClick={goToPrevStep}
            style={{ backgroundColor: '#ccc', marginRight: '10px' }}
          >
            이전: 이력서 작성
          </button>
          <button type="submit" className="button">분석 및 결과 보기</button>
        </div>
      </form>
    </div>
  );
  
  // 결과 화면 렌더링
  const renderResultsScreen = () => (
    <div className="results-container">
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`} 
          data-tab="recommendations"
          onClick={() => handleTabChange('recommendations')}
        >
          추천 기업
        </div>
        <div 
          className={`tab ${activeTab === 'analysis' ? 'active' : ''}`} 
          data-tab="analysis"
          onClick={() => handleTabChange('analysis')}
        >
          기술 분석
        </div>
        <div 
          className={`tab ${activeTab === 'improvement' ? 'active' : ''}`} 
          data-tab="improvement"
          onClick={() => handleTabChange('improvement')}
        >
          기술 개선점
        </div>
      </div>
      
      {/* 추천 기업 탭 */}
      <div className={`tab-content ${activeTab === 'recommendations' ? 'active' : ''}`} id="recommendations-tab">
        <div className="summary-box">
          <h3 className="summary-title">매칭 결과 요약</h3>
          <p>총 <span id="match-count">{analysisResults.recommendations.length}</span>개의 기업이 귀하의 프로필과 매칭되었습니다.</p>
          <p>최고 매칭도: <strong><span id="best-match">
            {analysisResults.recommendations.length > 0 
              ? analysisResults.recommendations[0].matchScore 
              : 0}
          </span>%</strong></p>
        </div>
        
        <div id="job-recommendations">
          {analysisResults.recommendations.map((job, index) => (
            <div key={index} className="job-card">
              <span className="job-match">{job.matchScore}% 일치</span>
              <h3 className="job-title">{job.title}</h3>
              <div className="job-company">{job.company}</div>
              <div className="job-details">
                <div className="job-detail"><i className="fa fa-map-marker"></i> {job.location}</div>
                <div className="job-detail"><i className="fa fa-briefcase"></i> {job.experienceRequired}</div>
                <div className="job-detail"><i className="fa fa-money"></i> {job.salary}</div>
              </div>
              <div className="job-skills">
                {job.skills.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex} 
                    className={`job-skill ${job.matchedSkills.includes(skill) ? 'matched-skill' : ''}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <a href={job.url} className="job-link" target="_blank" rel="noopener noreferrer">채용공고 보기</a>
            </div>
          ))}
        </div>
      </div>
      
      {/* 기술 분석 탭 */}
      <div className={`tab-content ${activeTab === 'analysis' ? 'active' : ''}`} id="analysis-tab">
        {analysisResults.analysis && (
          <div className="analysis-section">
            <h3 className="analysis-title">기술 스택 분석</h3>
            
            <div className="skill-analysis">
              <div className="skill-category">
                <h4>보유 기술 강점</h4>
                <ul className="skill-list" id="skill-strengths">
                  {analysisResults.analysis.strengths.map((item, index) => (
                    <li key={index} className="skill-strength">
                      <strong>{item.skill}</strong>: {item.description}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="skill-category">
                <h4>산업 수요 대비 현황</h4>
                <ul className="skill-list" id="skill-market">
                  {analysisResults.analysis.market.map((item, index) => (
                    <li key={index} className={item.level === 'missing' ? 'skill-weakness' : ''}>
                      <strong>{item.skill}</strong>: {item.description} 
                      {item.level === 'missing' ? ' (부재)' : ' (보완 필요)'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="skill-category">
              <h4>경력 수준 분석</h4>
              <p id="career-analysis">{analysisResults.analysis.careerAnalysis}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 기술 개선점 탭 */}
      <div className={`tab-content ${activeTab === 'improvement' ? 'active' : ''}`} id="improvement-tab">
        {analysisResults.improvement && (
          <div className="analysis-section">
            <h3 className="analysis-title">추천 학습 경로</h3>
            
            <div className="skill-gap">
              <div className="skill-suggestion">
                <h4>우선 추천 기술</h4>
                <p id="priority-skills">{analysisResults.improvement.prioritySkills}</p>
              </div>
              
              <div className="road-map">
                {analysisResults.improvement.roadmap.map((item, index) => (
                  <div key={index} className="road-map-item">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 버튼 */}
      <div className="button-container">
        <button 
          type="button" 
          className="button" 
          onClick={handleRestart}
          style={{ backgroundColor: '#ccc', marginRight: '10px' }}
        >
          처음부터 다시
        </button>
        <button 
          type="button" 
          className="button" 
          onClick={() => alert('결과가 저장되었습니다.')}
        >
          결과 저장하기
        </button>
      </div>
    </div>
  );

  // 현재 단계에 따라 다른 화면 렌더링
  return (
    <>
      {/* 진행 단계 표시 */}
      <div className="progress-container">
        <div className="progress-bar">
          <div className={`progress-step ${currentStep === 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span className="step-label">이력서 작성</span>
          </div>
          <div className={`progress-step ${currentStep === 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span className="step-label">기술 스택 선택</span>
          </div>
          <div className={`progress-step ${currentStep === 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span className="step-label">결과 분석</span>
          </div>
        </div>
      </div>
      
      {/* 현재 단계에 따라 다른 화면 표시 */}
      {currentStep === 1 && renderResumeForm()}
      {currentStep === 2 && renderSkillsForm()}
      {currentStep === 3 && renderResultsScreen()}
      
      {/* 로딩 화면 */}
      {isLoading && (
        <div className="form-container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <h3>이력서 분석 중...</h3>
            <p>고객님의 이력서와 기술 스택을 분석하여 최적의 직무와 기업을 매칭하고 있습니다.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ResumeForm;