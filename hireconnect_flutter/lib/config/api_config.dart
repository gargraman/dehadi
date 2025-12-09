/// API Configuration for HireConnect Flutter App
/// 
/// This file contains configuration for connecting to the backend API.
/// Update the baseUrl to match your backend deployment.

class ApiConfig {
  // Backend API URL configuration
  // 
  // Development options:
  // - Local development: 'http://localhost:8080/api'
  // - Android emulator: 'http://10.0.2.2:8080/api'
  // - iOS simulator: 'http://localhost:8080/api'
  // - Physical device: 'http://YOUR_COMPUTER_IP:8080/api'
  // 
  // Production:
  // - Replit deployment: 'https://YOUR_REPLIT_APP.replit.app/api'
  // - Custom domain: 'https://your-domain.com/api'
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:8080/api',
  );

  // Feature flags
  static const bool enableDebugLogs = bool.fromEnvironment(
    'ENABLE_DEBUG_LOGS',
    defaultValue: true,
  );

  // Timeouts
  static const Duration requestTimeout = Duration(seconds: 30);
  static const Duration connectionTimeout = Duration(seconds: 10);

  // Get the base API URL
  static String getBaseUrl() {
    return baseUrl;
  }

  // Get auth endpoint URL (baseUrl + /auth)
  static String getAuthUrl(String endpoint) {
    // Ensure endpoint starts with /
    final path = endpoint.startsWith('/') ? endpoint : '/$endpoint';
    return '$baseUrl/auth$path';
  }

  // Get API endpoint URL (baseUrl + endpoint)
  static String getApiUrl(String endpoint) {
    // Ensure endpoint starts with /
    final path = endpoint.startsWith('/') ? endpoint : '/$endpoint';
    return '$baseUrl$path';
  }

  // Log API configuration (for debugging)
  static void logConfig() {
    if (enableDebugLogs) {
      print('=== HireConnect API Configuration ===');
      print('Base URL: $baseUrl');
      print('Example Auth URL: ${getAuthUrl('/login')}');
      print('Example API URL: ${getApiUrl('/jobs')}');
      print('Debug Logs: $enableDebugLogs');
      print('Request Timeout: ${requestTimeout.inSeconds}s');
      print('====================================');
    }
  }
}
