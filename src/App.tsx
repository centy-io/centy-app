import { InitProject } from './components/InitProject.tsx'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Centy</h1>
        <p>Local-first issue and documentation tracker</p>
      </header>
      <main>
        <InitProject />
      </main>
    </div>
  )
}

export default App
