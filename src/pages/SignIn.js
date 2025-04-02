// src/pages/SignIn.js
import React, { useState } from 'react';
import styled from 'styled-components'; // styled-components로 스타일링
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// 로그인 화면 스타일
const SignInContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f5f7;
`;

const LoginCard = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #135f9e;
  }
`;

const SignUpLink = styled.p`
  margin-top: 15px;
  font-size: 14px;
`;

const SignIn = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate
  const [email, setEmail] = useState(''); // 이메일 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [error, setError] = useState(''); // 로그인 오류 메시지 상태

  // 로그인 처리 함수
  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // 로그인 후 홈으로 이동
    } catch (err) {
      setError(err.message); // 오류 발생 시 오류 메시지 표시
    }
  };

  return (
    <SignInContainer>
      <LoginCard>
        <h2>로그인</h2>
        <form onSubmit={handleSignIn}>
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // 이메일 입력 처리
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // 비밀번호 입력 처리
          />
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>} {/* 오류 메시지 출력 */}
          <Button type="submit">로그인</Button>
        </form>
        <SignUpLink>
          <span>아직 계정이 없으신가요? </span>
          <a href="/signup">회원가입</a>
        </SignUpLink>
      </LoginCard>
    </SignInContainer>
  );
};

export default SignIn;
