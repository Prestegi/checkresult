import { LogIn, GraduationCap } from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: 'admin' | 'student') => void;
}

export function LandingPage({ onSelectRole }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Student Result Management System
        </h1>
        <p className="text-xl text-blue-100 mb-12">
          Secure online result checking and management platform
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <button
            onClick={() => onSelectRole('admin')}
            className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4 group-hover:bg-blue-700 transition">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h2>
            <p className="text-gray-600">
              Manage students, upload results, and customize settings
            </p>
          </button>

          <button
            onClick={() => onSelectRole('student')}
            className="bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 group"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4 group-hover:bg-green-700 transition">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Portal</h2>
            <p className="text-gray-600">
              Check your results, view grades, and download reports
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
