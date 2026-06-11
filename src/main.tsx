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

// Registar Service-Worker para suporte PWA & Botão de Instalação na URL
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('PWA Service Worker registado com sucesso:', reg.scope))
      .catch((err) => console.error('Falha ao registar PWA Service Worker:', err));
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
