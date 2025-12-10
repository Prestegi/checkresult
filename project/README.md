# Student Result Management System

A comprehensive web-based platform for managing and viewing student academic results. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Admin Portal
- **Dashboard Overview**: View statistics on students, results, and recent activity
- **Student Management**: Add, edit, delete, and search students with auto-generated PINs
- **Result Management**: Upload and manage student results with detailed subject scores
- **School Settings**: Customize school branding (logo, signature, colors, templates)
- **Activity Logs**: Track all system activities with detailed filtering

### Student Portal
- **Secure Login**: Students access results using Student ID + PIN
- **View Results**: Filter results by term and session
- **Download/Print**: Professional result cards with school branding
- **PIN Reset**: Self-service PIN reset using registered email

### Result Cards
- **Customizable Templates**: Modern, Classic, and Minimal styles
- **School Branding**: Automatic inclusion of logo and principal signature
- **Professional Layout**: Detailed subject scores, grades, comments, and attendance
- **PDF Export**: Print-ready result cards with watermark support

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account

### Database Setup

The database is automatically configured with:
- `admins` - Admin user accounts
- `students` - Student records with PINs
- `results` - Academic results with subject details
- `school_settings` - School branding and customization
- `activity_logs` - System activity tracking

### Default Admin Credentials

```
Email: admin@school.com
Password: admin123
```

**Important**: Change the default password after first login in a production environment.

## Usage Guide

### Admin Workflow

1. **Login** as admin using default credentials
2. **Configure School Settings**:
   - Add school name, address, contact info
   - Upload school logo and principal signature
   - Set primary/secondary colors
   - Choose result template style
3. **Add Students**:
   - Enter student details (ID, name, class)
   - System auto-generates secure PIN
   - Set account status (Active/Disabled)
4. **Upload Results**:
   - Select student and academic term/session
   - Add subjects with scores (grades auto-calculated)
   - Include teacher and principal comments
   - Record attendance information
5. **Monitor Activity**:
   - View all system activities in Activity Logs
   - Filter by user type (admin/student)
   - Track logins, additions, updates, deletions

### Student Workflow

1. **Login** using Student ID and PIN
2. **View Results** organized by term and session
3. **Click on any result** to view detailed report card
4. **Download/Print** result card as PDF
5. **Reset PIN** if forgotten using registered email

## Key Features Explained

### Auto-Generated PINs
- 4-digit PINs automatically generated for new students
- Admins can regenerate PINs anytime
- Secure PIN reset via email verification

### Grade Calculation
- Automatic grade assignment based on scores:
  - 90-100: A+
  - 80-89: A
  - 70-79: B
  - 60-69: C
  - 50-59: D
  - Below 50: F
- Automatic calculation of total score and average

### Result Templates
- **Modern**: Colored header with school primary color
- **Classic**: Traditional gray/black styling
- **Minimal**: Clean white design with minimal styling

### Activity Logging
All actions are automatically logged:
- Admin login
- Student login
- Add/Update/Delete operations
- Settings changes
- PIN resets

## Database Schema

### Students Table
- Student ID (unique)
- Full name, email, class
- PIN for login
- Active/Disabled status

### Results Table
- Student reference
- Term and session
- Subjects (JSON array)
- Total score and average
- Position, comments, attendance

### School Settings Table
- School information
- Logo and signature URLs
- Color scheme
- Template style
- Watermark text

### Activity Logs Table
- Actor (admin/student)
- Action performed
- Description
- Timestamp and metadata

## Security Features

- Row Level Security (RLS) enabled on all tables
- Students can only view their own results
- Admins have full CRUD permissions
- Session-based authentication
- Activity logging for audit trail

## Customization

### Colors
Customize your school colors in Settings:
- Primary color (headers, accents)
- Secondary color (supporting elements)

### Result Templates
Choose from three template styles:
- Modern (colorful)
- Classic (traditional)
- Minimal (clean)

### Watermarks
Add optional watermarks to result cards (e.g., "CONFIDENTIAL")

## Support

For issues or questions, contact your system administrator.

## License

This software is proprietary. All rights reserved.
