import React, { useState } from 'react';
import { Search, Filter, Heart, PlusCircle, ChevronRight, Activity, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

export default function AnimalCatalogView({ animals, onSelectAnimal, onOpenFeedbackForAnimal }) {
  const [search, setSearch] = useState('');
  const [selectedHabitat, setSelectedHabitat] = useState('All');
  const [selectedCareTier, setSelectedCareTier] = useState('All');

  // Habitat options extracted from animals list
  const habitats = ['All', ...Array.from(new Set(animals.map((a) => a.habitat)))];
  const careTiers = ['All', 'Critical', 'High Attention', 'Standard', 'Optimal'];

  // Filter animals logic
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(search.toLowerCase()) ||
      animal.species.toLowerCase().includes(search.toLowerCase()) ||
      animal.tagline?.toLowerCase().includes(search.toLowerCase());

    const matchesHabitat = selectedHabitat === 'All' || animal.habitat === selectedHabitat;
    const matchesCareTier = selectedCareTier === 'All' || animal.careTier === selectedCareTier;

    return matchesSearch && matchesHabitat && matchesCareTier;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Filter Controls Bar */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Sanctuary Animal Catalog</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Select an animal profile to view health metrics, past reviews, or log new feedback.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                type="text"
                placeholder="Search animal or species..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem 0.6rem 2.4rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {/* Habitat Select */}
            <select
              value={selectedHabitat}
              onChange={(e) => setSelectedHabitat(e.target.value)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Habitats</option>
              {habitats.filter((h) => h !== 'All').map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>

            {/* Care Tier Select */}
            <select
              value={selectedCareTier}
              onChange={(e) => setSelectedCareTier(e.target.value)}
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Care Tiers</option>
              {careTiers.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

          </div>
        </div>
      </div>

      {/* Animal Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredAnimals.map((animal) => {
          const getCareColor = (tier) => {
            switch (tier) {
              case 'Critical': return '#ef4444';
              case 'High Attention': return '#f59e0b';
              case 'Standard': return '#6366f1';
              case 'Optimal': return '#10b981';
              default: return '#10b981';
            }
          };

          return (
            <div
              key={animal._id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                overflow: 'hidden',
              }}
            >
              {/* Image & Badges Overlay */}
              <div style={{ height: '210px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={animal.imageUrl}
                  alt={animal.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                {/* Health Index Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}>
                  <Heart size={14} fill={animal.healthIndex > 80 ? '#10b981' : '#f59e0b'} color={animal.healthIndex > 80 ? '#10b981' : '#f59e0b'} />
                  <span>Welfare: {animal.healthIndex}/100</span>
                </div>

                {/* Care Tier Tag */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: getCareColor(animal.careTier),
                  color: '#ffffff',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  {animal.careTier}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{animal.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={14} color="#10b981" /> {animal.species} • {animal.habitat}
                      </p>
                    </div>
                    <span className="badge badge-positive">{animal.mood}</span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', margin: '0.75rem 0', fontStyle: 'italic' }}>
                    "{animal.tagline || animal.bio.slice(0, 80) + '...'}"
                  </p>
                </div>

                {/* Health Progress Bar */}
                <div style={{ margin: '0.75rem 0 1.25rem 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                    <span>Health Index</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{animal.healthIndex}%</span>
                  </div>
                  <div style={{ background: 'var(--border-color)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${animal.healthIndex}%`,
                      height: '100%',
                      background: getCareColor(animal.careTier),
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => onSelectAnimal(animal)}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                  >
                    <span>View Profile</span>
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => onOpenFeedbackForAnimal(animal)}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                  >
                    <PlusCircle size={15} />
                    <span>Feedback</span>
                  </button>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {filteredAnimals.length === 0 && (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>No animals found matching your search criteria.</p>
        </div>
      )}

    </div>
  );
}
