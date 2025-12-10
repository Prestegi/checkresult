import { ArrowLeft, Download, Printer } from 'lucide-react';
import { Database } from '../../lib/supabase';

type Result = Database['public']['Tables']['results']['Row'];
type Student = Database['public']['Tables']['students']['Row'];
type SchoolSettings = Database['public']['Tables']['school_settings']['Row'];

interface ResultCardProps {
  result: Result;
  student: Student;
  settings: SchoolSettings;
  onBack: () => void;
}

export function ResultCard({ result, student, settings, onBack }: ResultCardProps) {
  const subjects = result.subjects as Array<{
    name: string;
    score: number;
    grade: string;
    remark: string;
  }>;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const getTemplateStyles = () => {
    switch (settings.result_template) {
      case 'classic':
        return {
          headerBg: 'bg-gray-800',
          accentColor: 'border-gray-600',
          headerText: 'text-white'
        };
      case 'minimal':
        return {
          headerBg: 'bg-white border-b-2',
          accentColor: 'border-gray-300',
          headerText: 'text-gray-900'
        };
      default:
        return {
          headerBg: `bg-[${settings.primary_color}]`,
          accentColor: `border-[${settings.primary_color}]`,
          headerText: 'text-white'
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="no-print bg-white shadow-sm border-b px-4 py-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Results</span>
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg print:shadow-none print:rounded-none relative overflow-hidden">
          {settings.watermark_text && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 print:opacity-10">
              <div className="text-8xl font-bold text-gray-500 rotate-[-45deg]">
                {settings.watermark_text}
              </div>
            </div>
          )}

          <div
            className={`${styles.headerBg} ${styles.headerText} p-8 text-center relative z-10`}
            style={{
              backgroundColor:
                settings.result_template === 'modern' ? settings.primary_color : undefined
            }}
          >
            {settings.logo_url && (
              <img
                src={settings.logo_url}
                alt="School Logo"
                className="h-20 mx-auto mb-4 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <h1 className="text-3xl font-bold mb-2">{settings.school_name}</h1>
            {settings.school_address && (
              <p className="text-sm opacity-90">{settings.school_address}</p>
            )}
            {(settings.school_phone || settings.school_email) && (
              <p className="text-sm opacity-90 mt-1">
                {settings.school_phone} {settings.school_phone && settings.school_email && '|'}{' '}
                {settings.school_email}
              </p>
            )}
            <div className="mt-4 text-xl font-semibold">STUDENT RESULT CARD</div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="mb-4">
                  <label className="text-sm text-gray-600 font-medium">Student Name:</label>
                  <div className="text-lg font-bold text-gray-900">{student.full_name}</div>
                </div>
                <div className="mb-4">
                  <label className="text-sm text-gray-600 font-medium">Student ID:</label>
                  <div className="text-lg font-bold text-gray-900">{student.student_id}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Class:</label>
                  <div className="text-lg font-bold text-gray-900">{student.class}</div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="text-sm text-gray-600 font-medium">Term:</label>
                  <div className="text-lg font-bold text-gray-900">{result.term}</div>
                </div>
                <div className="mb-4">
                  <label className="text-sm text-gray-600 font-medium">Session:</label>
                  <div className="text-lg font-bold text-gray-900">{result.session}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 font-medium">Position:</label>
                  <div className="text-lg font-bold text-gray-900">{result.position || 'N/A'}</div>
                </div>
              </div>
            </div>

            <div
              className={`border-2 ${styles.accentColor} rounded-lg overflow-hidden mb-6`}
              style={{
                borderColor:
                  settings.result_template === 'modern' ? settings.primary_color : undefined
              }}
            >
              <table className="w-full">
                <thead
                  className={`${styles.headerBg} ${styles.headerText}`}
                  style={{
                    backgroundColor:
                      settings.result_template === 'modern' ? settings.primary_color : undefined
                  }}
                >
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Subject</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Score</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Grade</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subjects.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{subject.name}</td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-900">
                        {subject.score}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-gray-900">
                        {subject.grade}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{subject.remark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Total Score</div>
                <div className="text-3xl font-bold text-gray-900">{result.total_score}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Average Score</div>
                <div
                  className="text-3xl font-bold"
                  style={{ color: settings.primary_color }}
                >
                  {result.average.toFixed(2)}%
                </div>
              </div>
            </div>

            {(result.attendance_present > 0 || result.attendance_total > 0) && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-2">Attendance</div>
                <div className="text-gray-900">
                  Present: <span className="font-bold">{result.attendance_present}</span> out of{' '}
                  <span className="font-bold">{result.attendance_total}</span> days
                </div>
              </div>
            )}

            {result.teacher_comment && (
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Class Teacher's Comment
                </div>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-gray-900 italic">{result.teacher_comment}</p>
                </div>
              </div>
            )}

            {result.principal_comment && (
              <div className="mb-6">
                <div className="text-sm font-semibold text-gray-700 mb-2">
                  Principal's Comment
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                  <p className="text-gray-900 italic">{result.principal_comment}</p>
                </div>
              </div>
            )}

            {settings.principal_signature_url && (
              <div className="mt-8 flex justify-end">
                <div className="text-center">
                  <img
                    src={settings.principal_signature_url}
                    alt="Principal Signature"
                    className="h-16 mb-2 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="border-t-2 border-gray-800 pt-2">
                    <div className="text-sm font-semibold text-gray-900">Principal's Signature</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-100 px-8 py-4 text-center text-sm text-gray-600">
            Generated on {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>

      <style>
        {`
          @media print {
            body {
              background: white;
            }
            .no-print {
              display: none !important;
            }
            .print\\:shadow-none {
              box-shadow: none !important;
            }
            .print\\:rounded-none {
              border-radius: 0 !important;
            }
            .print\\:opacity-10 {
              opacity: 0.1 !important;
            }
          }
        `}
      </style>
    </div>
  );
}
