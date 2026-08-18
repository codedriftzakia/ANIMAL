import React from 'react';
import { 
  Heart, AlertTriangle, ShieldCheck, MessageSquare, TrendingUp, 
  CheckCircle2, Clock, Eye, Sparkles, ExternalLink 
} from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function DashboardView({ analytics, animals, onSelectAnimal, onOpenSubmitModal, setActiveTab }) {
  const summary = analytics?.summary || { totalAnimals: 0, totalFeedback: 0, urgentAlertsCount: 0, avgWelfareScore: 88 };
  const sentiment = analytics?.sentimentDistribution || { positive: 0, neutral: 0, urgent: 0 };
  const statusDist = analytics?.statusDistribution || { pending: 0, underReview: 0, resolved: 0, highlighted: 0 };
  const urgentAlerts = analytics?.recentUrgentAlerts || [];

  // Sentiment Doughnut Chart Config
  const doughnutData = {
    labels: ['Positive', 'Neutral', 'Urgent Alert'],
    datasets: [
      {
        data: [sentiment.positive || 1, sentiment.neutral || 0, sentiment.urgent || 0],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 2,
        borderColor: 'transparent',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 12 } } },
    },
  };

  // Status Bar Chart Config
  const barData = {
    labels: ['Pending', 'Under Review', 'Resolved', 'Highlighted'],
    datasets: [
      {
        label: 'Feedback Entries',
        data: [statusDist.pending, statusDist.underReview, statusDist.resolved, statusDist.highlighted],
        backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#a855f7'],
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Hero Welcome & Quick Banner */}
      <div className="glass-panel" style={{ 
        padding: '2rem', 
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={20} color="#10b981" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981' }}>
              Sanctuary Welfare Analytics Engine
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Real-Time Animal Welfare & Visitor Sentiment Intelligence
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            FaunaPulse automatically converts incoming visitor, volunteer, and caretaker reviews into dynamic health metrics, mood classifications, and instant care alerts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={onOpenSubmitModal}>
            <Heart size={18} />
            <span>Submit Feedback</span>
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('animals')}>
            <Eye size={18} />
            <span>View All Animals</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Animals Tracked</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>{summary.totalAnimals}</h3>
            </div>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', padding: '0.75rem', borderRadius: '12px' }}>
              <ShieldCheck size={24} />
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingUp size={14} /> Active Monitoring Across Habitats
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Welfare Score</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '0.2rem' }}>
                {summary.avgWelfareScore} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
              </h3>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.75rem', borderRadius: '12px' }}>
              <Heart size={24} />
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
            ● Optimal Sanctuary Health Index
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Feedback Entries</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.2rem' }}>{summary.totalFeedback}</h3>
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '0.75rem', borderRadius: '12px' }}>
              <MessageSquare size={24} />
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Visitors, Staff & Vet Submissions
          </span>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', border: summary.urgentAlertsCount > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : undefined }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Urgent Care Alerts</p>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: summary.urgentAlertsCount > 0 ? '#ef4444' : '#10b981', marginTop: '0.2rem' }}>
                {summary.urgentAlertsCount}
              </h3>
            </div>
            <div style={{ 
              background: summary.urgentAlertsCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', 
              color: summary.urgentAlertsCount > 0 ? '#ef4444' : '#10b981', 
              padding: '0.75rem', 
              borderRadius: '12px' 
            }}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: summary.urgentAlertsCount > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
            {summary.urgentAlertsCount > 0 ? 'Requires Immediate Review' : 'No Critical Urgent Flags'}
          </span>
        </div>

      </div>

      {/* Analytics Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Heart size={18} color="#10b981" /> Feedback Sentiment Breakdown
          </h3>
          <div style={{ height: '230px', position: 'relative' }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="#6366f1" /> Moderation Workflow Status
          </h3>
          <div style={{ height: '230px', position: 'relative' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

      </div>

      {/* Featured Sanctuary Animals Strip */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Featured Sanctuary Animals</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click an animal to view full welfare history or add feedback</p>
          </div>
          <button className="btn btn-secondary" onClick={() => setActiveTab('animals')}>
            Explore All Catalog
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {animals.slice(0, 4).map((animal) => (
            <div
              key={animal._id}
              onClick={() => onSelectAnimal(animal)}
              style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
            >
              <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={animal.imageUrl}
                  alt={animal.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  color: '#fff',
                  backdropFilter: 'blur(4px)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Heart size={12} fill="#10b981" color="#10b981" />
                  <span>{animal.healthIndex}/100</span>
                </div>
              </div>

              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{animal.name}</h4>
                  <span className="badge badge-positive">{animal.mood}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {animal.species} • {animal.habitat}
                </p>

                {/* Welfare Bar */}
                <div style={{ background: 'var(--border-color)', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${animal.healthIndex}%`,
                    height: '100%',
                    background: animal.healthIndex > 80 ? '#10b981' : animal.healthIndex > 60 ? '#f59e0b' : '#ef4444',
                    borderRadius: '4px'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
