import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, Clock, PlusCircle, FolderHeart } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import EntryForm from './pages/EntryForm';
import Vault from './pages/Vault';
import { GlobalStateProvider } from './context/GlobalStateContext';
import './index.css';

// Navigation Component
const BottomNavigation = () => (
  <nav className="bottom-nav">
    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end>
      <Home size={24} />
      <span>Dashboard</span>
    </NavLink>
    <NavLink to="/timeline" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
      <Clock size={24} />
      <span>Timeline</span>
    </NavLink>
    <NavLink to="/log" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
      <PlusCircle size={24} />
      <span>Log</span>
    </NavLink>
    <NavLink to="/vault" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
      <FolderHeart size={24} />
      <span>Vault</span>
    </NavLink>
  </nav>
);

function App() {
  return (
    <GlobalStateProvider>
      <Router>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/log" element={<EntryForm />} />
            <Route path="/vault" element={<Vault />} />
          </Routes>
        </div>
        <BottomNavigation />
      </Router>
    </GlobalStateProvider>
  );
}

export default App;
