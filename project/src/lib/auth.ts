import { supabase } from './supabase';

export async function loginAdmin(email: string, password: string) {
  const { data: admin, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .eq('password_hash', password)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !admin) {
    throw new Error('Invalid credentials');
  }

  await supabase
    .from('admins')
    .update({ last_login: new Date().toISOString() })
    .eq('id', admin.id);

  await supabase.from('activity_logs').insert({
    actor_type: 'admin',
    actor_id: admin.id,
    action: 'login',
    description: `Admin ${admin.full_name} logged in`,
    metadata: { email: admin.email }
  });

  return admin;
}

export async function loginStudent(studentId: string, pin: string) {
  const { data: student, error } = await supabase
    .from('students')
    .select('*')
    .eq('student_id', studentId)
    .eq('pin', pin)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !student) {
    throw new Error('Invalid student ID or PIN');
  }

  await supabase.from('activity_logs').insert({
    actor_type: 'student',
    actor_id: student.id,
    action: 'login',
    description: `Student ${student.full_name} logged in`,
    metadata: { student_id: student.student_id }
  });

  return student;
}

export function generatePIN(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
