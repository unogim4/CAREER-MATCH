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
                <Route path="/" element={<ResumeForm />} />
                <Route path="/skills" element={<SkillsForm />} />
                <Route path="/loading" element={<LoadingScreen />} />
                <Route path="/results" element={<ResultsScreen />} />
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