/// API Configuration for HireConnect Flutter App
/// 
/// This file contains configuration for connecting to the backend API.
/// Update the baseUrl to match your backend deployment.

class ApiConfig {
  // Backend API URL configuration
  // 
  // Development options:
  // - Local development: 'http://localhost:5000/api'
  // - Android emulator: 'http://10.0.2.2:5000/api'
  // - iOS simulator: 'http://localhost:5000/api'
  // - Physical device: 'http://YOUR_COMPUTER_IP:5000/api'
  // 
  // Production:
  // - Replit deployment: 'https://YOUR_REPLIT_APP.replit.app/api'
  // - Custom domain: 'https://your-domain.com/api'
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:5000/api',
  );

  // Auth endpoints
  static String get authBaseUrl => '$baseUrl/auth';
  
  // Feature flags
  static const bool enableDebugLogs = bool.fromEnvironment(
    'ENABLE_DEBUG_LOGS',
    defaultValue: true,
  );

  // Timeouts
  static const Duration requestTimeout = Duration(seconds: 30);
  static const Duration connectionTimeout = Duration(seconds: 10);

  // Get the appropriate base URL based on the platform and environment
  static String getBaseUrl() {
    // You can add platform-specific logic here if needed
    return baseUrl;
  }

  // Log API configuration (for debugging)
  static void logConfig() {
    if (enableDebugLogs) {
      print('=== HireConnect API Configuration ===');
      print('Base URL: $baseUrl');
      print('Auth URL: $authBaseUrl');
      print('Debug Logs: $enableDebugLogs');
      print('Request Timeout: ${requestTimeout.inSeconds}s');
      print('====================================');
    }
  }
}
