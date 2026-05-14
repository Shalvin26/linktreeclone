import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import PublicProfile from './pages/PublicProfile'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/:username" element={<PublicProfile />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App