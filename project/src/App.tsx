import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { AdminLogin } from './components/AdminLogin';
import { StudentLogin } from './components/StudentLogin';
import { PINReset } from './components/PINReset';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentPortal } from './components/student/StudentPortal';

type View = 'landing' | 'admin-login' | 'student-login' | 'pin-reset';

function AppContent() {
  const [view, setView] = useState<View>('landing');
  const { admin, student } = useAuth();

  if (admin) {
    return <AdminDashboard />;
  }

  if (student) {
    return <StudentPortal />;
  }

  if (view === 'admin-login') {
    return <AdminLogin />;
  }

  if (view === 'student-login') {
    return (
      <div>
        <StudentLogin />
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => setView('pin-reset')}
            className="text-sm text-green-600 hover:text-green-700 font-medium bg-white px-6 py-2 rounded-lg shadow-md"
          >
            Forgot your PIN?
          </button>
        </div>
      </div>
    );
  }

  if (view === 'pin-reset') {
    return <PINReset onBack={() => setView('student-login')} />;
  }

  return (
    <LandingPage
      onSelectRole={(role) => {
        if (role === 'admin') {
          setView('admin-login');
        } else {
          setView('student-login');
        }
      }}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
