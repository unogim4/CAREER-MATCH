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

    return () =>