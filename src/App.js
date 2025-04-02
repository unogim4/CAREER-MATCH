// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/Theme';
import ResumeForm from './pages/ResumeForm';
import SkillsForm from './pages/SkillsForm';
import LoadingScreen from './pages/LoadingScreen';
import ResultsScreen from './pages/ResultsScreen';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProvider } from './context/UserContext';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute 추가

function App() {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <div className="App">
            <Header />
            <main className="container">
              <Routes>
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                
                {/* 로그인 후 접근할 수 있는 페이지 */}
                <PrivateRoute path="/resume" element={<ResumeForm />} />
                <PrivateRoute path="/skills" element={<SkillsForm />} />
                <PrivateRoute path="/results" element={<ResultsScreen />} />
                {/* 로그인하지 않으면 login 화면으로 이동 */}
                <Route path="/" element={<ResumeForm />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
