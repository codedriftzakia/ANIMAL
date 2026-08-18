const API_BASE = '/api';

let localUsers = [];

export async function registerUser(userData) {
  try {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userData.name, role: userData.role }),
    });
    if (!res.ok) throw new Error('Registration failed');
    return await res.json();
  } catch (err) {
    console.warn('API error, using local registration fallback:', err.message);
    const newReg = {
      _id: `user_${Date.now()}`,
      name: userData.name,
      role: userData.role || 'Visitor',
      createdAt: new Date().toISOString(),
    };
    localUsers.push(newReg);
    return { success: true, data: newReg };
  }
}

// Fallback Mock Data for instant offline/standalone support
const MOCK_ANIMALS = [
  {
    _id: 'anim_1',
    name: 'Barnaby',
    species: 'Golden Retriever',
    habitat: 'Rescue & Rehabilitation Center',
    careTier: 'Optimal',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    healthIndex: 94,
    mood: 'Vibrant',
    feedbackCount: 3,
    avgRating: 4.9,
    tagline: 'Gentle therapy dog and shelter favorite',
    bio: 'Barnaby is a 4-year-old rescued Golden Retriever who brings joy to visitors and therapy patients daily.',
  },
  {
    _id: 'anim_2',
    name: 'Kira',
    species: 'Red Panda',
    habitat: 'High Canopy Sanctuary',
    careTier: 'Standard',
    imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
    healthIndex: 88,
    mood: 'Playful',
    feedbackCount: 2,
    avgRating: 4.4,
    tagline: 'Agile canopy climber with a penchant for bamboo shoots',
    bio: 'Kira spends most of her mornings scaling cedar trees and eating fresh bamboo leaves in her high canopy enclosure.',
  },
  {
    _id: 'anim_3',
    name: 'Milo',
    species: 'Capybara',
    habitat: 'Wetland Oasis',
    careTier: 'Optimal',
    imageUrl: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80',
    healthIndex: 91,
    mood: 'Calm',
    feedbackCount: 2,
    avgRating: 4.8,
    tagline: 'The epitome of tranquility and social harmony',
    bio: 'Milo is the peaceful heart of the Wetland exhibit. He shares his habitat effortlessly with ducks and turtles.',
  },
  {
    _id: 'anim_4',
    name: 'Aria',
    species: 'Snow Leopard',
    habitat: 'Alpine Cliff Habitat',
    careTier: 'High Attention',
    imageUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80',
    healthIndex: 78,
    mood: 'Reserved',
    feedbackCount: 1,
    avgRating: 3.5,
    tagline: 'Majestic mountain predator undergoing welfare tracking',
    bio: 'Aria requires continuous environmental enrichment and stealth agility puzzles to simulate alpine hunting.',
  },
];

let localFeedbacks = [
  {
    _id: 'fb_1',
    animalId: { _id: 'anim_1', name: 'Barnaby', species: 'Golden Retriever', imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80' },
    userName: 'Dr. Sarah Jenkins',
    userRole: 'Veterinarian',
    ratings: { overall: 5, welfare: 5, enclosure: 5, interaction: 5 },
    tags: ['Active & Playful', 'Clean Habitat'],
    comment: 'Barnaby passed his quarterly health examination with flying colors! High energy, clear coat, excellent weight.',
    sentiment: 'POSITIVE',
    status: 'Highlighted',
    createdAt: new Date().toISOString(),
  },
];

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('API server unreachable');
    return await res.json();
  } catch {
    return { status: 'offline', dbStatus: 'local fallback' };
  }
}

export async function fetchAnimals(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/animals?${query}`);
    if (!res.ok) throw new Error('Failed to fetch animals');
    return await res.json();
  } catch (err) {
    console.warn('API error, using local fallback:', err.message);
    return { success: true, count: MOCK_ANIMALS.length, data: MOCK_ANIMALS };
  }
}

export async function fetchAnimalById(id) {
  try {
    const res = await fetch(`${API_BASE}/animals/${id}`);
    if (!res.ok) throw new Error('Failed to fetch animal');
    return await res.json();
  } catch (err) {
    const animal = MOCK_ANIMALS.find((a) => a._id === id) || MOCK_ANIMALS[0];
    const feedbacks = localFeedbacks.filter((f) => f.animalId._id === id);
    return { success: true, data: { ...animal, feedbacks } };
  }
}

export async function fetchFeedbacks(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/feedback?${query}`);
    if (!res.ok) throw new Error('Failed to fetch feedback');
    return await res.json();
  } catch (err) {
    return { success: true, count: localFeedbacks.length, data: localFeedbacks };
  }
}

export async function submitFeedback(data) {
  try {
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit feedback');
    return await res.json();
  } catch (err) {
    const targetAnimal = MOCK_ANIMALS.find((a) => a._id === data.animalId) || MOCK_ANIMALS[0];
    const newFb = {
      _id: `fb_${Date.now()}`,
      animalId: { _id: targetAnimal._id, name: targetAnimal.name, species: targetAnimal.species, imageUrl: targetAnimal.imageUrl },
      userName: data.userName || 'Anonymous',
      userRole: data.userRole || 'Visitor',
      ratings: data.ratings,
      tags: data.tags || [],
      comment: data.comment,
      imageUrl: data.imageUrl || '',
      isUrgent: Boolean(data.isUrgent),
      sentiment: data.isUrgent ? 'URGENT ALERT' : 'POSITIVE',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    localFeedbacks.unshift(newFb);
    return { success: true, data: newFb };
  }
}

export async function updateFeedbackStatus(id, status, staffNote) {
  try {
    const res = await fetch(`${API_BASE}/feedback/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, staffNote }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return await res.json();
  } catch (err) {
    const item = localFeedbacks.find((f) => f._id === id);
    if (item) {
      item.status = status;
      if (staffNote !== undefined) item.staffNote = staffNote;
    }
    return { success: true, data: item };
  }
}

export async function deleteFeedback(id) {
  try {
    const res = await fetch(`${API_BASE}/feedback/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete feedback');
    return await res.json();
  } catch (err) {
    localFeedbacks = localFeedbacks.filter((f) => f._id !== id);
    return { success: true, message: 'Deleted locally' };
  }
}

export async function uploadImage(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return await res.json();
  } catch (err) {
    // Local FileReader Base64 preview
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ success: true, url: reader.result });
      };
      reader.readAsDataURL(file);
    });
  }
}

export async function fetchAnalyticsSummary() {
  try {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  } catch (err) {
    return {
      success: true,
      data: {
        summary: {
          totalAnimals: MOCK_ANIMALS.length,
          totalFeedback: localFeedbacks.length,
          urgentAlertsCount: localFeedbacks.filter((f) => f.sentiment === 'URGENT ALERT').length,
          avgWelfareScore: 88,
        },
        sentimentDistribution: { positive: 5, neutral: 1, urgent: 1 },
        statusDistribution: { pending: 2, underReview: 1, resolved: 3, highlighted: 1 },
        recentUrgentAlerts: localFeedbacks.filter((f) => f.sentiment === 'URGENT ALERT'),
      },
    };
  }
}
