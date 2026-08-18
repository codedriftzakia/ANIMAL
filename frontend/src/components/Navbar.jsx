import React from 'react';
import { Heart, Activity, Grid, MessageSquarePlus, Sun, Moon, Database, UserCheck, UserPlus, PlusCircle } from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  dbStatus, 
  currentUser, 
  onOpenRegisterModal, 
  onOpenSubmitModal 
}) {
  return (
    <header className="glass-panel" style={{ margin: '1rem 0 2rem 0', padding: '0.85rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            background: 'var(--accent-gradient)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Heart size={24} fill="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                FaunaPulse
              </h1>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: '#6366f1'
              }}>
                v1.1 Atlas
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Animal Feedback & Welfare Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ fontSize: '0.9rem' }}
          >
            <Activity size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className={`btn ${activeTab === 'animals' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('animals')}
            style={{ fontSize: '0.9rem' }}
          >
            <Grid size={18} />
            <span>Animal Catalog</span>
          </button>

          <button
            className={`btn ${activeTab === 'feedback' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('feedback')}
            style={{ fontSize: '0.9rem' }}
          >
            <MessageSquarePlus size={18} />
            <span>Feedback Logs</span>
          </button>
        </nav>

        {/* Controls & User Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* User Registration Status Badge */}
          {currentUser ? (
            <div 
              onClick={onOpenRegisterModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '20px',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                cursor: 'pointer',
              }}
              title="Click to update registration profile"
            >
              <UserCheck size={16} color="#6366f1" />
              <div style={{ fontSize: '0.78rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{currentUser.name}</span>
                <span style={{ color: '#6366f1', marginLeft: '0.35rem' }}>({currentUser.role})</span>
              </div>
            </div>
          ) : (
            <button 
              className="btn btn-secondary" 
              onClick={onOpenRegisterModal}
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
            >
              <UserPlus size={16} />
              <span>Register User</span>
            </button>
          )}

          {/* DB Status Badge */}
          <div 
            title={`Backend Status: ${dbStatus}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              background: dbStatus === 'connected' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              color: dbStatus === 'connected' ? '#10b981' : '#f59e0b',
              border: `1px solid ${dbStatus === 'connected' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
            }}
          >
            <Database size={14} />
            <span>{dbStatus === 'connected' ? 'Atlas Connected' : 'Express Active'}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{ padding: '0.6rem', borderRadius: '50%' }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} color="#f59e0b" />}
          </button>

          {/* Submit Feedback CTA Button */}
          <button
            className="btn btn-primary"
            onClick={onOpenSubmitModal}
            style={{ gap: '0.5rem' }}
          >
            <PlusCircle size={18} />
            <span>Submit Feedback</span>
          </button>

        </div>

      </div>
    </header>
  );
}
