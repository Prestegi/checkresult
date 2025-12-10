import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          password_hash: string;
          is_active: boolean;
          created_at: string;
          last_login: string | null;
        };
        Insert: Omit<Database['public']['Tables']['admins']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['admins']['Insert']>;
      };
      students: {
        Row: {
          id: string;
          student_id: string;
          full_name: string;
          email: string | null;
          pin: string;
          class: string;
          is_active: boolean;
          created_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['students']['Insert']>;
      };
      results: {
        Row: {
          id: string;
          student_id: string;
          term: string;
          session: string;
          subjects: Array<{
            name: string;
            score: number;
            grade: string;
            remark: string;
          }>;
          total_score: number;
          average: number;
          position: string | null;
          teacher_comment: string | null;
          principal_comment: string | null;
          attendance_present: number;
          attendance_total: number;
          created_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['results']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['results']['Insert']>;
      };
      school_settings: {
        Row: {
          id: string;
          school_name: string;
          school_address: string;
          school_email: string;
          school_phone: string;
          logo_url: string | null;
          principal_signature_url: string | null;
          primary_color: string;
          secondary_color: string;
          result_template: string;
          watermark_text: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['school_settings']['Row'], 'id' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['school_settings']['Insert']>;
      };
      activity_logs: {
        Row: {
          id: string;
          actor_type: 'admin' | 'student';
          actor_id: string;
          action: string;
          description: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activity_logs']['Row'], 'id' | 'created_at'>;
        Update: never;
      };
    };
  };
};
