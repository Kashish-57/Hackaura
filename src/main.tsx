import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// in src/main.tsx
import './i18n';

createRoot(document.getElementById("root")!).render(<App />);