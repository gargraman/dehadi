# QWEN.md - HireConnect (Dehadi.co.in) Project Overview

## Project Overview

**HireConnect** (branded as **Dehadi.co.in**) is a comprehensive worker marketplace platform designed to connect daily-wage and skilled workers with employers across India. The platform focuses on accessibility for low-literacy users, multilingual support, and mobile-first design optimized for outdoor visibility and smartphone users with limited experience.

### Key Features

- **Worker-Employer Matching:** Connects workers with various skills (mason, electrician, plumber, etc.) to employers
- **Multilingual Support:** Supports multiple Indian languages including Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, and Punjabi
- **Payment Integration:** Razorpay integration for secure payment processing
- **Location-Based Services:** Nearby job discovery with location filtering
- **Job Lifecycle Management:** Complete workflow from job posting to completion and payment
- **Accessibility Focused:** Designed for users with 0-3 months smartphone experience
- **Voice Interface:** Voice search and command capabilities (planned)
- **Offline Support:** PWA with offline functionality for job listings

### Architecture

The project follows a modern full-stack architecture with:

- **Frontend:** React 18 with TypeScript, Vite build system
- **Backend:** Express.js with TypeScript
- **Database:** PostgreSQL with Drizzle ORM
- **UI Components:** Shadcn/ui components built on Radix UI primitives
- **State Management:** TanStack Query for server state, React hooks for local state
- **Authentication:** Passport.js with session-based authentication
- **Payment Gateway:** Razorpay integration for Indian payment methods

## Building and Running

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

### Docker Deployment

1. **Quick Start:**
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

2. **Production Docker:**
```bash
# Build production image
docker build -t your-registry.com/dehadi-app:1.0.0 .

# Run in production
docker run -d \
  --name dehadi-app \
  -p 8080:8080 \
  --env-file .env.production \
  your-registry.com/dehadi-app:1.0.0
```

### Environment Variables

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

