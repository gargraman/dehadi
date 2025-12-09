# HireConnect (Dehadi.co.in) - Worker Marketplace Platform

A comprehensive worker marketplace platform designed to connect daily-wage and skilled workers with employers across India. The platform prioritizes accessibility for low-literacy users and provides multilingual support with a mobile-first design optimized for outdoor visibility and smartphone users with limited experience.

## 🚀 Features

- **Worker-Employer Matching**: Connects workers with various skills (mason, electrician, plumber, etc.) to employers
- **Multilingual Support**: Supports multiple Indian languages including Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, and Punjabi
- **Payment Integration**: Razorpay integration for secure payment processing
- **Location-Based Services**: Nearby job discovery with location filtering
- **Job Lifecycle Management**: Complete workflow from job posting to completion and payment
- **Accessibility Focused**: Designed for users with 0-3 months smartphone experience
- **Voice Interface**: Voice search and command capabilities (planned)
- **Offline Support**: PWA with offline functionality for job listings

## 🏗️ Architecture

The project follows a modern full-stack architecture:

- **Frontend**: React 18 with TypeScript, Vite build system
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Shadcn/ui components built on Radix UI primitives
- **State Management**: TanStack Query for server state, React hooks for local state
- **Authentication**: Passport.js with session-based authentication
- **Payment Gateway**: Razorpay integration for Indian payment methods

## 📁 Project Structure

```
HireConnect/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # React hooks
│   │   ├── lib/            # Utilities and libraries
│   │   └── App.tsx         # Main application component
├── server/                 # Express backend
│   ├── index.ts           # Main server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   └── db.ts              # Database connection
├── shared/                 # Shared code between client and server
│   └── schema.ts          # Database schema and types
├── docker-compose.yml      # Docker configuration
├── Dockerfile             # Production Docker image
├── package.json           # Project dependencies
└── README-DEPLOY.md       # Comprehensive deployment guide
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- PostgreSQL 14.x or higher (for local development)
- Docker & Docker Compose (for containerized deployment)

### Local Development Setup

1. **Install Dependencies:**
```bash
npm install
```

2. **Environment Configuration:**
```bash
cp .env.example .env
# Edit .env with your values
```

3. **Database Setup:**
```bash
# Start PostgreSQL locally
# For macOS with Homebrew:
brew services start postgresql@16

# Create database
createdb dehadi_db

# Push database schema
npm run db:push
```

4. **Run Development Server:**
```bash
npm run dev
```
- Frontend: http://localhost:8080
- Backend API: http://localhost:8080/api

## 🐳 Docker Deployment

### Quick Start

```bash
# Copy environment file
cp .env.example .env

# Update .env with your configuration

# Start all services
docker-compose up -d

# Access application
# App: http://localhost:8080
# pgAdmin (optional): http://localhost:8080 (with --profile tools)
```

## 📊 API Endpoints

### Job Management
- `GET /api/jobs` - Get jobs with filtering
- `GET /api/jobs/:id` - Get specific job
- `POST /api/jobs` - Create new job (Employer only)
- `PATCH /api/jobs/:id/status` - Update job status (Employer only)
- `POST /api/jobs/:id/assign` - Assign worker to job (Employer only)
- `POST /api/jobs/:id/complete` - Mark job as completed (Employer only)

### Job Applications
- `GET /api/jobs/:jobId/applications` - Get applications for job
- `GET /api/workers/:workerId/applications` - Get applications for worker
- `POST /api/applications` - Create application (Worker only)
- `PATCH /api/applications/:id/status` - Update application status (Employer only)

### Payments
- `POST /api/payments/create-order` - Initialize Razorpay payment (Employer only)
- `POST /api/payments/verify` - Verify payment signature (Employer only)
- `GET /api/payments/job/:jobId` - Get payment for job

### Messaging
- `GET /api/messages/:userId1/:userId2` - Get conversation
- `POST /api/messages` - Send message (Authenticated users only)
- `PATCH /api/messages/:id/read` - Mark message as read

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user details
- `GET /api/auth/status` - Check authentication status

### Health Check
- `GET /api/health` - Application health status

## 🛡️ Security Features

- **Password Security**: Bcrypt hashing with 10 salt rounds
- **Session Management**: PostgreSQL-backed sessions with CSRF protection
- **Role-Based Access Control**: Three roles (worker, employer, NGO) with specific permissions
- **Input Validation**: Zod schemas for all API endpoints
- **Payment Security**: Razorpay signature verification with HMAC SHA256
- **SQL Injection Prevention**: Drizzle ORM parameterized queries
- **Environment Security**: Secrets stored in environment variables

## 🎨 UI/UX Design Principles

- **Accessibility First**: Optimized for users with 0-3 months smartphone experience
- **Visual Clarity**: High contrast, outdoor-readable interface
- **Cultural Relevance**: Colors and patterns appropriate for Indian market context
- **Functional Efficiency**: Minimal cognitive load, maximum task completion speed
- **Large Touch Targets**: Minimum 48px for all interactive elements
- **Icon-First Navigation**: Visual indicators for users with limited literacy

## 🚀 Deployment

The application supports multiple deployment strategies:

1. **Docker Deployment**: Containerized application for portability
2. **AWS ECS Fargate**: Serverless containers with auto-scaling
3. **AWS Elastic Beanstalk**: Managed platform deployment
4. **Replit**: One-click deployment within Replit platform

For detailed deployment instructions, refer to the `README-DEPLOY.md` file.

## 🧪 Testing

- **Framework**: Vitest for testing
- **Types**: Unit tests, integration tests, and component tests
- **Coverage**: Minimum 70% coverage for lines, functions, branches, and statements
- **Database Tests**: Uses separate test database configuration

## 🔧 Development Conventions

### Code Structure
- **Type Safety**: Extensive use of TypeScript with Zod validation schemas
- **Component Design**: Shadcn/ui components with Radix UI primitives for accessibility
- **API Design**: RESTful API with `/api` prefix for all endpoints

### Naming Conventions
- **Components**: PascalCase (e.g., `JobCard.tsx`)
- **Functions**: camelCase (e.g., `createUser`)
- **Constants**: UPPERCASE (e.g., `MAX_FILE_SIZE`)
- **Files**: kebab-case for non-components, PascalCase for components

## 🧑‍🤝‍🧑 User Roles

- **Worker**: Find and apply for jobs
- **Employer**: Post jobs and hire workers
- **NGO/CSC Partner**: Assist with worker registration
- **Admin**: Platform management and oversight

## 📈 Job Lifecycle

1. **Open**: Job posted and accepting applications
2. **In Progress**: Worker assigned and job started
3. **Awaiting Payment**: Job completed, pending employer payment
4. **Paid**: Payment completed successfully
5. **Completed**: Job fully finished
6. **Cancelled**: Job cancelled by employer

## ⚙️ Environment Variables

**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `RAZORPAY_KEY_ID` - Razorpay API Key ID
- `RAZORPAY_KEY_SECRET` - Razorpay API Secret
- `SESSION_SECRET` - Express session secret (32+ characters)
- `NODE_ENV` - Environment (`production` or `development`)

**Optional Variables:**
- `PORT` - Application port (default: 8080)
- `OPENAI_API_KEY` - OpenAI API key
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID` - S3/Object storage bucket

## 🤝 Contributing

We welcome contributions to the HireConnect platform! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Run the test suite (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please check the documentation in `README-DEPLOY.md` or open an issue in the GitHub repository.