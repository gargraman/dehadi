// Utility functions for handling API responses and errors

class ApiError {
  final int? statusCode;
  final String message;
  final dynamic details;

  ApiError({this.statusCode, required this.message, this.details});

  @override
  String toString() {
    return 'ApiError{statusCode: $statusCode, message: $message, details: $details}';
  }
}

// Handle API response and return either data or error
Future<T> handleApiResponse<T>(
  Future<T> apiCall(), 
  String errorMessage,
) async {
  try {
    final result = await apiCall();
    return result;
  } catch (e) {
    throw ApiError(
      message: errorMessage,
      details: e,
    );
  }
}

// Check if the error is authentication related
bool isAuthError(dynamic error) {
  if (error is ApiError) {
    return error.statusCode == 401 || error.statusCode == 403;
  }
  return false;
}