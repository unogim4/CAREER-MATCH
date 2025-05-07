// routes/profile.js - 사용자 프로필 관련 라우트

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * 사용자 프로필 저장 API
 * POST /api/profile/save
 * Body: 
 *  - userInfo: 사용자 기본 정보 객체
 *  - skills: 사용자 기술 스택 배열
 */
router.post('/save', async (req, res) => {
  try {
    const { userInfo, skills } = req.body;
    
    if (!userInfo) {
      return res.status(400).json({ message: '사용자 정보가 필요합니다.' });
    }
    
    // 프로필 ID 생성 (실제 구현에서는 DB 저장 및 고유 ID 발급)
    const profileId = 'profile_' + Date.now();
    
    // 사용자 프로필 객체 생성
    const userProfile = {
      id: profileId,
      ...userInfo,
      skills: skills || [],
      createdAt: new Date().toISOString()
    };
    
    // 프로필 저장 (데모용으로 파일 시스템에 저장)
    await saveProfileToFile(userProfile);
    
    // 응답
    res.status(201).json({
      message: '프로필이 성공적으로 저장되었습니다.',
      profileId: profileId
    });
  } catch (error) {
    console.error('프로필 저장 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/**
 * 사용자 프로필 조회 API
 * GET /api/profile/:id
 * Path parameters:
 *  - id: 프로필 ID
 */
router.get('/:id', async (req, res) => {
  try {
    const profileId = req.params.id;
    
    if (!profileId) {
      return res.status(400).json({ message: '프로필 ID가 필요합니다.' });
    }
    
    // 프로필 조회 (데모용으로 파일 시스템에서 조회)
    const profile = await getProfileFromFile(profileId);
    
    if (!profile) {
      return res.status(404).json({ message: '프로필을 찾을 수 없습니다.' });
    }
    
    // 응답
    res.status(200).json(profile);
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

/**
 * 프로필을 파일에 저장 (실제 구현에서는 DB 저장)
 * @param {Object} profile - 사용자 프로필 객체
 */
async function saveProfileToFile(profile) {
  try {
    // 데이터 디렉토리가 없으면 생성
    const dataDir = path.join(__dirname, '../data/profiles');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // 프로필 파일 경로
    const filePath = path.join(dataDir, `${profile.id}.json`);
    
    // 파일에 저장
    fs.writeFileSync(filePath, JSON.stringify(profile, null, 2));
    
    return true;
  } catch (error) {
    console.error('프로필 파일 저장 오류:', error);
    throw error;
  }
}

/**
 * 파일에서 프로필 조회 (실제 구현에서는 DB 조회)
 * @param {string} profileId - 프로필 ID
 * @returns {Object|null} - 프로필 객체 또는 null
 */
async function getProfileFromFile(profileId) {
  try {
    // 프로필 파일 경로
    const filePath = path.join(__dirname, `../data/profiles/${profileId}.json`);
    
    // 파일 존재 여부 확인
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    // 파일에서 읽기
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('프로필 파일 조회 오류:', error);
    return null;
  }
}

module.exports = router;