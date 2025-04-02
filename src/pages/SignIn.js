// src/pages/SignIn.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignInContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f5f7;
`;
// 나머지 코드 ...

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // 로그인 후 메인 화면으로 이동
    } catch (err) {
      setError(err.message);
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
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
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
