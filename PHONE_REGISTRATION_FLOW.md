# Phone Registration Flow - Step by Step

This document describes the complete step-by-step phone registration process for the dating app.

## Registration Flow Overview

The phone registration process consists of 3 main steps:

1. **Send OTP** - User enters phone number, system sends OTP
2. **Verify OTP** - User enters OTP code, system verifies it
3. **Complete Registration** - User fills profile information and completes registration

## Step 1: Send OTP

**Endpoint:** `POST /otp/send`

**Purpose:** Send an OTP to the user's phone number for verification.

**Request Body:**
```json
{
  "phoneNumber": 1234567890
}
```

**Response:**
```json
{
  "message": "OTP sent successfully"
}
```

**What happens:**
- System checks if phone number already exists
- Generates a 6-digit OTP
- Sends OTP via SMS (using configured SMS service)
- Stores OTP and phone number in session for verification

## Step 2: Verify OTP

**Endpoint:** `POST /otp/verify`

**Purpose:** Verify the OTP sent to the user's phone.

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "verified": true,
  "phoneNumber": 1234567890,
  "message": "OTP verified successfully. You can now proceed with registration."
}
```

**Response (Failure):**
```json
{
  "verified": false,
  "message": "Incorrect OTP"
}
```

**What happens:**
- System checks if provided OTP matches the stored OTP
- If valid, sets `phoneVerified` flag in session
- Clears OTP from session for security
- Returns success response with phone number

## Step 3: Complete Registration

**Endpoint:** `POST /otp/register`

**Purpose:** Complete user registration with profile information after OTP verification.

**Request Body:**
```json
{
  "phoneNumber": 1234567890,
  "firstname": "John",
  "lastname": "Doe",
  "bio": "I love hiking and coffee",
  "age": 25,
  "gender": "MALE",
  "location": "New York",
  "lookingFor": "DATING",
  "profilePicture": "https://example.com/photo.jpg"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "phoneNumber": 1234567890,
    "firstname": "John",
    "lastname": "Doe",
    "verified": true
  }
}
```

**Response (Error - Phone not verified):**
```json
{
  "statusCode": 400,
  "message": "Phone number not verified. Please verify OTP first."
}
```

**What happens:**
- System checks if phone number was verified in previous step
- Creates new user account with phone number
- Creates account record for phone provider
- Creates profile if profile data is provided
- Clears session data after successful registration

## Complete Flow Example

### Step 1: Send OTP
```bash
curl -X POST http://localhost:3000/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": 1234567890}'
```

### Step 2: Verify OTP
```bash
curl -X POST http://localhost:3000/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"otp": "123456"}'
```

### Step 3: Complete Registration
```bash
curl -X POST http://localhost:3000/otp/register \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": 1234567890,
    "firstname": "John",
    "lastname": "Doe",
    "bio": "I love hiking and coffee",
    "age": 25,
    "gender": "MALE",
    "location": "New York",
    "lookingFor": "DATING"
  }'
```

## Frontend Implementation Guide

### Step 1: Phone Number Input
```javascript
// Send OTP when user enters phone number
const sendOTP = async (phoneNumber) => {
  try {
    const response = await fetch('/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
      credentials: 'include' // Important for session
    });
    
    if (response.ok) {
      // Show OTP input field
      setShowOTPInput(true);
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
};
```

### Step 2: OTP Verification
```javascript
// Verify OTP when user enters code
const verifyOTP = async (otp) => {
  try {
    const response = await fetch('/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.verified) {
      // Show registration form
      setShowRegistrationForm(true);
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
  }
};
```

### Step 3: Complete Registration
```javascript
// Complete registration with profile data
const completeRegistration = async (profileData) => {
  try {
    const response = await fetch('/otp/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
      credentials: 'include'
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Registration complete, redirect to dashboard
      router.push('/dashboard');
    }
  } catch (error) {
    console.error('Error completing registration:', error);
  }
};
```

## Security Features

1. **Session-based verification**: OTP verification status is stored in session
2. **Phone number validation**: System checks if phone number was actually verified
3. **Session cleanup**: Session data is cleared after successful registration
4. **Duplicate prevention**: System prevents registration with existing phone numbers

## Error Handling

- **Phone already exists**: Returns 409 Conflict
- **Invalid OTP**: Returns verification failure
- **Phone not verified**: Returns 400 Bad Request
- **Missing required fields**: Returns validation errors

## Data Types

### Required Fields:
- `phoneNumber` (number)
- `firstname` (string)
- `lastname` (string)

### Optional Fields:
- `bio` (string)
- `age` (number, 18-100)
- `gender` (enum: MALE, FEMALE, OTHER)
- `location` (string)
- `lookingFor` (enum: FRIENDSHIP, DATING, LONG_TERM, CASUAL)
- `profilePicture` (string, URL) 