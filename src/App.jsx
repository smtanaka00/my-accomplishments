import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, Clock, PlusCircle, FolderHeart, Target, User, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import EntryForm from './pages/EntryForm';
import Vault from './pages/Vault';
import Auth from './pages/Auth';
import Goals from './pages/Goals';
import PublicPortfolio from './pages/PublicPortfolio';
import ProfileSetup from './components/ProfileSetup';
import Profile from './pages/Profile';
import { GlobalStateProvider, useGlobalState } from './context/GlobalStateContext';
import { supabase } from './supabase';
import './index.css';

const NAV_LINKS = [
  { to: '/', icon: Home, label: 'Home', end: true },
  { to: '/timeline', icon: Clock, label: 'Timeline' },
  { to: '/log', icon: PlusCircle, label: 'Log Achievement' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/vault', icon: FolderHeart, label: 'Evidence Vault' },
  { to: '/profile', icon: User, label: 'Profile' },
];

// Mobile: bottom tab bar
const BottomNavigation = () => (
  <nav className="bottom-nav">
    {NAV_LINKS.filter(l => l.label !== 'Profile').map(({ to, icon: Icon, label, end }) => (
      <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} end={end}>
        <Icon size={22} />
        <span>{label === 'Log Achievement' ? 'Log' : label === 'Evidence Vault' ? 'Vault' : label}</span>
      </NavLink>
    ))}
  </nav>
);

// Desktop: left sidebar
const SidebarNavigation = ({ profile, onSignOut }) => (
  <nav className="sidebar-nav">
    <div className="sidebar-logo">
      <h2>My Achievements</h2>
      <p>{profile?.full_name || 'Your Career Portfolio'}</p>
    </div>

    <div className="sidebar-links">
      {NAV_LINKS.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </div>

    <div className="sidebar-footer">
      <button onClick={onSignOut} className="sidebar-item" style={{ gap: '12px' }}>
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
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
  const handleSignOut = () => supabase.auth.signOut();

  return (
    <Router>
      {needsProfileSetup && <ProfileSetup onComplete={refreshProfile} />}
      {/* Desktop Sidebar */}
      <SidebarNavigation profile={profile} onSignOut={handleSignOut} />
      {/* Page content */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/log" element={<EntryForm />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/p/:userId" element={<PublicPortfolio />} />
        </Routes>
      </div>
      {/* Mobile Bottom Nav */}
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
