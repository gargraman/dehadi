# Dehadi.co.in - Worker Marketplace Platform

## Overview
Dehadi.co.in is a worker marketplace platform connecting daily-wage and skilled workers with employers across India. It emphasizes accessibility for low-literacy users, multilingual support, and a mobile-first design optimized for outdoor visibility and users with limited smartphone experience. The platform supports multiple user roles: Workers, Employers, NGO/CSC Partners, and Admins. The business vision is to empower the unorganized labor sector in India by providing a streamlined, accessible job market.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The platform features a mobile-first responsive design with a bottom navigation pattern. It uses a high-contrast color palette optimized for outdoor visibility and large touch targets (minimum 44x44px for web, 48dp for Flutter) to accommodate users with limited smartphone experience. A progressive enhancement approach is used, including an onboarding flow. All UI icons use lucide-react for a clean, professional appearance - no emojis are used in the interface. Accessibility features include icon + text labels with bilingual Hindi/English text, visual job categories with color-coded work type icons, ARIA labels, semantic HTML, keyboard navigation, and high contrast modes. Internationalization supports English, Hindi, Bengali, Telugu, Tamil, Marathi, Gujarati, Kannada, Malayalam, and Punjabi, with dynamic font loading. The Flutter mobile app mirrors these UI/UX principles, adding voice search capabilities.

### Technical Implementations

**Frontend (Web):**
- **Framework:** React 18 with TypeScript.
- **Build System:** Vite.
- **Routing:** Wouter.
- **State Management:** TanStack Query for server state, React hooks/Context API for client state, LocalStorage for persistence.
- **UI:** Shadcn/ui (built on Radix UI), Material UI Icons, Tailwind CSS, Material Design 3 principles.

**Frontend (Mobile - Flutter):**
- **Framework:** Flutter with Dart.
- **State Management:** Provider.
- **UI:** Material Design 3 theme, high-contrast colors, custom fonts (Inter, NotoSansDevanagari).
- **Internationalization:** `AppLocalizations` class, `LocaleProvider` for runtime switching.
- **Voice Search:** `speech_to_text` package for locale-aware voice input.

**Backend:**
- **Framework:** Express.js with TypeScript on Node.js, RESTful API.
- **Data Layer:** Drizzle ORM, Neon Serverless PostgreSQL.
- **Storage:** Database persistence via `DatabaseStorage`.
- **Authentication:** Currently LocalStorage-based, future plans for JWT and RBAC.

**Payment Integration & Job Lifecycle:**
- **Payment Gateway:** Razorpay integration for UPI and online payments.
- **Job Statuses:** `open`, `in_progress`, `awaiting_payment`, `paid`, `completed`, `cancelled`.
- Features include visual status indicators, real-time updates, worker assignment tracking, and payment history.

### System Design Choices
- **Modular Architecture:** Clear separation of concerns between frontend, backend, and mobile components.
- **Scalability:** Designed for horizontal scaling with AWS ECS Fargate, RDS read replicas, and CDN caching.
- **Security:** Emphasis on environment variables for sensitive data, SSL/TLS, and planned RBAC.
- **Observability:** Health checks, centralized logging (CloudWatch), metrics, and alerts.

## External Dependencies

### Third-Party Services
- **Database:** Neon Serverless PostgreSQL (`@neondatabase/serverless`).
- **Payment Gateway:** Razorpay.
- **Fonts & Assets:** Google Fonts API (Inter, Noto Sans), Material Icons.

### UI Component Libraries
- **Web:** Radix UI, Shadcn/ui, lucide-react (icons), Tailwind CSS, `class-variance-authority`, `clsx`, `tailwind-merge`.
- **Flutter:** `speech_to_text` (for voice search).

### Development & Utilities
- **Build & Dev Tools:** Vite, TypeScript, ESBuild, PostCSS.
- **Form & Validation:** React Hook Form, Zod, `@hookform/resolvers`, Drizzle-Zod.
- **Utilities:** `date-fns`, `nanoid`, `ws`.
- **API & Data Fetching:** TanStack Query, native Fetch API.

### Replit Specific
- `@replit/vite-plugin-runtime-error-modal`
- `@replit/vite-plugin-cartographer`
- `@replit/vite-plugin-dev-banner`