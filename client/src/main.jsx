import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import AuthProvider from './context/AuthProvider';

import './styles/globals.css';
import './styles/layout.css';
import './styles/components/header.css';
import './styles/components/back-button.css';
import './styles/components/buttons.css';
import './styles/components/routes.css';
import './styles/components/sos.css';
import './styles/pages/landing.css';
import './styles/pages/dashboard/dashboard.css';
import './styles/auth/auth.css';

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);