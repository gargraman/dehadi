# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HireConnect (Dehadi.co.in) is a worker marketplace platform designed for daily-wage workers in India. The application connects workers (mason, electrician, plumber, etc.) with employers through a mobile-first PWA interface optimized for low-literacy users and multilingual support.

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS with shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based local strategy
- **Payments**: Razorpay integration for Indian payment methods
- **Testing**: Vitest with MSW for API mocking
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **UI Framework**: Material Design 3 with Radix UI primitives
- **Deployment**: Docker with multi-stage builds

## Development Commands

```bash
# Development
npm run dev              # Start development server (client + server)
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run check           # TypeScript type checking

# Database
npm run db:push         # Push schema changes to database

# Testing
npm run test            # Run tests (alias for vitest)
npm run test:watch      # Run tests in watch mode
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage report
vitest run tests/unit   # Run unit tests only
vitest run tests/integration  # Run integration tests only

# Test Data Seeding
tsx db/seed-test.ts     # Seed test database (small dataset)
tsx db/seed-dev.ts      # Seed dev database (larger dataset)

# Docker Commands
npm run docker:dev      # Start development environment
npm run docker:prod     # Start production environment
npm run docker:build    # Build all Docker images
npm run docker:down     # Stop all services
npm run docker:logs     # View logs from all services
npm run docker:shell    # Shell access to development container
```

## Architecture

### Frontend Architecture (`client/`)
- **Routing**: File-based pages in `client/src/pages/`
- **Components**: Reusable UI components in `client/src/components/`
- **API Layer**: React Query hooks in `client/src/hooks/`
- **Styling**: Tailwind CSS with design system defined in `design_guidelines.md`

### Backend Architecture (`server/`)
- **Entry Point**: `server/index.ts` - Express server setup
- **API Routes**: `server/routes.ts` - RESTful API endpoints
- **Data Layer**: `server/storage.ts` - Database abstraction layer
- **Database**: `server/db.ts` - Drizzle connection and configuration

### Shared Code (`shared/`)
- **Database Schema**: `shared/schema.ts` - Drizzle schema definitions and Zod types
- **Types**: Shared TypeScript types between client and server

## Key Architectural Patterns

### Database Layer
- **Drizzle ORM**: Type-safe SQL with schema-first approach
- **Storage Abstraction**: `MemStorage` class provides consistent interface for data operations
- **Schema Validation**: Zod schemas auto-generated from Drizzle tables

### API Design
- RESTful endpoints following `/api/{resource}` pattern
- Authentication middleware using Passport sessions
- Consistent error handling and validation
- File uploads handled via Express static middleware

### Component Structure
- Material Design 3 principles with Indian market adaptations
- Mobile-first responsive design with 48px minimum touch targets
- Component library using Radix UI primitives with custom styling
- Accessibility-first approach for low-literacy users

## Path Aliases

```typescript
"@/*": ["./client/src/*"]      // Frontend components and code
"@shared/*": ["./shared/*"]    // Shared schemas and types
"@assets/*": ["./attached_assets/*"]  // Static assets
"@db": ["./server/db.ts"]      // Database connection (tests only)
"@storage": ["./server/storage.ts"]   // Storage layer (tests only)
```

## Database Schema Overview

### Core Tables
- **users**: Workers, employers, NGOs with role-based access
- **jobs**: Job postings with location, wage, skills requirements
- **jobApplications**: Application workflow management
- **messages**: In-app messaging system
- **payments**: Razorpay payment processing with status tracking

### Key Relationships
- Jobs belong to employer users
- Applications link workers to jobs
- Messages support job-specific conversations
- Payments track job completion workflow

## Testing Strategy

### Test Structure
- **Unit Tests**: `tests/unit/` - Storage layer and schema validation
- **Integration Tests**: `tests/integration/api/` - Full API endpoint testing
- **Component Tests**: `tests/components/` - React component testing
- **Mocks**: `tests/mocks/` - External service mocking (Razorpay, etc.)

### Test Database
- Separate test database with seeded data
- Cleanup utilities in `tests/setup/test-db.ts`
- MSW for HTTP mocking in integration tests

## Design System

The application follows comprehensive design guidelines in `design_guidelines.md`:
- Material Design 3 with Indian market adaptations
- Accessibility-first for low-literacy users
- Mobile-first with large touch targets (48px minimum)
- High contrast colors for outdoor visibility
- Multilingual support (Hindi, Bengali, Tamil)
- Voice interface capabilities

## Special Considerations

### Accessibility
- Large fonts (minimum 16px body text)
- High contrast color ratios
- Icon-first navigation with text labels
- Voice input support via browser APIs

### Localization
- Multi-language support with language switcher
- Cultural adaptations for Indian market
- Regional font loading (Devanagari, Bengali, Tamil)

### Mobile-First
- PWA capabilities with offline support
- Touch-optimized UI with large tap targets
- Optimized for field workers using smartphones outdoors

## Implemented Features

### Core Platform Features
- **User Authentication & Onboarding**: Complete role-based registration (worker/employer/NGO) with session management
- **Job Management**: Full CRUD operations for job postings with status tracking (open → in_progress → completed)
- **Application System**: Workers can apply to jobs, employers can accept/reject applications
- **Payment Integration**: Razorpay payment processing with order creation and verification
- **Messaging System**: In-app messaging between workers and employers for job coordination
- **Search & Discovery**: Location-based job search with filters for work type, location, and wage

### UI Components Implemented
- **Pages**: Home, Dashboard, Profile, Job Details, Post Job, Messages, Payment, Search, Nearby Jobs
- **Components**: Job Cards, Worker Cards, Filter Panel, Bottom Navigation, Language Switcher, Chat Messages
- **UI Library**: Complete shadcn/ui component library with 40+ components (buttons, forms, dialogs, etc.)

### Database Schema
- **5 Core Tables**: users, jobs, jobApplications, messages, payments
- **Role-Based Access**: Worker, Employer, NGO, Admin roles with appropriate permissions
- **Job Workflow**: Complete lifecycle from posting → application → assignment → completion → payment
- **Payment Tracking**: Integration with Razorpay for secure payment processing

### Additional Features
- **Multi-language Support**: Language switcher with support for 9 Indian languages
- **Accessibility Features**: High contrast design, large touch targets (48px min), screen reader support
- **Docker Deployment**: Production-ready containerization with PostgreSQL
- **Flutter App**: Parallel Flutter implementation in `hireconnect_flutter/` directory
- **Comprehensive Testing**: Unit tests, integration tests, and component tests with MSW mocking

## Development Workflow

1. Use TypeScript strict mode - all files must pass `npm run check`
2. Follow existing component patterns in `client/src/components/`
3. Use Drizzle schema updates with `npm run db:push`
4. Write tests for new features following patterns in `tests/`
5. Respect the design system guidelines for UI consistency
6. Use Docker for consistent development environment: `npm run docker:dev`
7. Seed test data using `tsx db/seed-dev.ts` for development

## Current Implementation Status

**Production Ready Features:**
- ✅ User authentication and role management
- ✅ Job posting and application workflow
- ✅ Payment integration with Razorpay
- ✅ Core messaging system
- ✅ Search and discovery features
- ✅ Responsive mobile-first UI

**In Development/Enhancement Areas:**
- 🔄 Voice interface capabilities (planned)
- 🔄 PWA offline support enhancements
- 🔄 Advanced location services with GPS
- 🔄 Real-time notifications
- 🔄 Analytics and reporting dashboard