# HireConnect Flutter Mobile App

A Flutter mobile application for the HireConnect worker marketplace platform, designed for daily-wage and skilled workers across India.

## Features

- **Dual Role Support**: Separate experiences for workers and employers
- **Authentication System**: Secure login and registration
- **Job Management**: Search, browse, and apply for jobs
- **Location-Based Discovery**: Find jobs near your location using GPS
- **Real-Time Messaging**: Direct communication between workers and employers
- **Profile Management**: Manage personal information, skills, and experience
- **Payment Integration**: Secure Razorpay integration for job payments
- **Multilingual Support**: Support for multiple Indian languages

## Screenshots & Screens

### Authentication
- **Login Screen**: Secure user authentication
- **Registration Screen**: New user account creation with role selection

### Worker Screens
- **Home Screen**: Personalized job recommendations feed
- **Search Screen**: Advanced job search with filters (work type, location, wage)
- **Nearby Screen**: GPS-based location discovery of nearby jobs
- **Messages Screen**: Real-time communication with employers
- **Profile Screen**: Personal information, skills, earnings history
- **Job Details Screen**: Detailed view with application functionality

### Employer Screens
- **Dashboard**: Overview of posted jobs, applications, and earnings
- **Post Job**: Create new job listings with details
- **Applications**: Review and manage incoming job applications

## Project Structure

```
hireconnect_flutter/
├── lib/
│   ├── main.dart                  # App entry point with auth wrapper
│   ├── config/                    # Configuration
│   │   └── api_config.dart        # API endpoint configuration
│   ├── models/                    # Data models matching backend schema
│   │   ├── user.dart              # User model
│   │   ├── job.dart               # Job model with status tracking
│   │   ├── job_application.dart   # Job application model
│   │   ├── message.dart           # Message model
│   │   └── payment.dart           # Payment model with Razorpay fields
│   ├── services/                  # API and business logic
│   │   ├── api_service.dart       # RESTful API client
│   │   └── auth_service.dart      # Authentication service
│   ├── utils/                     # Utility functions
│   │   ├── ui_helpers.dart        # UI helper functions
│   │   └── api_helpers.dart       # API utility functions
│   ├── widgets/                   # Reusable UI components
│   │   ├── job_card.dart          # Job listing card
│   │   └── application_card.dart  # Application card
│   └── screens/                   # UI screens
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
│   ├── images/                    # Image assets
│   └── fonts/                     # Inter font family
├── android/                       # Android platform code
├── ios/                           # iOS platform code
├── .env.example                   # Environment configuration example
└── pubspec.yaml                   # Dependencies and configuration
```

## Getting Started

### Prerequisites

- **Flutter SDK**: Version 3.3.0 or higher
- **Dart SDK**: Version 3.0.0 or higher
- **Android Studio** / **Xcode** (for platform-specific development)
- **HireConnect Backend**: Running backend server (see main project README)

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd hireconnect_flutter
   ```

2. **Install Flutter dependencies**:
   ```bash
   flutter pub get
   ```

3. **Configure API endpoint** (see Backend Configuration below)

4. **Run the application**:
   ```bash
   # Development mode (default localhost)
   flutter run
   
   # With custom backend URL
   flutter run --dart-define=API_BASE_URL=http://your-backend-url/api
   
   # Enable debug logs
   flutter run --dart-define=ENABLE_DEBUG_LOGS=true
   ```

## Backend Configuration

The app connects to the HireConnect backend API. You need to configure the backend URL based on your setup:

### Option 1: Command Line (Recommended for Development)

```bash
# Local backend on computer
flutter run --dart-define=API_BASE_URL=http://localhost:8080/api

# Android emulator (localhost on computer)
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:8080/api

# Physical device on same network
flutter run --dart-define=API_BASE_URL=http://192.168.1.100:8080/api

