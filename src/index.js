import React from 'react';
import ReactDOM from 'react-dom/client';
import './Login.css';
import './SignUp.css';
import './Home.css';
import './Board.css';
import './example.css';
import './exampleBoard.css';
import './exampleLogin.css';

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