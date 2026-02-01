# OTP Password Reset - Quick Start Guide

## Feature Overview
Users can now reset their forgotten password using a 6-digit OTP (One-Time Password) sent to their registered email. After successful password reset, users are automatically logged in without needing to enter credentials again.

## How It Works

### For Users

1. **Start Password Reset**
   - Click "Forgot Password?" link on login page
   - Go to `/forgot-password` path

2. **Enter Email**
   - Type the email associated with your account
   - Click "Send OTP"
   - Check your email inbox for the 6-digit code

3. **Verify OTP**
   - Copy the 6-digit code from email
   - Paste it in the OTP field
   - The form only accepts digits and auto-validates 6 characters
   - Click "Verify OTP"

4. **Create New Password**
   - Enter your new password (min 6 characters)
   - Confirm the password in the second field
   - Click "Reset Password & Login"
   - You'll be automatically logged in and redirected to home page

### For Developers

#### Backend API Endpoints

**1. Send OTP**
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}

Response:
{
  "success": true,
  "message": "OTP sent to your email"
}
```

**2. Verify OTP**
```bash
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "OTP verified successfully",
  "verified": true
}
```

**3. Reset Password (with Auto-Login)**
```bash
POST /api/auth/reset-password-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPassword123"
}

Response:
{
  "success": true,
  "message": "Password reset successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77...",
    "name": "User Name",
    "email": "user@example.com",
    "role": "student",
    "grade": "8th"
  }
}
```

#### Frontend Implementation

Using the OTP feature in your components:

```tsx
import { authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Send OTP
const response = await authAPI.forgotPassword({ email });

// Verify OTP
const response = await authAPI.verifyOTP({ email, otp });

// Reset password (returns token + user)
const response = await authAPI.resetPasswordOTP({ 
  email, 
  otp, 
  newPassword 
});

// Auto-login after password reset
const { loginDirectly } = useAuth();
loginDirectly(response.data.user);
localStorage.setItem('token', response.data.token);
```

## Important Notes

- **OTP Validity**: 10 minutes from sending
- **OTP Format**: 6-digit number
- **Email Required**: User must have valid email configured
- **Auto-Login**: Automatic login after password reset - no need for manual sign-in
- **Security**: OTP and password reset data cleared after use

## Testing Checklist

- [ ] Send OTP to valid email
- [ ] Try OTP before expiry (should work)
- [ ] Try expired OTP (should fail)
- [ ] Try wrong OTP (should fail)
- [ ] Try non-matching passwords (should fail)
- [ ] Reset password successfully and get auto-logged in
- [ ] Token stored in localStorage
- [ ] User redirected to home page
- [ ] User remains logged in after page refresh

## Troubleshooting

**Problem**: OTP not received in email
- Solution: Check spam/junk folder
- Solution: If email not configured, logs will show OTP in server console

**Problem**: "OTP has expired" error
- Solution: Request new OTP by going back to email step

**Problem**: Invalid password error
- Solution: Ensure password is at least 6 characters
- Solution: Ensure both password fields match

**Problem**: Not auto-logging in
- Solution: Check if token is stored in localStorage
- Solution: Check browser console for errors
- Solution: Ensure page redirect isn't blocked

## Backend Configuration

To enable email functionality, add to `.env`:
```
EMAIL_HOST=your-email-service.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-app-password
```

If not configured, OTP will still work but emails won't be sent (check server logs for OTP code).
