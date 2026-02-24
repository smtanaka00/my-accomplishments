import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, Clock, PlusCircle, FolderHeart, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import EntryForm from './pages/EntryForm';
import Vault from './pages/Vault';
import Auth from './pages/Auth';
import ProfileSetup from './components/ProfileSetup';
import { GlobalStateProvider, useGlobalState } from './context/GlobalStateContext';
import { supabase } from './supabase';
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
    <button
      onClick={() => supabase.auth.signOut()}
      className="nav-item"
      title="Sign Out"
    >
      <LogOut size={24} />
      <span>Logout</span>
    </button>
  </nav>
);

const AppContent = () => {
  const { session, loadingAuth, profile, refreshProfile } = useGlobalState();

  if (loadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--color-primary)' }}>
        Loading application...
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  const needsProfileSetup = profile && (!profile.full_name || !profile.target_role);

  return (
    <Router>
      {needsProfileSetup && <ProfileSetup onComplete={refreshProfile} />}
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
  );
};

function App() {
  return (
    <GlobalStateProvider>
      <AppContent />
    </GlobalStateProvider>
  );
}

export default App;
