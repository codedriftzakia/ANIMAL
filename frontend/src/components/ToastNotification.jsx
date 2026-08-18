import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast) return null;

  const { type = 'success', message } = toast;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle size={20} color="#10b981" />;
      case 'error': return <AlertCircle size={20} color="#ef4444" />;
      default: return <Info size={20} color="#6366f1" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 1000,
      background: 'var(--bg-glass-card)',
      backdropFilter: 'blur(12px)',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-lg)',
      borderRadius: 'var(--radius-md)',
      padding: '0.85rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      maxWidth: '400px',
      animation: 'fadeIn 0.3s ease-out',
    }}>
      {getIcon()}
      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', flex: 1 }}>
        {message}
      </span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <X size={16} />
      </button>
    </div>
  );
}
