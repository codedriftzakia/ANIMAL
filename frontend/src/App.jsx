import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import AnimalCatalogView from './components/AnimalCatalogView';
import FeedbackExplorerView from './components/FeedbackExplorerView';
import FeedbackFormModal from './components/FeedbackFormModal';
import UserRegistrationModal from './components/UserRegistrationModal';
import AnimalDetailModal from './components/AnimalDetailModal';
import ToastNotification from './components/ToastNotification';
import { 
  fetchHealth, fetchAnimals, fetchFeedbacks, fetchAnalyticsSummary, 
  submitFeedback, updateFeedbackStatus, deleteFeedback 
} from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [dbStatus, setDbStatus] = useState('connected');

  // Registered User Session State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('faunapulse_registered_user');
    return saved ? JSON.parse(saved) : null;
  });

  // State Data
  const [animals, setAnimals] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [initialAnimalForForm, setInitialAnimalForForm] = useState(null);
  const [selectedAnimalForDetail, setSelectedAnimalForDetail] = useState(null);
  const [pendingAnimalTarget, setPendingAnimalTarget] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Initial Data Load
  const loadAppData = async () => {
    setLoading(true);
    try {
      const healthRes = await fetchHealth();
      setDbStatus(healthRes.dbStatus || 'connected');

      const [animalsRes, feedbacksRes, analyticsRes] = await Promise.all([
        fetchAnimals(),
        fetchFeedbacks(),
        fetchAnalyticsSummary(),
      ]);

      if (animalsRes && animalsRes.data) setAnimals(animalsRes.data);
      if (feedbacksRes && feedbacksRes.data) setFeedbacks(feedbacksRes.data);
      if (analyticsRes && analyticsRes.data) setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error loading application data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppData();
  }, []);

  // Handlers
  const handleOpenSubmitModal = (animal = null) => {
    // REQUIRE USER REGISTRATION FIRST IF NOT REGISTERED
    if (!currentUser) {
      setPendingAnimalTarget(animal);
      setIsRegisterModalOpen(true);
      showToast('Please register your profile before writing feedback', 'info');
      return;
    }

    if (animal) {
      setInitialAnimalForForm(animal._id);
    } else {
      setInitialAnimalForForm(null);
    }
    setIsSubmitModalOpen(true);
  };

  const handleRegisterSuccess = (registeredUserData) => {
    setCurrentUser(registeredUserData);
    localStorage.setItem('faunapulse_registered_user', JSON.stringify(registeredUserData));
    setIsRegisterModalOpen(false);
    showToast(`Welcome, ${registeredUserData.name}! Registration complete.`, 'success');

    // Automatically transition to writing feedback
    if (pendingAnimalTarget) {
      setInitialAnimalForForm(pendingAnimalTarget._id);
      setPendingAnimalTarget(null);
    }
    setIsSubmitModalOpen(true);
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      const payload = {
        ...feedbackData,
        userName: feedbackData.userName || currentUser?.name || 'Registered Supporter',
        userRole: feedbackData.userRole || currentUser?.role || 'Visitor',
      };
      const res = await submitFeedback(payload);
      if (res && res.success) {
        showToast('Feedback submitted & animal welfare score recalculated!', 'success');
        await loadAppData();
      }
    } catch (err) {
      showToast('Failed to submit feedback', 'error');
    }
  };

  const handleUpdateFeedbackStatus = async (id, status, staffNote) => {
    try {
      const res = await updateFeedbackStatus(id, status, staffNote);
      if (res && res.success) {
        showToast(`Feedback status updated to "${status}"!`, 'success');
        await loadAppData();
      }
    } catch (err) {
      showToast('Failed to update feedback status', 'error');
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      const res = await deleteFeedback(id);
      if (res && res.success) {
        showToast('Feedback record deleted and welfare score recalculated', 'success');
        await loadAppData();
      }
    } catch (err) {
      showToast('Failed to delete feedback', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        dbStatus={dbStatus}
        currentUser={currentUser}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenSubmitModal={() => handleOpenSubmitModal()}
      />

      {/* Main Views Router */}
      <main>
        {loading ? (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Loading FaunaPulse Intelligence Platform...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                analytics={analytics}
                animals={animals}
                onSelectAnimal={(animal) => setSelectedAnimalForDetail(animal)}
                onOpenSubmitModal={() => handleOpenSubmitModal()}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'animals' && (
              <AnimalCatalogView
                animals={animals}
                onSelectAnimal={(animal) => setSelectedAnimalForDetail(animal)}
                onOpenFeedbackForAnimal={(animal) => handleOpenSubmitModal(animal)}
              />
            )}

            {activeTab === 'feedback' && (
              <FeedbackExplorerView
                feedbacks={feedbacks}
                animals={animals}
                onUpdateStatus={handleUpdateFeedbackStatus}
                onDeleteFeedback={handleDeleteFeedback}
                onOpenSubmitModal={() => handleOpenSubmitModal()}
              />
            )}
          </>
        )}
      </main>

      {/* User Registration Modal */}
      {isRegisterModalOpen && (
        <UserRegistrationModal
          onClose={() => setIsRegisterModalOpen(false)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {/* Submit Feedback Modal */}
      {isSubmitModalOpen && (
        <FeedbackFormModal
          animals={animals}
          initialAnimalId={initialAnimalForForm}
          currentUser={currentUser}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmit={handleSubmitFeedback}
        />
      )}

      {/* Animal Detail Modal */}
      {selectedAnimalForDetail && (
        <AnimalDetailModal
          animal={selectedAnimalForDetail}
          onClose={() => setSelectedAnimalForDetail(null)}
          onOpenFeedback={(animal) => {
            setSelectedAnimalForDetail(null);
            handleOpenSubmitModal(animal);
          }}
        />
      )}

      {/* Floating Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
