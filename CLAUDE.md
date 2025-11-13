# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HireConnect is a worker marketplace platform designed for daily-wage workers in India. The application connects workers (mason, electrician, plumber, etc.) with employers through a mobile-first PWA interface optimized for low-literacy users and multilingual support.

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS with shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with local strategy
- **Payments**: Razorpay integration
- **Testing**: Vitest with MSW for API mocking
- **State Management**: React Query for server state
- **Routing**: Wouter for client-side routing

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
vitest run              # Run all tests
vitest                  # Run tests in watch mode
vitest --ui             # Run tests with UI
vitest run --coverage   # Run tests with coverage report
vitest run tests/unit   # Run unit tests only
vitest run tests/integration  # Run integration tests only

# Test Data Seeding
tsx db/seed-test.ts     # Seed test database (small dataset)
tsx db/seed-dev.ts      # Seed dev database (larger dataset)
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

## Development Workflow

1. Use TypeScript strict mode - all files must pass `npm run check`
2. Follow existing component patterns in `client/src/components/`
3. Use Drizzle schema updates with `npm run db:push`
4. Write tests for new features following patterns in `tests/`
5. Respect the design system guidelines for UI consistency
- don't create additional md files
- assume its a new setup, no database migraion required. ask for any migrations related files