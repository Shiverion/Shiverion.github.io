import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const BadgeLoader = ({ children }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//cdn.credly.com/assets/utilities/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      try { document.body.removeChild(script); } catch (e) { }
    };
  }, []);
  return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BadgeLoader>
        <App />
      </BadgeLoader>
    </BrowserRouter>
  </StrictMode>,
)
