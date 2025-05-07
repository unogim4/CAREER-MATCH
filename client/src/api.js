// api.js - 백엔드 API 호출 유틸리티 함수

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
 * 사용자 프로필 저장
 * 
 * @param {Object} userInfo - 사용자 기본 정보
 * @param {Array} skills - 사용자 기술 스택
 * @returns {Promise} - API 응답
 */
export const saveUserProfile = async (userInfo, skills) => {
  try {
    const response = await api.post('/profile/save', {
      userInfo,
      skills
    });
    return response.data;
  } catch (error) {
    console.error('프로필 저장 오류:', error);
    throw error;
  }
};

/**
 * 사용자 프로필 조회
 * 
 * @param {string} profileId - 프로필 ID
 * @returns {Promise} - API 응답
 */
export const getUserProfile = async (profileId) => {
  try {
    const response = await api.get(`/profile/${profileId}`);
    return response.data;
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    throw error;
  }
};

/**
 * 개발자 유형과 기술 스택에 맞는 채용 정보 추천 조회
 * 
 * @param {string} devType - 개발자 유형 (frontend/backend)
 * @param {Array} skills - 사용자 기술 스택
 * @param {Object} userInfo - 사용자 정보
 * @returns {Promise} - API 응답
 */
export const getJobRecommendations = async (devType, skills, userInfo) => {
  try {
    const response = await api.get('/jobs/recommendations', {
      params: {
        devType,
        skills: JSON.stringify(skills),
        userInfo: JSON.stringify(userInfo)
      }
    });
    return response.data;
  } catch (error) {
    console.error('채용 정보 추천 조회 오류:', error);
    throw error;
  }
};

export default {
  saveUserProfile,
  getUserProfile,
  getJobRecommendations
};
