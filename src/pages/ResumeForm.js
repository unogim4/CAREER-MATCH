import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FormContainer from '../components/FormContainer';
import Button, { ButtonGroup } from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { UserContext } from '../context/UserContext';

const Section = styled.div`
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  margin-bottom: 15px;
  color: ${props => props.theme.colors.primary};
  font-size: 1.2em;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: 4px;
  font-size: 16px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid ${props => props.theme.colors.gray};
  border-radius: 4px;
  font-size: 16px;
  height: 100px;
  resize: vertical;
`;

const ResumeForm = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userInfo.name) newErrors.name = '이름은 필수 입력 항목입니다.';
    if (!userInfo.email) newErrors.email = '이메일은 필수 입력 항목입니다.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/skills');
    }
  };

  return (
    <>
      <ProgressBar currentStep={1} />
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>기본 정보</SectionTitle>
            <FormGroup>
              <Label htmlFor="name">이름</Label>
              <Input 
                type="text" 
                id="name" 
                name="name" 
                value={userInfo.name} 
                onChange={handleChange}
                required
              />
              {errors.name && <p style={{color: 'red', fontSize: '14px'}}>{errors.name}</p>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="email">이메일</Label>
              <Input 
                type="email" 
                id="email" 
                name="email" 
                value={userInfo.email} 
                onChange={handleChange}
                required
              />
              {errors.email && <p style={{color: 'red', fontSize: '14px'}}>{errors.email}</p>}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="phone">연락처</Label>
              <Input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={userInfo.phone} 
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="github">GitHub 프로필</Label>
              <Input 
                type="url" 
                id="github" 
                name="github" 
                placeholder="https://github.com/username" 
                value={userInfo.github} 
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="portfolio">포트폴리오/개인 웹사이트</Label>
              <Input 
                type="url" 
                id="portfolio" 
                name="portfolio" 
                placeholder="https://yourwebsite.com" 
                value={userInfo.portfolio} 
                onChange={handleChange}
              />
            </FormGroup>
          </Section>
          
          <Section>
            <SectionTitle>교육 및 경력</SectionTitle>
            <FormGroup>
              <Label htmlFor="education">최종 학력</Label>
              <Select 
                id="education" 
                name="education" 
                value={userInfo.education} 
                onChange={handleChange}
              >
                <option value="">선택하세요</option>
                <option value="고등학교 졸업">고등학교 졸업</option>
                <option value="전문대 졸업/재학">전문대 졸업/재학</option>
                <option value="대학교 졸업/재학">대학교 졸업/재학</option>
                <option value="석사 졸업/재학">석사 졸업/재학</option>
                <option value="박사 졸업/재학">박사 졸업/재학</option>
                <option value="부트캠프 수료">부트캠프 수료</option>
                <option value="독학">독학</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label htmlFor="major">전공</Label>
              <Input 
                type="text" 
                id="major" 
                name="major" 
                placeholder="예: 컴퓨터공학" 
                value={userInfo.major} 
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="career">경력 수준</Label>
              <Select 
                id="career" 
                name="career" 
                value={userInfo.career} 
                onChange={handleChange}
              >
                <option value="">선택하세요</option>
                <option value="신입">신입</option>
                <option value="1년 미만">1년 미만</option>
                <option value="1-3년">1-3년</option>
                <option value="3-5년">3-5년</option>
                <option value="5-10년">5-10년</option>
                <option value="10년 이상">10년 이상</option>
              </Select>
            </FormGroup>
          </Section>
          
          <Section>
            <SectionTitle>자기소개</SectionTitle>
            <FormGroup>
              <Label htmlFor="introduction">간단한 자기소개</Label>
              <Textarea 
                id="introduction" 
                name="introduction" 
                placeholder="개발자로서의 경험, 관심사, 목표 등을 작성해주세요." 
                value={userInfo.introduction} 
                onChange={handleChange}
              />
            </FormGroup>
          </Section>
          
          <ButtonGroup>
            <Button type="submit">다음: 기술 스택 선택</Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </>
  );
};

export default ResumeForm;