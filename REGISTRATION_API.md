# Dating App Registration API

This document describes the registration endpoints for the dating app backend, supporting both phone (OTP) and Google authentication methods.

## Phone Registration Flow

### 1. Send OTP
**POST** `/otp/send`

Send an OTP to the user's phone number for verification.

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

### 2. Verify OTP
**POST** `/otp/verify`

Verify the OTP sent to the user's phone.

**Request Body:**
```json
{
  "otp": "123456"
}
```

**Response:**
```json
{
  "verified": true,
  "phoneNumber": 1234567890,
  "message": "OTP verified successfully. You can now proceed with registration."
}
```

### 3. Register with Phone
**POST** `/user/signup/phone`

Register a new user with phone number after OTP verification.

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

**Response:**
```json
{
  "id": 1,
  "phoneNumber": 1234567890,
  "firstname": "John",
  "lastname": "Doe",
  "verified": true
}
```

## Google Registration Flow

### 1. Google Authentication
**POST** `/auth/google`

Authenticate and register a user with Google credentials.

**Request Body:**
```json
{
  "accessToken": "google_access_token_here",
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

**Alternative with ID Token:**
```json
{
  "idToken": "google_id_token_here",
  "firstname": "John",
  "lastname": "Doe"
}
```

**Response (New User):**
```json
{
  "id": 1,
  "email": "john.doe@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "verified": true,
  "isNewUser": true
}
```

**Response (Existing User):**
```json
{
  "id": 1,
  "email": "john.doe@gmail.com",
  "firstname": "John",
  "lastname": "Doe",
  "verified": true,
  "isNewUser": false
}
```

## Profile Completion

### Complete User Profile
**PUT** `/user/profile/:userId`

Complete or update user profile information.

**Request Body:**
```json
{
  "bio": "I love hiking and coffee",
  "age": 25,
  "gender": "MALE",
  "location": "New York",
  "lookingFor": "DATING",
  "profilePicture": "https://example.com/photo.jpg"
}
```

**Response:**
```json
{
  "id": 1,
  "bio": "I love hiking and coffee",
  "age": 25,
  "gender": "MALE",
  "location": "New York",
  "lookingFor": "DATING",
  "profilePicture": "https://example.com/photo.jpg",
  "userId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Data Types

### Gender Enum
- `MALE`
- `FEMALE`
- `OTHER`

### LookingFor Enum
- `FRIENDSHIP`
- `DATING`
- `LONG_TERM`
- `CASUAL`

## Error Responses

### User Already Exists
```json
{
  "statusCode": 409,
  "message": "User with this phone number already exists"
}
```

### Invalid OTP
```json
{
  "verified": false,
  "message": "Incorrect OTP"
}
```

### Invalid Google Token
```json
{
  "statusCode": 400,
  "message": "Invalid Google access token"
}
```

## Registration Flow Summary

### Phone Registration:
1. Send OTP to phone number
2. Verify OTP
3. Register user with phone number and profile data
4. Optionally complete profile later

### Google Registration:
1. Send Google token (access token or ID token) with profile data
2. System verifies token with Google
3. Creates or retrieves user account
4. Returns user information with `isNewUser` flag

### Profile Completion:
- Can be done during initial registration or later
- All profile fields are optional during registration
- Profile is only created when all required fields are provided 