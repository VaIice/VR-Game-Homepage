import React from 'react';
import ReactDOM from 'react-dom/client';
import './Login.css';
import './SignUp.css';
import './Home.css';
import './Board.css';
import './example.css';
import './exampleBoard.css';
import './exampleBoardPage.css';
import './exampleBoardWriting.css';
import './exampleLogin.css';
import './exampleSignUp.css';
import './PasswordSearch.css';
import './Information.css';

import App from './App';
import {CookiesProvider} from 'react-cookie';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    	<CookiesProvider>
        <App />
      </CookiesProvider>  
  </React.StrictMode>
);