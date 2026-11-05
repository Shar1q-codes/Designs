import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/base.css';
import './styles/scenes.css';
import './styles/layouts.css';
import './styles/nav.css';
import './styles/designs';
import './styles/menu.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
