# System Setup Guide

## Quick Start

### 1. Admin Access
Login to the admin portal using:
- **Email**: `admin@school.com`
- **Password**: `admin123`

### 2. First Steps After Login

#### Configure School Settings
1. Navigate to "Settings" tab
2. Update school information:
   - School Name
   - Address, Email, Phone
   - Upload school logo (provide URL)
   - Upload principal signature (provide URL)
   - Set colors (default: blue theme)
   - Choose template style

#### Add Sample Students
Here are some sample students you can add:

**Student 1:**
- Student ID: `STU001`
- Name: `John Doe`
- Email: `john@example.com`
- Class: `Grade 10A`
- PIN: `1234` (auto-generated, you can change)

**Student 2:**
- Student ID: `STU002`
- Name: `Jane Smith`
- Email: `jane@example.com`
- Class: `Grade 10A`
- PIN: `5678` (auto-generated)

**Student 3:**
- Student ID: `STU003`
- Name: `Mike Johnson`
- Email: `mike@example.com`
- Class: `Grade 11B`
- PIN: `9012` (auto-generated)

#### Upload Sample Results

For testing, add results for Student 1:
- **Term**: First Term
- **Session**: 2023/2024
- **Subjects**:
  - Mathematics: 85 (Grade: A, Remark: Excellent)
  - English: 78 (Grade: B, Remark: Very Good)
  - Science: 92 (Grade: A+, Remark: Excellent)
  - History: 70 (Grade: B, Remark: Very Good)
  - Geography: 88 (Grade: A, Remark: Excellent)
- **Position**: 1st
- **Attendance**: 90 out of 100 days
- **Teacher's Comment**: "Excellent performance. Keep it up!"
- **Principal's Comment**: "Outstanding student with great potential."

## Testing Student Login

### Test Student Access:
1. Logout from admin
2. Select "Student Portal"
3. Login with:
   - Student ID: `STU001`
   - PIN: `1234`
4. View the uploaded result
5. Click to view detailed result card
6. Test print/download functionality

### Test PIN Reset:
1. Click "Forgot your PIN?"
2. Enter:
   - Student ID: `STU001`
   - Email: `john@example.com`
3. Note the new PIN displayed
4. Test login with new PIN

## Adding Images

### For School Logo:
Upload your school logo to an image hosting service and use the URL in Settings.

Example free image hosting:
- [Imgur](https://imgur.com)
- [Cloudinary](https://cloudinary.com)
- Use Supabase Storage (recommended)

### For Principal Signature:
Same process as logo. You can use a digital signature or scanned signature image.

## Customization Tips

### Color Schemes
Popular school color combinations:
- **Traditional**: Primary: `#1e3a8a` (Blue), Secondary: `#1e40af`
- **Modern**: Primary: `#059669` (Green), Secondary: `#047857`
- **Professional**: Primary: `#7c3aed` (Purple), Secondary: `#6d28d9`
- **Elegant**: Primary: `#dc2626` (Red), Secondary: `#b91c1c`

### Result Templates
- **Modern**: Best for contemporary schools with bold branding
- **Classic**: Traditional look suitable for established institutions
- **Minimal**: Clean design for modern, minimalist approach

## Bulk Upload (Coming Soon)

For schools with many students/results, consider implementing:
1. CSV import for students
2. Excel import for results
3. Batch PIN generation

Current version supports manual entry through the UI.

## Production Deployment

Before deploying to production:

1. **Change Admin Password**
   - Update admin password from default
   - Use strong password policy

2. **Secure Environment Variables**
   - Keep Supabase credentials private
   - Use environment-specific configs

3. **Enable Email Notifications**
   - Configure email service for PIN resets
   - Send result upload notifications

4. **Backup Database**
   - Regular backups of student/result data
   - Test restore procedures

5. **SSL Certificate**
   - Ensure HTTPS is enabled
   - Use secure connection only

## Troubleshooting

### Students Can't Login
- Verify student account is Active
- Check Student ID and PIN are correct
- Ensure student has not been deleted

### Results Not Showing
- Verify result was uploaded successfully
- Check student ID matches exactly
- Confirm term/session filters

### Images Not Loading
- Verify image URLs are accessible
- Check URL format is correct
- Ensure CORS is enabled on image host

### Activity Logs Empty
- Logs only show last 100 entries
- Check date filters
- Verify actions have been performed

## Support Contacts

For technical issues:
- Check Activity Logs for error tracking
- Review browser console for errors
- Contact system administrator

## System Requirements

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Recommended Setup
- Desktop/Laptop for admin tasks
- Mobile-friendly for student access
- Minimum 1280x720 screen resolution

## Data Privacy

This system stores:
- Student personal information
- Academic records
- Admin credentials
- Activity logs

Ensure compliance with:
- Local data protection laws
- School privacy policies
- Parental consent requirements
