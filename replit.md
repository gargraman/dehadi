# Dehadi.co.in - Worker Marketplace Platform

## Overview

Dehadi.co.in is a worker marketplace platform designed to connect daily-wage and skilled workers with employers across India. The platform focuses on accessibility for low-literacy users, multilingual support, and mobile-first design optimized for outdoor visibility and smartphone users with limited experience.

The application serves multiple user roles:
- **Workers**: Find jobs, view opportunities nearby, manage applications
- **Employers**: Post jobs, hire workers, manage projects
- **NGO/CSC Partners**: Assist with worker registration
- **Admins**: Platform management and oversight

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type safety
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and data fetching

**UI Framework & Design System**
- **Shadcn/ui** components built on Radix UI primitives
- **Material UI Icons** for iconography
- **Tailwind CSS** for styling with custom design tokens
- **Material Design 3** principles heavily customized for accessibility

**Key Design Decisions**
- Mobile-first responsive design with bottom navigation pattern
- High contrast color palette optimized for outdoor visibility
- Large touch targets (minimum 44x44px) for users with limited smartphone experience
- Progressive enhancement approach with onboarding flow
- Offline-first considerations through localStorage for critical data

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript running on Node.js
- RESTful API architecture with `/api` prefix for all endpoints
- Custom middleware for request logging and error handling
- Development mode integrates Vite middleware for HMR

**Data Layer**
- **Drizzle ORM** for type-safe database operations
- **Neon Serverless PostgreSQL** as the database (via `@neondatabase/serverless`)
- WebSocket-based connection pooling for serverless compatibility
- Schema-first approach with Zod validation

**Storage Strategy**
- Database persistence using `DatabaseStorage` with Drizzle ORM
- Interface-based storage layer (`IStorage`) enabling easy storage swapping
- PostgreSQL database for production-ready data persistence
- Legacy `MemStorage` implementation available for testing

### State Management

**Client State**
- React hooks for local component state
- Context API for theme and user preferences
- LocalStorage for onboarding data and user preferences

**Server State**
- TanStack Query for caching, synchronization, and background updates
- Custom query functions with 401 handling
- Infinite stale time with manual invalidation strategy

### Routing & Navigation

**Client-Side Routing**
- Wouter for declarative routing
- Protected route wrapper checking onboarding completion
- Bottom navigation for primary app sections (Home, Search, Nearby, Messages, Profile)

**Route Structure**
- `/onboarding` - Initial user setup and language selection
- `/` - Home feed with job listings
- `/search` - Advanced search with filters
- `/nearby` - Location-based job discovery
- `/messages` - Communication hub
- `/profile` - User profile and settings
- `/dashboard` - Admin analytics (role-based)
- `/jobs/:id` - Job details and application
- `/jobs/:id/payment` - Payment interface for completed jobs
- `/post-job` - Job posting form for employers

### Authentication & Authorization

**Current Implementation**
- LocalStorage-based onboarding state
- Role-based UI rendering (worker, employer, NGO, admin)
- Planned integration with proper authentication system

**Future Considerations**
- JWT-based authentication
- Role-based access control (RBAC)
- OAuth integration for social login

### Payment Integration & Job Lifecycle

**Payment Gateway**
- **Razorpay** integration for UPI and online payments
- Secure payment verification using HMAC SHA256 signatures
- Payment order creation and verification endpoints
- Support for multiple payment methods (UPI, cards, net banking)
- Automatic job status updates after successful payment

**Job Status Lifecycle**
- **open**: Job posted and accepting applications
- **in_progress**: Worker assigned and job started
- **awaiting_payment**: Job completed, pending employer payment
- **paid**: Payment completed successfully
- **completed**: Job fully finished
- **cancelled**: Job cancelled by employer

**Status Tracking Features**
- Visual status indicators on job cards with distinct icons
- Real-time status updates across the application
- Worker assignment tracking with assignedWorkerId field
- Timestamp tracking for startedAt and completedAt
- Payment history and transaction records

**API Endpoints**
- `POST /api/payments/create-order` - Initialize Razorpay payment
- `POST /api/payments/verify` - Verify payment signature
- `GET /api/payments/job/:jobId` - Get payment details for a job
- `POST /api/jobs/:id/assign` - Assign worker to job
- `POST /api/jobs/:id/complete` - Mark job as completed
- `PATCH /api/jobs/:id/status` - Update job status

**Database Schema**
- `payments` table with Razorpay order/payment tracking
- Enhanced `jobs` table with lifecycle fields
- Foreign key relationships for data integrity

**Future Enhancements**
- Ratings and comments for completed jobs
- Dispute resolution system
- Payment refunds and reversals
- Worker performance metrics

### Internationalization (i18n)

**Language Support**
- Multi-script support: English, Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, Punjabi
- Google Fonts integration: Inter (primary), Noto Sans variants (regional)
- Language switcher component with native script display
- Planned implementation: Dynamic font loading based on selected language

### Accessibility Features

**Design for Low-Literacy Users**
- Icon + text labels for all primary actions
- Visual job categories with representative images
- Voice search capability (planned)
- Simplified onboarding flow with step-by-step guidance

**Technical Accessibility**
- ARIA labels and semantic HTML
- Keyboard navigation support via Radix UI
- High contrast modes (light/dark theme)
- Large minimum font sizes (16px base)

## External Dependencies

### Third-Party Services

**Database**
- **Neon Serverless PostgreSQL** - Primary database
- Connection via `@neondatabase/serverless` package
- WebSocket-based connection pooling

**Payment Gateway**
- **Razorpay** - Payment processing for UPI, cards, and net banking
- Supports multiple Indian payment methods
- Environment variables: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`

**Fonts & Assets**
- **Google Fonts API** - Inter and Noto Sans font families
- **Material Icons** - Icon library via Google Fonts CDN

### UI Component Libraries

**Core UI Framework**
- **Radix UI** - Unstyled, accessible component primitives (20+ components)
- **Shadcn/ui** - Pre-styled components built on Radix
- **Material UI** - Icons package only (`@mui/icons-material`)

**Styling & Utilities**
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Component variant management
- **clsx** & **tailwind-merge** - Conditional class composition

### Development Tools

**Build & Dev Tools**
- **Vite** - Build tool and dev server
- **TypeScript** - Type checking
- **ESBuild** - Server-side bundling
- **PostCSS** with Autoprefixer

**Replit Integration**
- `@replit/vite-plugin-runtime-error-modal` - Error overlay
- `@replit/vite-plugin-cartographer` - Development tooling
- `@replit/vite-plugin-dev-banner` - Dev environment banner

### Form & Validation

- **React Hook Form** - Form state management
- **Zod** - Schema validation
- **@hookform/resolvers** - Zod integration with RHF
- **Drizzle-Zod** - Database schema to Zod conversion

### Utilities

- **date-fns** - Date formatting and manipulation
- **nanoid** - Unique ID generation
- **ws** - WebSocket client for Neon connection

### API & Data Fetching

- **TanStack Query** (React Query) - Server state management
- Native Fetch API for HTTP requests
- Custom `apiRequest` wrapper with error handling