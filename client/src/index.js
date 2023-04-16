import React from 'react';
import App from './App';
import './index.css';

import ReactDOM from 'react-dom/client';
import { AuthProvider } from "react-auth-kit";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <AuthProvider
            authType={"cookie"}
            authName={"_auth"}
            cookieDomain={window.location.hostname}
            cookieSecure={false}
          >
                <App />
          </AuthProvider>
    </React.StrictMode>
);

