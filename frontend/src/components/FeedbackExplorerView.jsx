import React, { useState } from 'react';
import { 
  MessageSquare, Star, Filter, Search, ShieldAlert, CheckCircle, 
  Trash2, AlertTriangle, UserCheck, Image as ImageIcon, CornerDownRight, PlusCircle 
} from 'lucide-react';

export default function FeedbackExplorerView({ 
  feedbacks, 
  animals, 
  onUpdateStatus, 
  onDeleteFeedback, 
  onOpenSubmitModal 
}) {
  const [search, setSearch] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedAnimalId, setSelectedAnimalId] = useState('All');

  // Confirmation state for deleting
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [activeStaffNoteId, setActiveStaffNoteId] = useState(null);
  const [staffNoteInput, setStaffNoteInput] = useState('');

  // Filtering
  const filtered = feedbacks.filter((fb) => {
    const matchesSearch =
      fb.userName.toLowerCase().includes(search.toLowerCase()) ||
      fb.comment.toLowerCase().includes(search.toLowerCase()) ||
      (fb.tags && fb.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));

    const matchesSentiment = selectedSentiment === 'All' || fb.sentiment === selectedSentiment;
    const matchesStatus = selectedStatus === 'All' || fb.status === selectedStatus;
    const matchesRole = selectedRole === 'All' || fb.userRole === selectedRole;
    
    const animalObjId = fb.animalId?._id || fb.animalId;
    const matchesAnimal = selectedAnimalId === 'All' || animalObjId === selectedAnimalId;

    return matchesSearch && matchesSentiment && matchesStatus && matchesRole && matchesAnimal;
  });

  const handleSaveStaffNote = (id) => {
    const fb = feedbacks.find((item) => item._id === id);
    if (fb) {
      onUpdateStatus(id, fb.status, staffNoteInput);
      setActiveStaffNoteId(null);
      setStaffNoteInput('');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Filters Header */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Feedback & Welfare Explorer</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Inspect visitor, volunteer, and caretaker reviews. Moderate status, view attached images, and append staff notes.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onOpenSubmitModal}>
            <PlusCircle size={18} />
            <span>New Feedback</span>
          </button>
        </div>

        {/* Filter Bar Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
          
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Search comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.4rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
              }}
            />
          </div>

          {/* Sentiment Filter */}
          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
            }}
          >
            <option value="All">All Sentiments</option>
            <option value="POSITIVE">Positive</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="URGENT ALERT">Urgent Alerts</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Resolved">Resolved</option>
            <option value="Highlighted">Highlighted</option>
          </select>

          {/* Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
            }}
          >
            <option value="All">All Reporter Roles</option>
            <option value="Visitor">Visitor</option>
            <option value="Volunteer">Volunteer</option>
            <option value="Caretaker">Caretaker</option>
            <option value="Veterinarian">Veterinarian</option>
          </select>

          {/* Animal Filter */}
          <select
            value={selectedAnimalId}
            onChange={(e) => setSelectedAnimalId(e.target.value)}
            style={{
              padding: '0.55rem 0.75rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
            }}
          >
            <option value="All">All Animals</option>
            {animals.map((a) => (
              <option key={a._id} value={a._id}>{a.name} ({a.species})</option>
            ))}
          </select>

        </div>
      </div>

      {/* Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filtered.map((fb) => {
          const animalName = fb.animalId?.name || 'Sanctuary Resident';
          const animalImg = fb.animalId?.imageUrl;
          const avgRating = ((fb.ratings.overall + fb.ratings.welfare + fb.ratings.enclosure + fb.ratings.interaction) / 4).toFixed(1);

          return (
            <div key={fb._id} className="glass-card" style={{ padding: '1.5rem' }}>
              
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  {animalImg && (
                    <img
                      src={animalImg}
                      alt={animalName}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{animalName}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>by {fb.userName} ({fb.userRole})</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                      {new Date(fb.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Sentiment Badge */}
                  <span className={`badge ${fb.sentiment === 'URGENT ALERT' ? 'badge-urgent' : fb.sentiment === 'NEUTRAL' ? 'badge-neutral' : 'badge-positive'}`}>
                    {fb.sentiment === 'URGENT ALERT' && <AlertTriangle size={14} />}
                    {fb.sentiment}
                  </span>

                  {/* Status Dropdown */}
                  <select
                    value={fb.status}
                    onChange={(e) => onUpdateStatus(fb._id, e.target.value, fb.staffNote)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Pending">Status: Pending</option>
                    <option value="Under Review">Status: Under Review</option>
                    <option value="Resolved">Status: Resolved</option>
                    <option value="Highlighted">Status: Highlighted</option>
                  </select>

                  {/* Delete button */}
                  <button
                    onClick={() => setDeleteConfirmId(fb._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-light)',
                      cursor: 'pointer',
                      padding: '0.35rem',
                    }}
                    title="Delete Feedback"
                  >
                    <Trash2 size={16} color="#ef4444" />
                  </button>
                </div>
              </div>

              {/* Rating Summary Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', margin: '0.75rem 0', background: 'var(--bg-tertiary)', padding: '0.75rem 1rem', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Star size={16} className="star-filled" />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{avgRating} / 5.0</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Overall: <strong>{fb.ratings.overall}★</strong> • Welfare: <strong>{fb.ratings.welfare}★</strong> • Enclosure: <strong>{fb.ratings.enclosure}★</strong> • Interaction: <strong>{fb.ratings.interaction}★</strong>
                </div>
              </div>

              {/* Tags */}
              {fb.tags && fb.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', margin: '0.75rem 0' }}>
                  {fb.tags.map((tag, idx) => (
                    <span key={idx} style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Comment Content */}
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', margin: '0.75rem 0', lineHeight: 1.5 }}>
                {fb.comment}
              </p>

              {/* Cloudinary Image Attachment Preview if present */}
              {fb.imageUrl && (
                <div style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                  <img
                    src={fb.imageUrl}
                    alt="Attached evidence"
                    style={{ maxHeight: '200px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                  />
                </div>
              )}

              {/* Staff Note Block */}
              {fb.staffNote ? (
                <div style={{
                  marginTop: '0.85rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.08)',
                  borderLeft: '4px solid #6366f1',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem',
                }}>
                  <CornerDownRight size={16} color="#6366f1" style={{ marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6366f1' }}>Staff Note:</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{fb.staffNote}</p>
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: '0.75rem' }}>
                  {activeStaffNoteId === fb._id ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Type staff review note..."
                        value={staffNoteInput}
                        onChange={(e) => setStaffNoteInput(e.target.value)}
                        style={{
                          flex: 1,
                          padding: '0.4rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-secondary)',
                          color: 'var(--text-main)',
                          fontSize: '0.85rem',
                        }}
                      />
                      <button className="btn btn-primary" onClick={() => handleSaveStaffNote(fb._id)} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                        Save Note
                      </button>
                      <button className="btn btn-secondary" onClick={() => setActiveStaffNoteId(null)} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setActiveStaffNoteId(fb._id); setStaffNoteInput(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#6366f1',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      + Add Staff Note
                    </button>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No feedback records found matching your active filters.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Confirm Deletion</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Are you sure you want to permanently remove this feedback entry? The animal's welfare score will be recalculated.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  onDeleteFeedback(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
              >
                Delete Entry
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
