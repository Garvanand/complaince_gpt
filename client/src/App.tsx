import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import Standards from './pages/Standards'
import AgentWorkflow from './pages/AgentWorkflow'
import Analytics from './pages/Analytics'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/standards" element={<Standards />} />
        <Route path="/agents" element={<AgentWorkflow />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
