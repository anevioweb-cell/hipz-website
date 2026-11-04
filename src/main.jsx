import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'motion/react';
import './index.css';
import App from './App.jsx';
import { hideHeroShell } from './lib/heroShell.js';

// safety net: never leave the static first frame visible if the hero image fails to load
setTimeout(hideHeroShell, 5000);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LazyMotion features={domAnimation} strict>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LazyMotion>
  </StrictMode>,
);
