import React, { useEffect, useState } from 'react';
import { X, Heart, Star, MapPin, PlusCircle, Activity, ShieldCheck, FileText } from 'lucide-react';
import { fetchAnimalById } from '../api';

export default function AnimalDetailModal({ animal, onClose, onOpenFeedback }) {
  const [detailedData, setDetailedData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (animal && animal._id) {
        setLoading(true);
        const res = await fetchAnimalById(animal._id);
        if (res && res.data) {
          setDetailedData(res.data);
        } else {
          setDetailedData(animal);
        }
        setLoading(false);
      }
    }
    loadData();
  }, [animal]);

  if (!animal) return null;

  const currentAnimal = detailedData || animal;
  const feedbacks = currentAnimal.feedbacks || [];

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '780px', padding: '0', overflow: 'hidden' }}>
        
        {/* Cover Image & Header Overlay */}
        <div style={{ height: '260px', position: 'relative', overflow: 'hidden' }}>
          <img
            src={currentAnimal.imageUrl}
            alt={currentAnimal.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'rgba(15, 23, 42, 0.75)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>

          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 100%)',
            padding: '2rem 1.5rem 1rem 1.5rem',
            color: '#ffffff',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{currentAnimal.name}</h2>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={16} color="#10b981" /> {currentAnimal.species} • {currentAnimal.habitat}
                </p>
              </div>
              <span className="badge badge-positive" style={{ fontSize: '0.9rem', padding: '0.35rem 0.85rem' }}>
                {currentAnimal.mood}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '1.75rem', maxHeight: '60vh', overflowY: 'auto' }}>
          
          {/* Health Index Bar */}
          <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Heart size={18} color="#10b981" fill="#10b981" /> Overall Welfare Index
              </span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                {currentAnimal.healthIndex} / 100
              </span>
            </div>
            <div style={{ background: 'var(--border-color)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                width: `${currentAnimal.healthIndex}%`,
                height: '100%',
                background: currentAnimal.healthIndex > 80 ? '#10b981' : currentAnimal.healthIndex > 60 ? '#f59e0b' : '#ef4444',
                borderRadius: '5px'
              }} />
            </div>
          </div>

          {/* Bio & Special Care Notes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Biography & Habitat Notes</h4>
            <p style={{ color: 'var(--text-main)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              {currentAnimal.bio}
            </p>
            {currentAnimal.specialNotes && (
              <div style={{ padding: '0.85rem 1rem', borderRadius: '8px', background: 'var(--bg-tertiary)', borderLeft: '4px solid #6366f1', fontSize: '0.88rem' }}>
                <strong>Special Care Instructions:</strong> {currentAnimal.specialNotes}
              </div>
            )}
          </div>

          {/* Historical Feedback Timeline Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              Feedback History ({feedbacks.length})
            </h4>
            <button className="btn btn-primary" onClick={() => onOpenFeedback(currentAnimal)} style={{ fontSize: '0.85rem' }}>
              <PlusCircle size={15} />
              <span>Add Feedback</span>
            </button>
          </div>

          {/* Timeline Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {feedbacks.length === 0 ? (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No feedback recorded for this animal yet.</p>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb._id} style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{fb.userName} ({fb.userRole})</span>
                    <span className={`badge ${fb.sentiment === 'URGENT ALERT' ? 'badge-urgent' : fb.sentiment === 'NEUTRAL' ? 'badge-neutral' : 'badge-positive'}`}>
                      {fb.sentiment}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {fb.comment}
                  </p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Rating: {((fb.ratings?.overall + fb.ratings?.welfare + fb.ratings?.enclosure + fb.ratings?.interaction) / 4 || 5).toFixed(1)} ★
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
