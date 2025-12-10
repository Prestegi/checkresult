import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Activity,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { StudentsManager } from './StudentsManager';
import { ResultsManager } from './ResultsManager';
import { SchoolSettings } from './SchoolSettings';
import { ActivityLogs } from './ActivityLogs';
import { Overview } from './Overview';

type Tab = 'overview' | 'students' | 'results' | 'settings' | 'logs';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { admin, logout } = useAuth();

  const navigation = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'results', label: 'Results', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logs', label: 'Activity Logs', icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Admin Panel</h2>
              <p className="text-xs text-gray-600">{admin?.full_name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'students' && <StudentsManager />}
          {activeTab === 'results' && <ResultsManager />}
          {activeTab === 'settings' && <SchoolSettings />}
          {activeTab === 'logs' && <ActivityLogs />}
        </div>
      </main>
    </div>
  );
}
