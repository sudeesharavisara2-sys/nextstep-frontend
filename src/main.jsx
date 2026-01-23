import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Ensure that 'root' matches the ID in your index.html file
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)