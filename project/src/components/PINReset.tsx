import { useState } from 'react';
import { ArrowLeft, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { generatePIN } from '../lib/auth';

interface PINResetProps {
  onBack: () => void;
}

export function PINReset({ onBack }: PINResetProps) {
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newPIN, setNewPIN] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const { data: student, error: fetchError } = await supabase
        .from('students')
        .select('*')
        .eq('student_id', studentId)
        .eq('email', email)
        .eq('is_active', true)
        .maybeSingle();

      if (fetchError || !student) {
        throw new Error('Invalid student ID or email');
      }

      const pin = generatePIN();

      const { error: updateError } = await supabase
        .from('students')
        .update({ pin })
        .eq('id', student.id);

      if (updateError) throw updateError;

      await supabase.from('activity_logs').insert({
        actor_type: 'student',
        actor_id: student.id,
        action: 'reset_pin',
        description: `PIN reset requested for ${student.full_name}`,
        metadata: { student_id: student.student_id }
      });

      setNewPIN(pin);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Reset PIN</h1>
          <p className="text-gray-600 mt-2">Enter your details to reset your PIN</p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <div className="text-green-600 font-semibold mb-2">PIN Reset Successful!</div>
              <div className="text-gray-900 mb-4">Your new PIN is:</div>
              <div className="text-4xl font-bold text-green-600 mb-4">{newPIN}</div>
              <div className="text-sm text-gray-600">
                Please save this PIN securely. You can now use it to log in.
              </div>
            </div>
            <button
              onClick={onBack}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
                placeholder="Enter your Student ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registered Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting...' : 'Reset PIN'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
