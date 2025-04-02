import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FormContainer from '../components/FormContainer';
import Button, { ButtonGroup } from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import DevTypeSelector from '../components/DevTypeSelector';
import SkillTag, { SkillTagContainer } from '../components/SkillTag';
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

const TechOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const TechOption = styled.label`
  margin-right: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  
  input {
    margin-right: 5px;
  }
`;

// 프론트엔드 기술 스택 옵션
const frontendOptions = {
  basic: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript'],
  frameworks: ['React', 'Vue.js', 'Angular', 'jQuery', 'Svelte', 'Next.js'],
  cssFrameworks: ['Bootstrap', 'Tailwind CSS', 'SASS/SCSS', 'styled-components', 'Material UI'],
  stateManagement: ['Redux', 'Context API', 'MobX', 'Recoil', 'Zustand'],
  buildTools: ['Webpack', 'Vite', 'Babel', 'ESLint'],
  others: ['REST API', 'GraphQL', 'Jest', 'Testing Library', 'Cypress']
};

// 백엔드 기술 스택 옵션
const backendOptions = {
  languages: ['JavaScript (Node.js)', 'Python', 'Java', 'PHP', 'C#', 'Go', 'Ruby'],
  frameworks: ['Express.js', 'Django', 'Spring Boot', 'Flask', 'Laravel', 'ASP.NET Core', 'NestJS', 'FastAPI'],
  databases: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'SQL Server', 'Oracle'],
  orm: ['Sequelize', 'Mongoose', 'Hibernate', 'SQLAlchemy', 'Prisma'],
  api: ['RESTful API', 'GraphQL', 'JWT', 'OAuth2.0', 'Passport.js'],
  devops: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'CI/CD']
};

const SkillsForm = () => {
  const navigate = useNavigate();
  const { devType, setDevType, selectedSkills, setSelectedSkills } = useContext(UserContext);
  const [otherSkill, setOtherSkill] = useState('');
  const [errors, setErrors] = useState({});

  const handleDevTypeSelect = (type) => {
    setDevType(type);
    // 개발자 유형이 변경되면 선택된 기술 스택 초기화
    setSelectedSkills([]);
  };

  const handleSkillCheck = (e) => {
    const { value, checked } = e.target;
    
    if (checked) {
      // 중복 체크 방지
      if (!selectedSkills.find(item => item.skill === value)) {
        setSelectedSkills([...selectedSkills, { skill: value, type: devType }]);
      }
    } else {
      setSelectedSkills(selectedSkills.filter(item => item.skill !== value));
    }
  };

  const handleAddOtherSkill = () => {
    if (otherSkill.trim()) {
      const skills = otherSkill.split(',').map(skill => skill.trim());
      
      const newSkills = [];
      skills.forEach(skill => {
        if (skill && !selectedSkills.find(item => item.skill === skill)) {
          newSkills.push({ skill, type: devType });
        }
      });
      
      setSelectedSkills([...selectedSkills, ...newSkills]);
      setOtherSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(item => item.skill !== skillToRemove));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!devType) newErrors.devType = '개발자 유형을 선택해주세요.';
    if (selectedSkills.length === 0) newErrors.skills = '최소 한 개 이상의 기술 스택을 선택해주세요.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/loading');
    }
  };

  const renderSkillOptions = (category, options) => (
    <FormGroup>
      <Label>{category}</Label>
      <TechOptions>
        {options.map((skill, index) => (
          <TechOption key={index}>
            <input 
              type="checkbox" 
              value={skill} 
              checked={selectedSkills.some(item => item.skill === skill)}
              onChange={handleSkillCheck} 
            />
            {skill}
          </TechOption>
        ))}
      </TechOptions>
    </FormGroup>
  );

  return (
    <>
      <ProgressBar currentStep={2} />
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <Section>
            <SectionTitle>개발자 유형</SectionTitle>
            <DevTypeSelector 
              selectedType={devType} 
              onSelectType={handleDevTypeSelect} 
            />
            {errors.devType && <p style={{color: 'red', fontSize: '14px'}}>{errors.devType}</p>}
          </Section>
          
          {devType === 'frontend' && (
            <Section>
              <SectionTitle>프론트엔드 기술 스택</SectionTitle>
              {renderSkillOptions('기본 기술', frontendOptions.basic)}
              {renderSkillOptions('프레임워크/라이브러리', frontendOptions.frameworks)}
              {renderSkillOptions('CSS 프레임워크/전처리기', frontendOptions.cssFrameworks)}
              {renderSkillOptions('상태 관리', frontendOptions.stateManagement)}
              {renderSkillOptions('빌드 도구', frontendOptions.buildTools)}
              {renderSkillOptions('기타 기술', frontendOptions.others)}
              
              <FormGroup>
                <Label htmlFor="frontend-other">추가 프론트엔드 기술</Label>
                <div style={{ display: 'flex' }}>
                  <Input 
                    type="text" 
                    id="frontend-other" 
                    placeholder="추가 기술을 입력하세요 (쉼표로 구분)" 
                    value={otherSkill}
                    onChange={(e) => setOtherSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddOtherSkill();
                      }
                    }}
                  />
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddOtherSkill();
                    }} 
                    style={{ marginLeft: '10px' }}
                  >
                    추가
                  </Button>
                </div>
              </FormGroup>
              
              <SkillTagContainer>
                {selectedSkills.map((item, index) => (
                  <SkillTag 
                    key={index} 
                    skill={item.skill} 
                    onRemove={handleRemoveSkill} 
                  />
                ))}
              </SkillTagContainer>
              {errors.skills && <p style={{color: 'red', fontSize: '14px'}}>{errors.skills}</p>}
            </Section>
          )}
          
          {devType === 'backend' && (
            <Section>
              <SectionTitle>백엔드 기술 스택</SectionTitle>
              {renderSkillOptions('프로그래밍 언어', backendOptions.languages)}
              {renderSkillOptions('프레임워크/라이브러리', backendOptions.frameworks)}
              {renderSkillOptions('데이터베이스', backendOptions.databases)}
              {renderSkillOptions('ORM/ODM', backendOptions.orm)}
              {renderSkillOptions('API/인증', backendOptions.api)}
              {renderSkillOptions('클라우드/DevOps', backendOptions.devops)}
              
              <FormGroup>
                <Label htmlFor="backend-other">추가 백엔드 기술</Label>
                <div style={{ display: 'flex' }}>
                  <Input 
                    type="text" 
                    id="backend-other" 
                    placeholder="추가 기술을 입력하세요 (쉼표로 구분)" 
                    value={otherSkill}
                    onChange={(e) => setOtherSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddOtherSkill();
                      }
                    }}
                  />
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddOtherSkill();
                    }} 
                    style={{ marginLeft: '10px' }}
                  >
                    추가
                  </Button>
                </div>
              </FormGroup>
              
              <SkillTagContainer>
                {selectedSkills.map((item, index) => (
                  <SkillTag 
                    key={index} 
                    skill={item.skill} 
                    onRemove={handleRemoveSkill} 
                  />
                ))}
              </SkillTagContainer>
              {errors.skills && <p style={{color: 'red', fontSize: '14px'}}>{errors.skills}</p>}
            </Section>
          )}
          
          <ButtonGroup>
            <Button 
              secondary 
              margin="0 10px 0 0"
              onClick={() => navigate('/')}
            >
              이전: 이력서 작성
            </Button>
            <Button type="submit">분석 및 결과 보기</Button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </>
  );
};

export default SkillsForm;