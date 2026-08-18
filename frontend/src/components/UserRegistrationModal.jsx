import React, { useState } from 'react';
import { X, UserCheck, Sparkles, ArrowRight } from 'lucide-react';
import { registerUser } from '../api';

export default function UserRegistrationModal({ onClose, onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Visitor');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const userData = {
        name: name.trim(),
        role,
      };

      const res = await registerUser(userData);
      if (res && res.data) {
        onRegisterSuccess(res.data);
      } else {
        setErrorMsg('Registration failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error completing registration');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '480px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              background: 'var(--accent-gradient)',
              color: '#ffffff',
              padding: '0.6rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <UserCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Quick Registration</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Enter your name and role before writing feedback
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem' }}>
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            marginBottom: '1rem',
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {/* Full Name */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              Your Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Role Selector */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
              Select Your Role *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
              {['Visitor', 'Volunteer', 'Caretaker', 'Veterinarian'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  style={{
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${role === r ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    background: role === r ? 'var(--accent-light)' : 'var(--bg-secondary)',
                    color: role === r ? 'var(--accent-primary)' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Sparkles size={16} />
              <span>{submitting ? 'Registering...' : 'Continue to Feedback'}</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
