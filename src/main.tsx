import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Versão do App para limpar cache local em novos deploys
const APP_VERSION = '1.0.2'; 
const savedVersion = localStorage.getItem('app_version');

if (savedVersion !== APP_VERSION) {
  localStorage.clear();
  localStorage.setItem('app_version', APP_VERSION);
  console.log('Cache local limpo: Versão ' + APP_VERSION);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
