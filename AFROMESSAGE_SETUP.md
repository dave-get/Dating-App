# Afromessage API Setup Guide

## Getting Your API Key

The afromessage.com API expects a JWT token format for authentication. Here's how to get it:

### 1. Sign up/Login to Afromessage
- Go to [afromessage.com](https://afromessage.com)
- Create an account or login to your existing account

### 2. Get Your API Key
- Navigate to your dashboard
- Look for "API Keys" or "Authentication" section
- Generate a new API key or copy your existing one
- The API key should be in JWT format (three parts separated by periods: `header.payload.signature`)

### 3. Configure Environment Variables
Add your API key to your `.env` file:

```env
AFROMESSAGE_API_KEY="your-jwt-token-here"
```

### 4. Verify API Key Format
A valid JWT token should look like this:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Notice the three parts separated by periods (`.`).

### 5. Test Your Configuration
After setting up your API key, restart your application and try the OTP endpoint again.

## Troubleshooting

### "JWT strings must contain exactly 2 period characters. Found: 0"
This error means your API key is not in JWT format. Make sure you're using the JWT token from your afromessage dashboard, not a simple API key.

### "Invalid token"
This means the JWT token is malformed or expired. Generate a new one from your afromessage dashboard.

### "Unauthorized"
Check that your API key is correctly set in the environment variables and that you have sufficient credits in your afromessage account.

## Alternative: Use a Different SMS Service

If you continue having issues with afromessage.com, consider using alternative SMS services like:
- Twilio
- Vonage (formerly Nexmo)
- AWS SNS
- MessageBird

Each service has its own API format and authentication method. 