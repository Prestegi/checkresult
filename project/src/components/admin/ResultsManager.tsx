import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Database } from '../../lib/supabase';

type Result = Database['public']['Tables']['results']['Row'];
type Student = Database['public']['Tables']['students']['Row'];

export function ResultsManager() {
  const [results, setResults] = useState<(Result & { student?: Student })[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const { admin } = useAuth();

  const [formData, setFormData] = useState({
    student_id: '',
    term: 'First Term',
    session: '2023/2024',
    subjects: [{ name: '', score: 0, grade: '', remark: '' }],
    total_score: 0,
    average: 0,
    position: '',
    teacher_comment: '',
    principal_comment: '',
    attendance_present: 0,
    attendance_total: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resultsRes, studentsRes] = await Promise.all([
        supabase.from('results').select('*').order('created_at', { ascending: false }),
        supabase.from('students').select('*').eq('is_active', true)
      ]);

      if (resultsRes.data && studentsRes.data) {
        const resultsWithStudents = resultsRes.data.map((result) => ({
          ...result,
          student: studentsRes.data.find((s) => s.id === result.student_id)
        }));
        setResults(resultsWithStudents);
        setStudents(studentsRes.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (score: number): string => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const calculateRemark = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Very Good';
    if (score >= 60) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const updateSubject = (index: number, field: string, value: string | number) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index] = { ...newSubjects[index], [field]: value };

    if (field === 'score') {
      const score = Number(value);
      newSubjects[index].grade = calculateGrade(score);
      newSubjects[index].remark = calculateRemark(score);
    }

    const totalScore = newSubjects.reduce((sum, s) => sum + Number(s.score), 0);
    const average = newSubjects.length > 0 ? totalScore / newSubjects.length : 0;

    setFormData({
      ...formData,
      subjects: newSubjects,
      total_score: totalScore,
      average: Math.round(average * 100) / 100
    });
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: '', score: 0, grade: '', remark: '' }]
    });
  };

  const removeSubject = (index: number) => {
    const newSubjects = formData.subjects.filter((_, i) => i !== index);
    const totalScore = newSubjects.reduce((sum, s) => sum + Number(s.score), 0);
    const average = newSubjects.length > 0 ? totalScore / newSubjects.length : 0;

    setFormData({
      ...formData,
      subjects: newSubjects,
      total_score: totalScore,
      average: Math.round(average * 100) / 100
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resultData = {
        student_id: formData.student_id,
        term: formData.term,
        session: formData.session,
        subjects: formData.subjects,
        total_score: formData.total_score,
        average: formData.average,
        position: formData.position,
        teacher_comment: formData.teacher_comment,
        principal_comment: formData.principal_comment,
        attendance_present: formData.attendance_present,
        attendance_total: formData.attendance_total,
        created_by: admin!.id
      };

      if (editingResult) {
        const { error } = await supabase
          .from('results')
          .update(resultData)
          .eq('id', editingResult.id);

        if (error) throw error;

        await supabase.from('activity_logs').insert({
          actor_type: 'admin',
          actor_id: admin!.id,
          action: 'update_result',
          description: `Updated result for ${formData.term} ${formData.session}`,
          metadata: { result_id: editingResult.id }
        });
      } else {
        const { error } = await supabase.from('results').insert(resultData);

        if (error) throw error;

        await supabase.from('activity_logs').insert({
          actor_type: 'admin',
          actor_id: admin!.id,
          action: 'add_result',
          description: `Added result for ${formData.term} ${formData.session}`,
          metadata: { student_id: formData.student_id }
        });
      }

      setShowModal(false);
      setEditingResult(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Failed to save result:', error);
      alert('Failed to save result');
    }
  };

  const handleDelete = async (result: Result) => {
    if (!confirm('Are you sure you want to delete this result?')) return;

    try {
      const { error } = await supabase.from('results').delete().eq('id', result.id);

      if (error) throw error;

      await supabase.from('activity_logs').insert({
        actor_type: 'admin',
        actor_id: admin!.id,
        action: 'delete_result',
        description: `Deleted result for ${result.term} ${result.session}`,
        metadata: { result_id: result.id }
      });

      loadData();
    } catch (error) {
      console.error('Failed to delete result:', error);
      alert('Failed to delete result');
    }
  };

  const handleEdit = (result: Result) => {
    setEditingResult(result);
    setFormData({
      student_id: result.student_id,
      term: result.term,
      session: result.session,
      subjects: result.subjects as any[],
      total_score: result.total_score,
      average: result.average,
      position: result.position || '',
      teacher_comment: result.teacher_comment || '',
      principal_comment: result.principal_comment || '',
      attendance_present: result.attendance_present,
      attendance_total: result.attendance_total
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      student_id: '',
      term: 'First Term',
      session: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
      subjects: [{ name: '', score: 0, grade: '', remark: '' }],
      total_score: 0,
      average: 0,
      position: '',
      teacher_comment: '',
      principal_comment: '',
      attendance_present: 0,
      attendance_total: 0
    });
  };

  const openAddModal = () => {
    setEditingResult(null);
    resetForm();
    setShowModal(true);
  };

  const filteredResults = results.filter(
    (r) =>
      r.student?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.student?.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.session.includes(searchTerm)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Results Management</h1>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Result</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by student name, ID, term, or session..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Term
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Session
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Average
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {result.student?.full_name}
                      </div>
                      <div className="text-xs text-gray-600">{result.student?.student_id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{result.term}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{result.session}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {result.average.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{result.position || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(result)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(result)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredResults.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              {searchTerm ? 'No results found' : 'No results yet'}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingResult ? 'Edit Result' : 'Add New Result'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student *
                  </label>
                  <select
                    value={formData.student_id}
                    onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.full_name} ({student.student_id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Term *</label>
                  <select
                    value={formData.term}
                    onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                    required
                  >
                    <option>First Term</option>
                    <option>Second Term</option>
                    <option>Third Term</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session *</label>
                  <input
                    type="text"
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                    placeholder="2023/2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                    placeholder="1st, 2nd, etc."
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Subjects & Scores</h3>
                  <button
                    type="button"
                    onClick={addSubject}
                    className="text-sm bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition"
                  >
                    + Add Subject
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.subjects.map((subject, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <input
                        type="text"
                        value={subject.name}
                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                        placeholder="Subject name"
                        required
                      />
                      <input
                        type="number"
                        value={subject.score}
                        onChange={(e) => updateSubject(index, 'score', e.target.value)}
                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                        placeholder="Score"
                        min="0"
                        max="100"
                        required
                      />
                      <input
                        type="text"
                        value={subject.grade}
                        className="w-16 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Score:</span>
                      <span className="ml-2 font-bold text-gray-900">{formData.total_score}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Average:</span>
                      <span className="ml-2 font-bold text-gray-900">{formData.average}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days Present
                  </label>
                  <input
                    type="number"
                    value={formData.attendance_present}
                    onChange={(e) =>
                      setFormData({ ...formData, attendance_present: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total School Days
                  </label>
                  <input
                    type="number"
                    value={formData.attendance_total}
                    onChange={(e) =>
                      setFormData({ ...formData, attendance_total: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher's Comment
                </label>
                <textarea
                  value={formData.teacher_comment}
                  onChange={(e) => setFormData({ ...formData, teacher_comment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                  rows={2}
                  placeholder="Enter teacher's comment..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Principal's Comment
                </label>
                <textarea
                  value={formData.principal_comment}
                  onChange={(e) =>
                    setFormData({ ...formData, principal_comment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                  rows={2}
                  placeholder="Enter principal's comment..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  {editingResult ? 'Update' : 'Add'} Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
