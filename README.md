# Dating App Backend

A robust, scalable backend for a modern dating application, built with [NestJS](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), and TypeScript. This backend handles authentication (including Google OAuth and phone-based OTP), user management, and integrates with external services like Afromessage for SMS.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [API Overview](#api-overview)
- [Database](#database)
- [SMS Integration](#sms-integration)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User registration via phone number (OTP) and Google OAuth
- Secure authentication and session management
- User profile management
- SMS OTP delivery via Afromessage
- Modular, scalable codebase using NestJS best practices
- Prisma ORM for type-safe database access
- Environment-based configuration

---

## Project Structure

```
dating-app-backend/
├── src/
│   ├── app.module.ts           # Root NestJS module
│   ├── main.ts                 # Application entry point
│   ├── auth/                   # Auth logic (Google, phone, guards, strategies)
│   ├── otp/                    # OTP generation and validation
│   ├── user/                   # User controllers, services, DTOs
│   ├── prisma/                 # Prisma service integration
│   ├── config/                 # App configuration (e.g., Google OAuth)
│   └── utils/                  # Utility types and helpers
├── prisma/
│   ├── schema.prisma           # Prisma schema (DB models)
│   └── migrations/             # DB migrations
├── .env                        # Environment variables (not committed)
├── package.json                # NPM dependencies and scripts
├── README.md                   # Project documentation
└── ...                         # Other config and setup files
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- PostgreSQL (or your preferred DB, update `schema.prisma` accordingly)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/dating-app-backend.git
   cd dating-app-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in the required values (see [Environment Variables](#environment-variables)).

4. **Set up the database:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run start:dev
   ```

---

## Environment Variables

Create a `.env` file in the root directory. Key variables include:

| Variable                | Description                                 |
|-------------------------|---------------------------------------------|
| `DATABASE_URL`          | Database connection string                  |
| `AFROMESSAGE_API_KEY`   | JWT token for Afromessage SMS API           |
| `GOOGLE_CLIENT_ID`      | Google OAuth client ID                      |
| `GOOGLE_CLIENT_SECRET`  | Google OAuth client secret                  |
| `JWT_SECRET`            | Secret for signing JWTs                     |
| ...                     | ...                                         |

See [AFROMESSAGE_SETUP.md](AFROMESSAGE_SETUP.md) for SMS setup details.

---

## API Overview

- **Auth:** `/auth` (Google OAuth, phone OTP)
- **User:** `/user` (profile, registration)
- **OTP:** `/otp` (send/verify OTP)

See [REGISTRATION_API.md](REGISTRATION_API.md) and [PHONE_REGISTRATION_FLOW.md](PHONE_REGISTRATION_FLOW.md) for detailed API documentation and flows.

---

## Database

- Managed via [Prisma](https://www.prisma.io/)
- Schema defined in `prisma/schema.prisma`
- Migrations in `prisma/migrations/`

---

## SMS Integration

- Uses [Afromessage](https://afromessage.com) for OTP SMS delivery.
- See [AFROMESSAGE_SETUP.md](AFROMESSAGE_SETUP.md) for setup and troubleshooting.

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

[MIT](LICENSE) (or your chosen license)
