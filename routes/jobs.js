// routes/jobs.js - 채용공고 추천 관련 라우트

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
require('dotenv').config();

// OpenAI API 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * 채용공고 추천 API
 * GET /api/jobs/recommendations
 * Query parameters:
 *  - devType: 개발자 유형 (frontend/backend)
 *  - skills: 사용자 기술 배열 (JSON 문자열)
 *  - userInfo: 사용자 정보 (JSON 문자열, 선택적)
 */
router.get('/recommendations', async (req, res) => {
  try {
    const { devType, skills, userInfo: userInfoJson } = req.query;
    
    if (!devType) {
      return res.status(400).json({ message: '개발자 유형이 필요합니다.' });
    }
    
    let userSkills = [];
    if (skills) {
      try {
        userSkills = JSON.parse(skills);
      } catch (e) {
        return res.status(400).json({ message: '잘못된 스킬 형식입니다.' });
      }
    }
    
    let userInfo = {};
    if (userInfoJson) {
      try {
        userInfo = JSON.parse(userInfoJson);
      } catch (e) {
        console.warn('사용자 정보 파싱 오류, 기본값 사용:', e);
      }
    }
    
    // 채용 정보 가져오기
    const jobs = await fetchJobsFromDummyData(devType, userSkills);
    
    try {
      // OpenAI API를 통한 분석 결과 생성
      const analysis = await generateAnalysis(userInfo, userSkills, devType);
      const improvement = await generateImprovement(userInfo, userSkills, devType);
      
      // 결과 반환
      res.status(200).json({
        jobs: jobs,
        analysis: analysis,
        improvement: improvement
      });
    } catch (apiError) {
      console.error('API 호출 오류:', apiError);
      // API 호출 실패 시 더미 데이터 사용
      const analysis = devType === 'frontend' ? getFrontendAnalysisDummy() : getBackendAnalysisDummy();
      const improvement = devType === 'frontend' ? getFrontendImprovementDummy() : getBackendImprovementDummy();
      
      res.status(200).json({
        jobs: jobs,
        analysis: analysis,
        improvement: improvement
      });
    }
  } catch (error) {
    console.error('채용 정보 가져오기 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/**
 * OpenAI API를 사용한 기술 스택 분석
 * 
 * @param {Object} userInfo - 사용자 정보
 * @param {Array} userSkills - 사용자 기술 배열
 * @param {string} devType - 개발자 유형 (frontend/backend)
 * @returns {Promise<Object>} - 분석 결과
 */
async function generateAnalysis(userInfo, userSkills, devType) {
  try {
    // 사용자 스킬을 일반 문자열로 변환 
    const skillsStr = userSkills.map(item => item.skill || item).join(', ');
    
    // 사용자 정보 및 스킬 정보를 포함한 프롬프트 구성
    const prompt = `
다음은 ${devType === 'frontend' ? '프론트엔드' : '백엔드'} 개발자의 정보입니다:

- 경력 수준: ${userInfo.career || '정보 없음'}
- 학력: ${userInfo.education || '정보 없음'}
- 전공: ${userInfo.major || '정보 없음'}
- 기술 스택: ${skillsStr || '정보 없음'}

이 개발자의 기술 스택과 경력을 분석하여 다음 정보를 JSON 형식으로 제공해주세요:

1. "strengths": 보유 기술 강점 분석 (각 항목은 skill과 description 포함)
2. "market": 산업 수요 대비 현황 (각 항목은 skill, level, description 포함, level은 'missing' 또는 'weak')
3. "careerAnalysis": 경력 수준 분석 (문자열)

응답은 다음 JSON 형식과 일치해야 합니다:

{
  "strengths": [
    {
      "skill": "기술명",
      "description": "기술 설명 및 강점"
    }
  ],
  "market": [
    {
      "skill": "기술명",
      "level": "missing 또는 weak",
      "description": "기술 설명 및 시장 현황"
    }
  ],
  "careerAnalysis": "경력 분석 텍스트"
}
`;

    // API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // 또는 원하는 모델
      messages: [
        { 
          role: "system", 
          content: "당신은 소프트웨어 개발 경력 및 기술 스택 분석 전문가입니다. 개발자의 기술과 경력을 분석하여 맞춤형 피드백을 제공합니다." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
    });

    // 응답 파싱
    const analysisText = completion.choices[0].message.content;
    try {
      return JSON.parse(analysisText);
    } catch (parseError) {
      console.error('API 응답 파싱 오류:', parseError);
      return devType === 'frontend' ? getFrontendAnalysisDummy() : getBackendAnalysisDummy();
    }
  } catch (error) {
    console.error('분석 생성 오류:', error);
    return devType === 'frontend' ? getFrontendAnalysisDummy() : getBackendAnalysisDummy();
  }
}

/**
 * OpenAI API를 사용한 개발 로드맵 생성
 * 
 * @param {Object} userInfo - 사용자 정보
 * @param {Array} userSkills - 사용자 기술 배열
 * @param {string} devType - 개발자 유형 (frontend/backend)
 * @returns {Promise<Object>} - 개선 제안
 */
async function generateImprovement(userInfo, userSkills, devType) {
  try {
    // 사용자 스킬을 일반 문자열로 변환
    const skillsStr = userSkills.map(item => item.skill || item).join(', ');
    
    // 사용자 정보 및 스킬 정보를 포함한 프롬프트 구성
    const prompt = `
다음은 ${devType === 'frontend' ? '프론트엔드' : '백엔드'} 개발자의 정보입니다:

- 경력 수준: ${userInfo.career || '정보 없음'}
- 학력: ${userInfo.education || '정보 없음'}
- 전공: ${userInfo.major || '정보 없음'}
- 기술 스택: ${skillsStr || '정보 없음'}

이 개발자의 경력을 발전시키기 위한 학습 로드맵을 JSON 형식으로 제공해주세요:

1. "prioritySkills": 추천 학습 기술 (문자열)
2. "roadmap": 단계별 학습 계획 (각 항목은 title과 description 포함)

응답은 다음 JSON 형식과 일치해야 합니다:

{
  "prioritySkills": "추천 학습 기술 목록 (쉼표로 구분)",
  "roadmap": [
    {
      "title": "학습 단계 제목",
      "description": "단계 설명"
    }
  ]
}
`;

    // API 호출
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // 또는 원하는 모델
      messages: [
        { 
          role: "system", 
          content: "당신은 소프트웨어 개발 경력 코치입니다. 개발자의 현재 기술 스택을 분석하여 경력 성장을 위한 학습 로드맵을 제공합니다." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      temperature: 0.7,
    });

    // 응답 파싱
    const improvementText = completion.choices[0].message.content;
    try {
      return JSON.parse(improvementText);
    } catch (parseError) {
      console.error('API 응답 파싱 오류:', parseError);
      return devType === 'frontend' ? getFrontendImprovementDummy() : getBackendImprovementDummy();
    }
  } catch (error) {
    console.error('개선 제안 생성 오류:', error);
    return devType === 'frontend' ? getFrontendImprovementDummy() : getBackendImprovementDummy();
  }
}

/**
 * 더미 데이터 파일에서 채용 정보 가져오기
 * 
 * @param {string} devType - 개발자 유형
 * @param {Array} userSkills - 사용자 스킬 목록
 * @returns {Promise<Array>} - 채용 정보 배열
 */
async function fetchJobsFromDummyData(devType, userSkills) {
  try {
    // 더미 데이터 파일 읽기
    const dataPath = path.join(__dirname, '../data/dummy-job-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const allJobs = JSON.parse(rawData).jobs;
    
    // 사용자 스킬을 일반 문자열 배열로 변환
    const userSkillsArray = userSkills.map(item => typeof item === 'string' ? item : item.skill);
    
    // 개발자 유형별 필터링
    let filteredJobs = [];
    
    if (devType === 'frontend') {
      // 프론트엔드 관련 직무 필터링
      filteredJobs = allJobs.filter(job => 
        job.position.includes('프론트엔드') || 
        job.position.includes('Front') ||
        job.position.includes('웹') ||
        job.position.includes('React') ||
        job.position.includes('UI') ||
        (job.skills && job.skills.some(skill => 
          ['React', 'Vue', 'Angular', 'JavaScript', 'HTML', 'CSS', 'TypeScript'].includes(skill)
        ))
      );
    } else if (devType === 'backend') {
      // 백엔드 관련 직무 필터링
      filteredJobs = allJobs.filter(job => 
        job.position.includes('백엔드') || 
        job.position.includes('Back') ||
        job.position.includes('서버') ||
        job.position.includes('Java') ||
        job.position.includes('Python') ||
        job.position.includes('Node') ||
        (job.skills && job.skills.some(skill => 
          ['Java', 'Spring', 'Python', 'Django', 'Node.js', 'Express', 'PHP', 'Laravel', 'MySQL', 'MongoDB'].includes(skill)
        ))
      );
    } else {
      // 기타 개발 직무
      filteredJobs = allJobs;
    }
    
    // 사용자 스킬 매칭 점수 계산
    filteredJobs = filteredJobs.map(job => {
      // 매칭된 스킬 찾기
      const matchedSkills = userSkillsArray.filter(skill => 
        job.skills && job.skills.includes(skill)
      );
      
      // 매칭 점수 계산 (0-100)
      let matchScore = 0;
      if (job.skills && job.skills.length > 0 && matchedSkills.length > 0) {
        matchScore = Math.round((matchedSkills.length / job.skills.length) * 100);
        if (matchScore > 100) matchScore = 100; // 최대 100점
      }
      
      return {
        ...job,
        matchScore,
        matchedSkills
      };
    });
    
    // 매칭 점수 기준으로 정렬
    filteredJobs.sort((a, b) => b.matchScore - a.matchScore);
    
    return filteredJobs;
  } catch (error) {
    console.error('더미 데이터 로드 오류:', error);
    // 에러 발생 시 기존 더미 데이터 반환
    return devType === 'frontend' ? getFrontendJobsDummy(userSkills) : getBackendJobsDummy(userSkills);
  }
}

// 프론트엔드 분석 더미 데이터 (백업용)
function getFrontendAnalysisDummy() {
  return {
    strengths: [
      { skill: 'JavaScript', description: '가장 기본적이고 필수적인 웹 프론트엔드 기술' },
      { skill: 'React', description: '현재 가장 인기있는 프론트엔드 라이브러리' },
      { skill: 'HTML5/CSS3', description: '웹 개발의 기초 기술' }
    ],
    market: [
      { skill: 'TypeScript', level: 'weak', description: '타입 안정성을 위한 필수 기술로 부상 중' },
      { skill: 'Next.js', level: 'missing', description: 'React 기반 SSR 프레임워크로 인기 급상승' },
      { skill: 'Testing', level: 'weak', description: 'Jest, React Testing Library 등 테스트 도구' }
    ],
    careerAnalysis: "귀하의 경력 수준은 주니어 개발자에서 중급 개발자로 전환하는 시기입니다. React와 같은 프레임워크 경험을 갖추고 있어 기본적인 웹 애플리케이션 개발이 가능하나, TypeScript와 테스팅 같은 고급 기술을 추가하면 더 경쟁력이 있을 것입니다."
  };
}

// 백엔드 분석 더미 데이터 (백업용)
function getBackendAnalysisDummy() {
  return {
    strengths: [
      { skill: 'Node.js/Express', description: '현대적인 백엔드 개발의 인기 스택' },
      { skill: 'MongoDB', description: 'NoSQL 데이터베이스 경험' },
      { skill: 'RESTful API', description: '웹 서비스 개발의 기본' }
    ],
    market: [
      { skill: 'Docker/Kubernetes', level: 'weak', description: '컨테이너화 및 오케스트레이션 필수 기술' },
      { skill: 'GraphQL', level: 'missing', description: 'REST를 보완하는 현대적 API 접근법' },
      { skill: 'TypeScript', level: 'missing', description: '백엔드에서도 타입 안정성이 중요해짐' }
    ],
    careerAnalysis: "귀하의 경력 수준은 기본적인 백엔드 시스템 구현 경험이 있음을 보여줍니다. Node.js와 Express를 활용한 API 개발 경험이 있으나, 클라우드 서비스와 컨테이너화 도구에 대한 심화 지식이 필요한 시점입니다."
  };
}

// 프론트엔드 개선점 더미 데이터 (백업용)
function getFrontendImprovementDummy() {
  return {
    prioritySkills: "TypeScript, Jest/React Testing Library, Next.js",
    roadmap: [
      {
        title: "TypeScript 학습",
        description: "JavaScript 코드에 타입 안정성을 더하는 TypeScript를 학습하세요. React와 함께 사용하면 더 안정적인 코드를 작성할 수 있습니다."
      },
      {
        title: "테스팅 도구 익히기",
        description: "Jest와 React Testing Library를 사용하여 컴포넌트 테스트를 작성하는 방법을 배우세요. 테스트 주도 개발(TDD)은 큰 경쟁력이 됩니다."
      },
      {
        title: "서버 사이드 렌더링 학습",
        description: "Next.js를 사용하여 React 애플리케이션의 SEO와 성능을 향상시키는 방법을 배우세요."
      },
      {
        title: "상태 관리 심화",
        description: "Redux 외에도 Context API, Recoil, Zustand 등 다양한 상태 관리 솔루션을 비교하고 적절한 상황에 맞게 사용하는 방법을 학습하세요."
      }
    ]
  };
}

// 백엔드 개선점 더미 데이터 (백업용)
function getBackendImprovementDummy() {
  return {
    prioritySkills: "Docker, AWS/클라우드 서비스, GraphQL",
    roadmap: [
      {
        title: "Docker 및 컨테이너화 학습",
        description: "Docker를 사용하여 애플리케이션을 컨테이너화하고 배포하는 방법을 배우세요. 이는 현대 백엔드 개발의 필수 기술입니다."
      },
      {
        title: "클라우드 서비스 심화",
        description: "AWS, Azure 또는 GCP와 같은 클라우드 플랫폼에서 서버리스 아키텍처와 관리형 서비스를 활용하는 방법을 배우세요."
      },
      {
        title: "GraphQL API 개발",
        description: "RESTful API를 보완하는 GraphQL을 학습하여 클라이언트가 필요한 데이터만 정확히 요청할 수 있는 유연한 API를 개발하세요."
      },
      {
        title: "TypeScript로 백엔드 개발",
        description: "Node.js 백엔드에 TypeScript를 적용하여 타입 안정성을 높이고 코드 품질을 향상시키는 방법을 배우세요."
      }
    ]
  };
}

// 백업용 프론트엔드 더미 데이터
function getFrontendJobsDummy(userSkills) {
  const frontendJobs = [
    {
      id: 101,
      title: '시니어 프론트엔드 개발자',
      company: '테크스타트(주)',
      location: '서울 강남구',
      experienceRequired: '3-5년',
      skills: ['JavaScript', 'React', 'TypeScript', 'HTML5', 'CSS3', 'Redux', 'Webpack'],
      salary: '6000만원 ~ 8000만원',
      matchScore: 92,
      matchedSkills: Array.isArray(userSkills) ? userSkills.filter(skill => 
        typeof skill === 'string' 
          ? ['JavaScript', 'React', 'HTML5', 'CSS3', 'Redux', 'Webpack', 'TypeScript'].includes(skill)
          : ['JavaScript', 'React', 'HTML5', 'CSS3', 'Redux', 'Webpack', 'TypeScript'].includes(skill.skill)
      ) : [],
      url: 'https://example.com/job/1'
    },
    {
      id: 102,
      title: 'React 개발자',
      company: '이노베이션랩(주)',
      location: '서울 서초구',
      experienceRequired: '1-3년',
      skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'styled-components', 'Next.js'],
      salary: '4500만원 ~ 6000만원',
      matchScore: 85,
      matchedSkills: Array.isArray(userSkills) ? userSkills.filter(skill => 
        typeof skill === 'string'
          ? ['React', 'JavaScript', 'Redux', 'styled-components', 'Next.js', 'TypeScript'].includes(skill)
          : ['React', 'JavaScript', 'Redux', 'styled-components', 'Next.js', 'TypeScript'].includes(skill.skill)
      ) : [],
      url: 'https://example.com/job/2'
    },
    {
      id: 103,
      title: 'UI/UX 엔지니어',
      company: '디자인테크(주)',
      location: '서울 성동구',
      experienceRequired: '신입~3년',
      skills: ['HTML5', 'CSS3', 'JavaScript', 'Figma', 'SASS/SCSS', 'Responsive Design'],
      salary: '3500만원 ~ 5000만원',
      matchScore: 80,
      matchedSkills: Array.isArray(userSkills) ? userSkills.filter(skill => 
        typeof skill === 'string'
          ? ['HTML5', 'CSS3', 'JavaScript', 'SASS/SCSS'].includes(skill)
          : ['HTML5', 'CSS3', 'JavaScript', 'SASS/SCSS'].includes(skill.skill)
      ) : [],
      url: 'https://example.com/job/3'
    }
  ];
  
  return frontendJobs;
}

// 백업용 백엔드 더미 데이터
function getBackendJobsDummy(userSkills) {
  const backendJobs = [
    {
      id: 201,
      title: '백엔드 개발자',
      company: '클라우드서비스(주)',
      location: '서울 강남구',
      experienceRequired: '3-5년',
      skills: ['Node.js', 'Express.js', 'MongoDB', 'AWS', 'RESTful API', 'Docker'],
      salary: '6000만원 ~ 8000만원',
      matchScore: 94,
      matchedSkills: Array.isArray(userSkills) ? userSkills.filter(skill => 
        typeof skill === 'string'
          ? ['Node.js', 'Express.js', 'MongoDB', 'AWS', 'RESTful API', 'Docker'].includes(skill)
          : ['Node.js', 'Express.js', 'MongoDB', 'AWS', 'RESTful API', 'Docker'].includes(skill.skill)
      ) : [],
      url: 'https://example.com/job/4'
    },
    {
      id: 202,
      title: 'Python 백엔드 개발자',
      company: '데이터솔루션(주)',
      location: '서울 영등포구',
      experienceRequired: '1-3년',
      skills: ['Python', 'Django', 'PostgreSQL', 'RESTful API', 'Docker', 'AWS'],
      salary: '4500만원 ~ 6000만원',
      matchScore: 88,
      matchedSkills: Array.isArray(userSkills) ? userSkills.filter(skill => 
        typeof skill === 'string'
          ? ['Python', 'Django', 'PostgreSQL', 'RESTful API', 'Docker', 'AWS'].includes(skill)
          : ['Python', 'Django', 'PostgreSQL', 'RESTful API', 'Docker', 'AWS'].includes(skill.skill)
      ) : [],
      url: 'https://example.com/job/5'
    },
    {
      id: 203,
      title: 'Java 백엔드 개발자',
      company: '엔터프라이즈시스템(주)',
      location: '서울 마포구',
      experienceRequired: '3-5년',
      skills: ['Java', 'Spring Boot', 'MySQL', 'JPA', 'RESTful API'],
      salary: '5500만원 ~ 7500만원',
      matchScore: 78,
      matchedSkills: Array.isArray(userSkills) ? userSkills.filter(skill => 
        typeof skill === 'string'
          ? ['Java', 'Spring Boot', 'MySQL', 'RESTful API'].includes(skill)
          : ['Java', 'Spring Boot', 'MySQL', 'RESTful API'].includes(skill.skill)
      ) : [],
      url: 'https://example.com/job/6'
    }
  ];
  
  return backendJobs;
}

module.exports = router;