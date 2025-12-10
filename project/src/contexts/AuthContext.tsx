import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Database } from '../lib/supabase';

type Admin = Database['public']['Tables']['admins']['Row'];
type Student = Database['public']['Tables']['students']['Row'];

interface AuthContextType {
  admin: Admin | null;
  student: Student | null;
  userType: 'admin' | 'student' | null;
  setAdmin: (admin: Admin | null) => void;
  setStudent: (student: Student | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdminState] = useState<Admin | null>(null);
  const [student, setStudentState] = useState<Student | null>(null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    const savedStudent = localStorage.getItem('student');

    if (savedAdmin) {
      setAdminState(JSON.parse(savedAdmin));
    }
    if (savedStudent) {
      setStudentState(JSON.parse(savedStudent));
    }
  }, []);

  const setAdmin = (admin: Admin | null) => {
    setAdminState(admin);
    if (admin) {
      localStorage.setItem('admin', JSON.stringify(admin));
      localStorage.removeItem('student');
      setStudentState(null);
    } else {
      localStorage.removeItem('admin');
    }
  };

  const setStudent = (student: Student | null) => {
    setStudentState(student);
    if (student) {
      localStorage.setItem('student', JSON.stringify(student));
      localStorage.removeItem('admin');
      setAdminState(null);
    } else {
      localStorage.removeItem('student');
    }
  };

  const logout = () => {
    setAdminState(null);
    setStudentState(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('student');
  };

  const userType = admin ? 'admin' : student ? 'student' : null;

  return (
    <AuthContext.Provider value={{ admin, student, userType, setAdmin, setStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
