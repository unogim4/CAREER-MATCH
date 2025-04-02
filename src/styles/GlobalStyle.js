import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
  }
  
  body {
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
  }
  
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }

  .hidden {
    display: none;
  }
  
  .visible {
    display: block;
  }
`;

export default GlobalStyle;