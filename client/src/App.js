import React from 'react';
import './App.css';
import ResumeForm from './components/ResumeForm';

function App() {
  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>커리어매치</h1>
          <p>개발자 맞춤형 취업 추천 서비스</p>
        </header>
        
        {/* 진행 상태 표시 */}
        <ResumeForm />
        
        <footer>
          <p>&copy; 2025 커리어매치. 모든 권리 보유.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
