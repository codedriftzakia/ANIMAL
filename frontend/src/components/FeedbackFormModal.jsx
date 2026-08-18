import React, { useState } from 'react';
import { X, Star, Upload, AlertTriangle, CheckCircle, Heart, User, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { uploadImage } from '../api';

const AVAILABLE_TAGS = [
  'Active & Playful',
  'Clean Habitat',
  'Healthy Diet',
  'Enrichment Needed',
  'Friendly Interaction',
  'Dietary Concern',
  'Peaceful Behavior',
  'Great Hydration',
  'High Energy',
  'Stress Signs',
];

export default function FeedbackFormModal({ animals, initialAnimalId, onClose, onSubmit }) {
  const [step, setStep] = useState(1);
  const [animalId, setAnimalId] = useState(initialAnimalId || (animals[0]?._id || ''));
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('Visitor');

  // Step 2 Ratings & Tags
  const [ratings, setRatings] = useState({
    overall: 5,
    welfare: 5,
    enclosure: 5,
    interaction: 5,
  });
  const [selectedTags, setSelectedTags] = useState(['Active & Playful', 'Clean Habitat']);

  // Step 3 Comment & Uploads
  const [comment, setComment] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedAnimal = animals.find((a) => a._id === animalId) || animals[0];

  // Auto sentiment calculation preview
  const getCalculatedSentiment = () => {
    if (isUrgent) return 'URGENT ALERT';
    const lower = comment.toLowerCase();
    const urgentWords = ['sick', 'injured', 'lethargic', 'blood', 'broken', 'emergency', 'pain', 'neglect'];
    if (urgentWords.some((w) => lower.includes(w)) || ratings.welfare <= 2) {
      return 'URGENT ALERT';
    }
    const avg = (ratings.overall + ratings.welfare + ratings.enclosure + ratings.interaction) / 4;
    if (avg >= 3.8) return 'POSITIVE';
    return 'NEUTRAL';
  };

  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadImage(file);
      if (res && res.url) {
        setImageUrl(res.url);
      }
    } catch (err) {
      console.error('Image upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    const feedbackData = {
      animalId,
      userName: userName.trim() || 'Anonymous Supporter',
      userRole,
      ratings,
      tags: selectedTags,
      comment: comment.trim(),
      imageUrl,
      isUrgent,
    };

    await onSubmit(feedbackData);
    setSubmitting(false);

    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: 'var(--accent-gradient)', color: '#fff', padding: '0.5rem', borderRadius: '10px' }}>
              <Heart size={20} fill="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Submit Animal Feedback</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step {step} of 3 • Impact Sanctuary Welfare Tracking</p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
            <X size={22} />
          </button>
        </div>

        {/* Wizard Progress Steps Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: '6px',
                borderRadius: '3px',
                background: s <= step ? 'var(--accent-primary)' : 'var(--border-color)',
                transition: 'background 0.3s ease',
              }}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: Animal & Reporter Selection */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                  1. Select Animal
                </label>
                <select
                  value={animalId}
                  onChange={(e) => setAnimalId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  {animals.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} — {a.species} ({a.habitat})
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Animal Preview Card */}
              {selectedAnimal && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                }}>
                  <img
                    src={selectedAnimal.imageUrl}
                    alt={selectedAnimal.name}
                    style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{selectedAnimal.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {selectedAnimal.species} • Health Score: <strong>{selectedAnimal.healthIndex}/100</strong>
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                  2. Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe (or leave blank for Anonymous)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                  3. Reporter Role
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {['Visitor', 'Volunteer', 'Caretaker', 'Veterinarian'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUserRole(role)}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-md)',
                        border: `2px solid ${userRole === role ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                        background: userRole === role ? 'var(--accent-light)' : 'var(--bg-secondary)',
                        color: userRole === role ? 'var(--accent-primary)' : 'var(--text-main)',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                  <span>Next: Ratings & Tags</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: Multi-Category Ratings & Tags */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Multi-Category Performance Evaluation
              </h4>

              {/* Rating Fields */}
              {[
                { key: 'overall', label: 'Overall Sanctuary Experience' },
                { key: 'welfare', label: 'Animal Health & Welfare Signs' },
                { key: 'enclosure', label: 'Enclosure Cleanliness & Space' },
                { key: 'interaction', label: 'Visitor & Staff Interaction' },
              ].map(({ key, label }) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</span>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={22}
                        className={star <= ratings[key] ? 'star-filled' : 'star-empty'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setRatings({ ...ratings, [key]: star })}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Tag Chip Selector */}
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                  Select Observation Tags
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {AVAILABLE_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                          background: isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                          color: isSelected ? '#ffffff' : 'var(--text-main)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                  <span>Next: Write Review & Upload</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Detailed Feedback & Upload */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                  Detailed Review & Care Observation *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share detailed observations regarding behavior, feeding, habitat condition, or care..."
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
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Cloudinary Image Upload Field */}
              <div>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>
                  Photo Evidence (Cloudinary API Upload)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                    <Upload size={16} />
                    <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
                    <input type="file" accept="image/*" onChange={handleImageFileChange} style={{ display: 'none' }} />
                  </label>
                  {imageUrl && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={imageUrl} alt="Preview" style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} />
                      <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>Image Ready!</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Urgent Care Checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer', background: 'rgba(239, 68, 68, 0.08)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#ef4444' }}
                />
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ef4444' }}>
                  Flag as Urgent Care Alert (Triggers Priority Veterinary Inspection)
                </span>
              </label>

              {/* Auto Sentiment Detection Live Preview */}
              <div style={{
                background: 'var(--bg-tertiary)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Auto Sentiment Preview:</span>
                <span className={`badge ${getCalculatedSentiment() === 'URGENT ALERT' ? 'badge-urgent' : getCalculatedSentiment() === 'NEUTRAL' ? 'badge-neutral' : 'badge-positive'}`}>
                  {getCalculatedSentiment()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting || !comment.trim()}>
                  <Sparkles size={16} />
                  <span>{submitting ? 'Submitting to MongoDB...' : 'Submit Feedback'}</span>
                </button>
              </div>

            </div>
          )}

        </form>

      </div>
    </div>
  );
}
