// src/pages/JobRecommendations.js
import React, { useEffect, useState } from 'react';
import { fetchJobsFromWorknet } from '../api/api';  // API 호출 함수 불러오기

const JobRecommendations = () => {
  const [jobData, setJobData] = useState([]);  // 채용 공고 데이터를 저장할 상태
  const [error, setError] = useState('');  // 오류 메시지를 저장할 상태

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 'frontend' 유형 개발자와 'React', 'JavaScript' 기술을 사용하여 요청
        const data = await fetchJobsFromWorknet('frontend', ['React', 'JavaScript']);
        setJobData(data);  // 받아온 데이터를 상태에 저장
      } catch (err) {
        setError('채용공고를 가져오는 데 실패했습니다.');  // 오류 처리
      }
    };

    fetchData();  // 데이터 가져오기
  }, []);  // 컴포넌트가 마운트될 때 한번만 실행

  if (error) return <p>{error}</p>;  // 오류가 있을 경우 메시지 표시

  return (
    <div>
      <h2>추천 채용 공고</h2>
      <ul>
        {jobData.map((job, index) => (
          <li key={index}>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <p>{job.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobRecommendations;
