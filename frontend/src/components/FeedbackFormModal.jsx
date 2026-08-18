import React, { useState } from 'react';
import { X, Star, Heart, Sparkles, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FeedbackFormModal({ animals, initialAnimalId, currentUser, onClose, onSubmit }) {
  const [animalId, setAnimalId] = useState(initialAnimalId || (animals[0]?._id || ''));
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const selectedAnimal = animals.find((a) => a._id === animalId) || animals[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);

    const feedbackData = {
      animalId,
      userName: currentUser?.name || 'Sanctuary Supporter',
      userRole: currentUser?.role || 'Visitor',
      ratings: {
        overall: rating,
        welfare: rating,
        enclosure: rating,
        interaction: rating,
      },
      tags: [],
      comment: comment.trim(),
      imageUrl: '',
      isUrgent: false,
    };

    await onSubmit(feedbackData);
    setSubmitting(false);

    // Launch confetti celebration
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '540px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ background: 'var(--accent-gradient)', color: '#fff', padding: '0.6rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={22} fill="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Animal Feedback</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Reporting as: <strong>{currentUser?.name || 'Sanctuary Visitor'}</strong> ({currentUser?.role || 'Visitor'})
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Animal Selection Bar */}
        {selectedAnimal && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            marginBottom: '1.25rem',
          }}>
            <img
              src={selectedAnimal.imageUrl}
              alt={selectedAnimal.name}
              style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <select
                value={animalId}
                onChange={(e) => setAnimalId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.35rem 0.5rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                }}
              >
                {animals.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name} ({a.species})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* SECTION 1: RATE SECTION */}
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            textAlign: 'center',
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)' }}>
              1. Rate Section
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Select your rating for {selectedAnimal?.name || 'this animal'} (1 to 5 stars)
            </p>

            <div style={{ display: 'inline-flex', gap: '0.5rem', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= (hoverRating || rating);
                return (
                  <Star
                    key={star}
                    size={36}
                    className={isActive ? 'star-filled' : 'star-empty'}
                    style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                );
              })}
            </div>
            <div style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              {rating} / 5 Stars
            </div>
          </div>

          {/* SECTION 2: COMMENT SECTION */}
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)' }}>
              2. Comment Section
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Write your detailed comments or observations regarding care, habitat, or behavior
            </p>

            <textarea
              required
              rows={4}
              placeholder="Write your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting || !comment.trim()}>
              <Sparkles size={16} />
              <span>{submitting ? 'Submitting Feedback...' : 'Submit Feedback'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
