import { useEffect, useState } from 'react';
import { Users, FileText, Activity, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function Overview() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    totalResults: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [studentsRes, activeStudentsRes, resultsRes, activityRes] = await Promise.all([
        supabase.from('students').select('id', { count: 'exact', head: true }),
        supabase.from('students').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('results').select('id', { count: 'exact', head: true }),
        supabase.from('activity_logs')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      setStats({
        totalStudents: studentsRes.count || 0,
        activeStudents: activeStudentsRes.count || 0,
        totalResults: resultsRes.count || 0,
        recentActivity: activityRes.count || 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'bg-blue-600',
      textColor: 'text-blue-600'
    },
    {
      label: 'Active Students',
      value: stats.activeStudents,
      icon: TrendingUp,
      color: 'bg-green-600',
      textColor: 'text-green-600'
    },
    {
      label: 'Total Results',
      value: stats.totalResults,
      icon: FileText,
      color: 'bg-purple-600',
      textColor: 'text-purple-600'
    },
    {
      label: 'Recent Activity (24h)',
      value: stats.recentActivity,
      icon: Activity,
      color: 'bg-orange-600',
      textColor: 'text-orange-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-left">
            <div className="font-semibold text-gray-900 mb-1">Add Student</div>
            <div className="text-sm text-gray-600">Register a new student</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-50 transition text-left">
            <div className="font-semibold text-gray-900 mb-1">Upload Results</div>
            <div className="text-sm text-gray-600">Add new result entries</div>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-600 hover:bg-purple-50 transition text-left">
            <div className="font-semibold text-gray-900 mb-1">School Settings</div>
            <div className="text-sm text-gray-600">Customize branding</div>
          </button>
        </div>
      </div>
    </div>
  );
}
