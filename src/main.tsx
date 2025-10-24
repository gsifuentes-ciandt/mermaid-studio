import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './AppRouter';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import { UserProvider } from './contexts/UserContext';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <UserProvider>
          <AppRouter />
        </UserProvider>
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>
);
