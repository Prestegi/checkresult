import { useEffect, useState } from 'react';
import { LogOut, FileText, Download, Filter } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/supabase';
import { ResultCard } from './ResultCard';

type Result = Database['public']['Tables']['results']['Row'];
type SchoolSettings = Database['public']['Tables']['school_settings']['Row'];

export function StudentPortal() {
  const [results, setResults] = useState<Result[]>([]);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [filterTerm, setFilterTerm] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const { student, logout } = useAuth();

  useEffect(() => {
    loadData();
  }, [student]);

  const loadData = async () => {
    if (!student) return;

    try {
      const [resultsRes, settingsRes] = await Promise.all([
        supabase
          .from('results')
          .select('*')
          .eq('student_id', student.id)
          .order('created_at', { ascending: false }),
        supabase.from('school_settings').select('*').maybeSingle()
      ]);

      if (resultsRes.data) setResults(resultsRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((r) => {
    const matchesTerm = r.term.toLowerCase().includes(filterTerm.toLowerCase());
    const matchesSession = filterSession === '' || r.session === filterSession;
    return matchesTerm && matchesSession;
  });

  const sessions = Array.from(new Set(results.map((r) => r.session)));

  if (selectedResult && settings) {
    return (
      <ResultCard
        result={selectedResult}
        student={student!}
        settings={settings}
        onBack={() => setSelectedResult(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {settings?.logo_url && (
                <img
                  src={settings.logo_url}
                  alt="School Logo"
                  className="h-12 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {settings?.school_name || 'Student Portal'}
                </h1>
                <p className="text-sm text-gray-600">{student?.full_name}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Results</h2>
          <p className="text-gray-600">View and download your academic results</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Filter by term..."
                value={filterTerm}
                onChange={(e) => setFilterTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
              />
            </div>

            <select
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none bg-white"
            >
              <option value="">All Sessions</option>
              {sessions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading your results...</div>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">
              {filterTerm || filterSession
                ? 'Try adjusting your filters'
                : 'Your results will appear here once uploaded by your school'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedResult(result)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{result.term}</h3>
                    <p className="text-sm text-gray-600">{result.session}</p>
                  </div>
                  <FileText className="w-8 h-8 text-green-600" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Score:</span>
                    <span className="text-lg font-bold text-gray-900">{result.total_score}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average:</span>
                    <span className="text-lg font-bold text-green-600">
                      {result.average.toFixed(2)}%
                    </span>
                  </div>

                  {result.position && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Position:</span>
                      <span className="text-sm font-semibold text-gray-900">{result.position}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Subjects:</span>
                    <span>{(result.subjects as any[]).length}</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>View Result</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
