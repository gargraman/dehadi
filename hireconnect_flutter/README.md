# HireConnect Flutter App

A Flutter application for the HireConnect worker marketplace platform, designed for daily-wage and skilled workers across India.

## Features

- Worker and employer roles with distinct UI experiences
- Authentication system (login/register)
- Job searching and filtering
- Job application system
- Location-based job discovery
- Real-time messaging between workers and employers
- Profile management
- Payment integration (Razorpay)

## Screens Implemented

### Authentication Screens
- Login Screen: Secure user authentication
- Registration Screen: New user account creation

### Worker Screens
- Home Screen: Personalized job recommendations
- Search Screen: Advanced job search with filters
- Nearby Screen: Location-based job discovery
- Messages Screen: Real-time communication
- Profile Screen: Personal information and earnings
- Job Details Screen: Detailed view of specific jobs

### Employer Screens
- Dashboard: Overview of jobs, applications, and earnings
- Post Job: Create new job listings
- Applications: Review and manage job applications

## Project Structure

```
hireconnect_flutter/
├── lib/
│   ├── main.dart              # Entry point with auth wrapper
│   ├── models/                # Data models
│   │   ├── user.dart
│   │   ├── job.dart
│   │   ├── job_application.dart
│   │   ├── message.dart
│   │   └── payment.dart
│   ├── services/              # API services
│   │   ├── api_service.dart
│   │   └── auth_service.dart
│   ├── utils/                 # Utility functions
│   │   ├── ui_helpers.dart
│   │   ├── api_helpers.dart
│   │   └── validation.dart
│   ├── widgets/               # Reusable UI components
│   │   ├── job_card.dart
│   │   └── application_card.dart
│   └── screens/               # UI screens
│       ├── login_screen.dart
│       ├── register_screen.dart
│       ├── home_screen.dart
│       ├── job_details_screen.dart
│       ├── search_screen.dart
│       ├── nearby_screen.dart
│       ├── messages_screen.dart
│       ├── profile_screen.dart
│       ├── employer_dashboard_screen.dart
│       └── post_job_screen.dart
├── assets/
│   ├── images/
│   └── fonts/
└── pubspec.yaml
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hireconnect_flutter
   ```

2. Install dependencies:
   ```bash
   flutter pub get
   ```

3. Run the application:
   ```bash
   flutter run
   ```

## Backend Integration

The app connects to the HireConnect backend API. Make sure the backend server is running before using the app.

Update the `baseUrl` in `lib/services/api_service.dart` and `lib/services/auth_service.dart` to match your backend URL.

## Key Design Principles

- Mobile-first design optimized for outdoor visibility
- Large touch targets (minimum 48px) for users with limited smartphone experience
- Visual-first navigation with recognizable icons
- High contrast colors for outdoor readability
- Simple, intuitive workflows
- Comprehensive authentication and session management

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Submit a pull request