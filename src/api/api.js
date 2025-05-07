import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * 채용 정보 추천 API 호출
 * 
 * @param {string} devType - 개발자 유형 (frontend/backend)
 * @param {Array} skills - 사용자 기술 스택
 * @param {Object} userInfo - 사용자 기본 정보 (선택적)
 * @returns {Promise<Array>} - 채용 정보 배열
 */
export const getJobRecommendations = async (devType, skills, userInfo = {}) => {
  try {
    const response = await api.get('/jobs/recommendations', {
      params: {
        devType,
        skills: JSON.stringify(skills),
        userInfo: JSON.stringify(userInfo)
      }
    });
    return response.data.jobs;
  } catch (error) {
    console.error('채용 정보 추천 조회 오류:', error);
    // 에러 발생 시 더미 데이터 반환 (개발 중 폴백)
    return devType === 'frontend' ? frontendJobs : backendJobs;
  }
};

/**
 * 기술 분석 API 호출
 * 
 * @param {string} devType - 개발자 유형 (frontend/backend)
 * @param {Array} skills - 사용자 기술 스택
 * @param {string} career - 경력 수준
 * @returns {Promise<Object>} - 분석 결과
 */
export const getSkillAnalysis = async (devType, skills, career) => {
  try {
    const userInfo = { career };
    const response = await api.get('/jobs/recommendations', {
      params: {
        devType,
        skills: JSON.stringify(skills),
        userInfo: JSON.stringify(userInfo)
      }
    });
    return response.data.analysis;
  } catch (error) {
    console.error('기술 분석 조회 오류:', error);
    // 에러 발생 시 더미 데이터 반환 (개발 중 폴백)
    return devType === 'frontend' ? frontendAnalysis : backendAnalysis;
  }
};

/**
 * 기술 개선 제안 API 호출
 * 
 * @param {string} devType - 개발자 유형 (frontend/backend)
 * @param {Array} skills - 사용자 기술 스택
 * @param {Object} userInfo - 사용자 기본 정보 (선택적)
 * @returns {Promise<Object>} - 개선 제안
 */
export const getImprovement = async (devType, skills, userInfo = {}) => {
  try {
    const response = await api.get('/jobs/recommendations', {
      params: {
        devType,
        skills: JSON.stringify(skills),
        userInfo: JSON.stringify(userInfo)
      }
    });
    return response.data.improvement;
  } catch (error) {
    console.error('기술 개선 제안 조회 오류:', error);
    // 에러 발생 시 더미 데이터 반환 (개발 중 폴백)
    return devType === 'frontend' ? frontendImprovement : backendImprovement;
  }
};

// 더미 데이터 (API 연결 실패 시 폴백용)
// 프론트엔드 직무 더미 데이터
const frontendJobs = [
  {
    title: '시니어 프론트엔드 개발자',
    company: '테크스타트(주)',
    location: '서울 강남구',
    experienceRequired: '3-5년',
    skills: ['JavaScript', 'React', 'TypeScript', 'HTML5', 'CSS3', 'Redux', 'Webpack'],
    salary: '6000만원 ~ 8000만원',
    matchScore: 92,
    matchedSkills: ['JavaScript', 'React', 'HTML5', 'CSS3'],
    url: '#'
  },
  {
    title: 'React 개발자',
    company: '이노베이션랩(주)',
    location: '서울 서초구',
    experienceRequired: '1-3년',
    skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'styled-components', 'Next.js'],
    salary: '4500만원 ~ 6000만원',
    matchScore: 85,
    matchedSkills: ['React', 'JavaScript'],
    url: '#'
  },
  {
    title: 'UI/UX 엔지니어',
    company: '디자인테크(주)',
    location: '서울 성동구',
    experienceRequired: '신입~3년',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Figma', 'SASS/SCSS', 'Responsive Design'],
    salary: '3500만원 ~ 5000만원',
    matchScore: 80,
    matchedSkills: ['HTML5', 'CSS3', 'JavaScript'],
    url: '#'
  }
];

// 백엔드 직무 더미 데이터
const backendJobs = [
  {
    title: '백엔드 개발자',
    company: '클라우드서비스(주)',
    location: '서울 강남구',
    experienceRequired: '3-5년',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'AWS', 'RESTful API', 'Docker'],
    salary: '6000만원 ~ 8000만원',
    matchScore: 94,
    matchedSkills: ['Node.js', 'Express.js', 'MongoDB'],
    url: '#'
  },
  {
    title: 'Python 백엔드 개발자',
    company: '데이터솔루션(주)',
    location: '서울 영등포구',
    experienceRequired: '1-3년',
    skills: ['Python', 'Django', 'PostgreSQL', 'RESTful API', 'Docker', 'AWS'],
    salary: '4500만원 ~ 6000만원',
    matchScore: 88,
    matchedSkills: ['Python', 'Django'],
    url: '#'
  },
  {
    title: 'Java 백엔드 개발자',
    company: '엔터프라이즈시스템(주)',
    location: '서울 마포구',
    experienceRequired: '3-5년',
    skills: ['Java', 'Spring Boot', 'MySQL', 'JPA', 'RESTful API'],
    salary: '5500만원 ~ 7500만원',
    matchScore: 78,
    matchedSkills: ['Java', 'Spring Boot'],
    url: '#'
  }
];

// 프론트엔드 기술 분석 더미 데이터
const frontendAnalysis = {
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
  careerAnalysis: "귀하의 경력 수준(1-3년)은 주니어 개발자에서 중급 개발자로 전환하는 시기입니다. React와 같은 프레임워크 경험을 갖추고 있어 기본적인 웹 애플리케이션 개발이 가능하나, TypeScript와 테스팅 같은 고급 기술을 추가하면 더 경쟁력이 있을 것입니다."
};

// 백엔드 기술 분석 더미 데이터
const backendAnalysis = {
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
  careerAnalysis: "귀하의 경력 수준(1-3년)은 기본적인 백엔드 시스템 구현 경험이 있음을 보여줍니다. Node.js와 Express를 활용한 API 개발 경험이 있으나, 클라우드 서비스와 컨테이너화 도구에 대한 심화 지식이 필요한 시점입니다."
};

// 프론트엔드 개선점 더미 데이터
const frontendImprovement = {
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

// 백엔드 개선점 더미 데이터
const backendImprovement = {
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

export default api;