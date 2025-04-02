// src/pages/SignUp.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f5f7;
`;

const SignUpCard = styled.div`
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

const SignInLink = styled.p`
  margin-top: 15px;
  font-size: 14px;
`;

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/'); // 회원가입 후 홈으로 이동
    } catch (err) {
      setError(err.message); // 에러 메시지 처리
    }
  };

  return (
    <SignUpContainer>
      <SignUpCard>
        <h2>회원가입</h2>
        <form onSubmit={handleSignUp}>
          <Input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
          <Button type="submit">회원가입</Button>
        </form>
        <SignInLink>
          <span>이미 계정이 있으신가요? </span>
          <a href="/login">로그인</a>
        </SignInLink>
      </SignUpCard>
    </SignUpContainer>
  );
};

export default SignUp;