# Production Replit deployment
flutter run --dart-define=API_BASE_URL=https://your-app.replit.app/api
```

### Option 2: IDE Configuration

**VS Code**: Edit `.vscode/launch.json`:
```json
{
  "configurations": [
    {
      "name": "Flutter (Development)",
      "request": "launch",
      "type": "dart",
      "args": [
        "--dart-define=API_BASE_URL=http://10.0.2.2:8080/api",
        "--dart-define=ENABLE_DEBUG_LOGS=true"
      ]
    },
    {
      "name": "Flutter (Production)",
      "request": "launch",
      "type": "dart",
      "args": [
        "--dart-define=API_BASE_URL=https://your-app.replit.app/api",
        "--dart-define=ENABLE_DEBUG_LOGS=false"
      ]
    }
  ]
}
```

**Android Studio**: Run → Edit Configurations → Add `--dart-define` arguments

### Option 3: Modify Code (Quick Testing Only)

Edit `lib/config/api_config.dart` and change the `defaultValue`:
```dart
static const String baseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://10.0.2.2:8080/api', // Change this
);
```

⚠️ **Warning**: Don't commit hardcoded URLs to version control!

## Backend URL Reference

| Environment | Device Type | URL |
|-------------|-------------|-----|
| Local Dev | iOS Simulator | `http://localhost:8080/api` |
| Local Dev | Android Emulator | `http://10.0.2.2:8080/api` |
| Local Dev | Physical Device | `http://YOUR_COMPUTER_IP:8080/api` |
| Production | Any | `https://your-app.replit.app/api` |

**Finding your computer's IP**:
- macOS/Linux: `ifconfig | grep inet`
- Windows: `ipconfig`
- Look for your local network IP (usually `192.168.x.x`)

## Building for Release

### Android

```bash
# Build APK
flutter build apk --dart-define=API_BASE_URL=https://your-app.replit.app/api

# Build App Bundle (for Play Store)
flutter build appbundle --dart-define=API_BASE_URL=https://your-app.replit.app/api
```

Output: `build/app/outputs/flutter-apk/app-release.apk`

### iOS

```bash
# Build for iOS
flutter build ios --dart-define=API_BASE_URL=https://your-app.replit.app/api
```

Then open in Xcode to archive and distribute.

## Development Tips

### Hot Reload

While the app is running, press:
- `r` - Hot reload (preserves state)
- `R` - Hot restart (resets state)
- `q` - Quit

### Debugging

1. **Enable Debug Logs**:
   ```bash
   flutter run --dart-define=ENABLE_DEBUG_LOGS=true
   ```

2. **View Logs**:
   ```bash
   flutter logs
   ```

3. **Check API Configuration**:
   When the app starts, you'll see:
   ```
   === HireConnect API Configuration ===
   Base URL: http://10.0.2.2:8080/api
   Auth URL: http://10.0.2.2:8080/api/auth
   Debug Logs: true
   Request Timeout: 30s
   ====================================
   ```

### Common Issues

**Issue**: "Connection refused" or "Network error"
- **Solution**: 
  - Ensure backend server is running
  - Use correct IP for your device type (see Backend URL Reference)
  - Check firewall settings

**Issue**: "Session expired" or "401 Unauthorized"
- **Solution**: 
  - Logout and login again
  - Clear app data
  - Verify backend session configuration

**Issue**: Android emulator can't reach localhost
- **Solution**: 
  - Use `10.0.2.2` instead of `localhost`
  - Or use computer's LAN IP address

## Key Design Principles

- **Mobile-First**: Optimized for outdoor visibility with high contrast
- **Large Touch Targets**: Minimum 48dp for accessibility
- **Visual Navigation**: Icon-based navigation with text labels
- **Simple Workflows**: Streamlined user experience for low-literacy users
- **Offline Resilience**: Graceful handling of network issues
- **Security**: Session-based authentication with secure credential storage

## Dependencies

### Core
- `flutter`: Flutter framework
- `http`: ^1.1.0 - HTTP client for API calls
- `provider`: ^6.1.1 - State management
- `shared_preferences`: ^2.2.2 - Local storage

### Features
- `geolocator`: ^10.1.0 - GPS location services
- `geocoding`: ^2.1.1 - Address geocoding
- `image_picker`: ^1.0.4 - Camera/gallery image selection

### Development
- `flutter_test`: Testing framework
- `flutter_lints`: ^3.0.0 - Linting rules

## Testing

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage

# Run specific test file
flutter test test/widget_test.dart
```

## Backend Integration

The app integrates with the HireConnect backend for:

- **Authentication**: Login, registration, session management
- **Jobs**: CRUD operations, search, filtering
- **Applications**: Apply to jobs, manage application status
- **Messages**: Real-time messaging between users
- **Payments**: Razorpay payment integration
- **User Profiles**: Profile management, skills, location

**API Documentation**: See the main project's backend documentation

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly on both iOS and Android
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Submit a pull request

## License

This project is part of the HireConnect platform. See the main project LICENSE file.

## Support

For issues, questions, or contributions, please refer to the main HireConnect project repository.

---

**Note**: This Flutter app is designed to work with the HireConnect backend. Ensure your backend is properly configured and running before using the mobile app.