## Project Structure

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
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── drizzle.config.ts      # Database migration config
└── README-DEPLOY.md       # Comprehensive deployment guide
```

## Development Conventions

### Code Structure
- **Type Safety:** Extensive use of TypeScript with Zod validation schemas
- **Component Design:** Shadcn/ui components with Radix UI primitives for accessibility
- **API Design:** RESTful API with `/api` prefix for all endpoints
- **State Management:** 
  - Local: React hooks and Context API
  - Server: TanStack Query for caching and synchronization

### Naming Conventions
- **Components:** PascalCase (e.g., `JobCard.tsx`)
- **Functions:** camelCase (e.g., `createUser`)
- **Constants:** UPPERCASE (e.g., `MAX_FILE_SIZE`)
- **Files:** kebab-case for non-components, PascalCase for components

### Database Schema
- **Users:** Workers, employers, NGOs, and admins
- **Jobs:** Job postings with status lifecycle
- **Applications:** Job applications with status
- **Payments:** Payment tracking with Razorpay integration
- **Messages:** Communication between users

### API Endpoints

#### Job Management
- `GET /api/jobs` - Get jobs with filtering
- `GET /api/jobs/:id` - Get specific job
- `GET /api/jobs/nearby` - Get jobs near specific coordinates
- `POST /api/jobs` - Create new job (Employer only)
- `PATCH /api/jobs/:id/status` - Update job status (Employer only)
- `POST /api/jobs/:id/assign` - Assign worker to job (Employer only)
- `POST /api/jobs/:id/complete` - Mark job as completed (Employer only)

#### Job Applications
- `GET /api/jobs/:jobId/applications` - Get applications for job
- `GET /api/workers/:workerId/applications` - Get applications for worker
- `POST /api/applications` - Create application (Worker only)
- `PATCH /api/applications/:id/status` - Update application status (Employer only)

#### Payments
- `POST /api/payments/create-order` - Initialize Razorpay payment (Employer only)
- `POST /api/payments/verify` - Verify payment signature (Employer only)
- `GET /api/payments/job/:jobId` - Get payment for job

#### Messaging
- `GET /api/messages/:userId1/:userId2` - Get conversation
- `POST /api/messages` - Send message (Authenticated users only)
- `PATCH /api/messages/:id/read` - Mark message as read

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user details
- `GET /api/auth/status` - Check authentication status

#### Health Check
- `GET /api/health` - Application health status

### Security Features
- **Password Security:** Bcrypt hashing with 10 salt rounds
- **Session Management:** PostgreSQL-backed sessions with CSRF protection
- **Role-Based Access Control:** Three roles (worker, employer, NGO) with specific permissions
- **Input Validation:** Zod schemas for all API endpoints
- **Payment Security:** Razorpay signature verification with HMAC SHA256
- **SQL Injection Prevention:** Drizzle ORM parameterized queries
- **Environment Security:** Secrets stored in environment variables

### UI/UX Design Principles
- **Accessibility First:** Optimized for users with 0-3 months smartphone experience
- **Visual Clarity:** High contrast, outdoor-readable interface
- **Cultural Relevance:** Colors and patterns appropriate for Indian market context
- **Functional Efficiency:** Minimal cognitive load, maximum task completion speed
- **Large Touch Targets:** Minimum 48px for all interactive elements
- **Icon-First Navigation:** Visual indicators for users with limited literacy

### Testing
- **Framework:** Vitest for testing
- **Types:** Unit tests, integration tests, and component tests
- **Coverage:** Minimum 70% coverage for lines, functions, branches, and statements
- **Database Tests:** Uses separate test database configuration

### Database Migrations
- **Drizzle ORM:** Schema-first approach with type safety
- **Migration Commands:**
  - Push schema: `npm run db:push`
  - Force push: `npm run db:push --force`
  - Generate migrations: `npx drizzle-kit generate:pg`

## Key Components & Features

### Job Lifecycle
1. **Open:** Job posted and accepting applications
2. **In Progress:** Worker assigned and job started
3. **Awaiting Payment:** Job completed, pending employer payment
4. **Paid:** Payment completed successfully
5. **Completed:** Job fully finished
6. **Cancelled:** Job cancelled by employer

## UI/UX Design Strategy

### Design Principles for Non-Tech Users
1. **Visual-First Navigation:** Use large, recognizable icons instead of text-heavy menus
2. **High Contrast Colors:** Ensure readability in outdoor conditions
3. **Large Touch Targets:** Minimum 48px for all interactive elements
4. **Simple Language:** Use familiar terminology and clear call-to-action buttons
5. **Intuitive Workflows:** Minimize cognitive load with straightforward processes
6. **Cultural Relevance:** Consider cultural context in imagery and interactions
7. **Gesture-Based Interactions:** Where appropriate, use simple gestures like swipe/tap

### Icon Strategy
- Use universally recognizable icons for primary functions
- Include tooltips with simple text labels for clarity
- Ensure icons are large enough to be easily understood
- Follow platform-specific design guidelines for consistency

### Accessibility Features
- Large font sizes (minimum 16px for body text)
- Sufficient color contrast (4.5:1 minimum ratio)
- Voice command integration for key functions
- Support for screen readers
- Simple, consistent navigation patterns

## UI/UX Design Plan for HireConnect

### Phase 1: Visual Design System
1. Color palette optimized for outdoor visibility
2. Typography system with large, readable fonts
3. Icon library with simple, universally understood symbols
4. Component library with accessibility built-in

### Phase 2: Wireframes and Screens
1. Worker-focused screens (Home, Job Search, Job Details, Profile)
2. Employer-focused screens (Job Posting, Dashboard, Applicant Review)
3. Universal screens (Messaging, Payments, Settings)
4. Onboarding flow for both worker and employer roles

### Phase 3: Prototyping and Testing
1. Low-fidelity prototypes for initial feedback
2. High-fidelity prototypes for detailed testing
3. User testing with actual target audience
4. Iterative improvements based on feedback

### Phase 4: Implementation Preparation
1. Frontend component development guidelines
2. Accessibility compliance documentation
3. Testing protocols for various device types
4. Documentation for future development

### Payment System
- **Razorpay Integration:** Secure payment processing for UPI, cards, and net banking
- **Signature Verification:** HMAC SHA256 verification for payment security
- **Atomic Transactions:** Database transactions to ensure payment-job status consistency
- **Status Tracking:** Complete payment lifecycle management

## User Roles
- **Worker:** Find and apply for jobs
- **Employer:** Post jobs and hire workers
- **NGO/CSC Partner:** Assist with worker registration
- **Admin:** Platform management and oversight

## Deployment

The application supports multiple deployment strategies:

1. **Docker Deployment:** Containerized application for portability
2. **AWS ECS Fargate:** Serverless containers with auto-scaling
3. **AWS Elastic Beanstalk:** Managed platform deployment
4. **Replit:** One-click deployment within Replit platform

For detailed deployment instructions, refer to the `README-DEPLOY.md` file which includes comprehensive guides for local development, Docker, and AWS deployment options, including infrastructure as code with proper security configurations.

## Database Schema

The application uses the following main tables:

### Users Table
- `id`: Primary key with UUID
- `username`: Unique username
- `passwordHash`: Bcrypt hashed password
- `fullName`, `phone`: User information
- `role`: worker, employer, ngo, or admin
- `language`: User's preferred language
- `location`: User's location
- `skills`: Array of user skills
- `aadhar`: Aadhar number (for Indian identity verification)
- `createdAt`: Record creation timestamp

### Jobs Table
- `id`: Primary key with UUID
- `employerId`: Foreign key to users table
- `title`, `description`: Job details
- `workType`: Type of work (mason, electrician, plumber, etc.)
- `location`, `locationLat`, `locationLng`: Job location information
- `wageType`: Daily, hourly, or fixed
- `wage`: Wage amount
- `headcount`: Number of workers needed
- `skills`: Required skills (array)
- `status`: Job status (open, in_progress, awaiting_payment, paid, completed, cancelled)
- `assignedWorkerId`: Worker assigned to the job
- `startedAt`, `completedAt`: Job timing
- `createdAt`: Record creation timestamp

### Job Applications Table
- `id`: Primary key with UUID
- `jobId`: Foreign key to jobs table
- `workerId`: Foreign key to users table
- `status`: Application status (pending, accepted, rejected, withdrawn)
- `message`: Application message
- `createdAt`: Record creation timestamp

### Messages Table
- `id`: Primary key with UUID
- `senderId`, `receiverId`: Foreign keys to users table
- `jobId`: Foreign key to jobs table (optional)
- `content`: Message content
- `isRead`: Read status
- `createdAt`: Record creation timestamp

### Payments Table
- `id`: Primary key with UUID
- `jobId`: Foreign key to jobs table
- `employerId`, `workerId`: Foreign keys to users table
- `amount`: Payment amount in smallest currency unit (paise for INR)
- `currency`: Currency code (default: INR)
- `status`: Payment status (pending, processing, completed, failed, refunded)
- `paymentMethod`: Payment method used (upi, razorpay, card, bank_transfer)
- `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`: Razorpay transaction details
- `failureReason`: Reason for payment failure
- `createdAt`, `paidAt`: Payment timing