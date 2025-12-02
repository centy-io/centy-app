import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ProjectProvider } from './context/ProjectContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </BrowserRouter>
  </StrictMode>
)
