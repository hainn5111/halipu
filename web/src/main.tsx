import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { loadConfig } from './core/config';
import './styles.css';

// Nạp config.json trước khi dựng giao diện (mọi lời gọi API cần apiBase).
loadConfig().then(() => {
  createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
});
