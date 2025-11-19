import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';

class AuthService {
  static const String baseUrl = 'http://localhost:5000/api/auth'; // Update to your backend URL

  // Store auth token and user data
  static Future<void> _saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user', jsonEncode(user.toJson()));
    await prefs.setString('userId', user.id);
    await prefs.setString('username', user.username);
    await prefs.setString('role', user.role);
  }

  static Future<User?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userData = prefs.getString('user');
    if (userData != null) {
      return User.fromJson(jsonDecode(userData));
    }
    return null;
  }

  static Future<bool> isLoggedIn() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('userId') != null;
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('user');
    await prefs.remove('userId');
    await prefs.remove('username');
    await prefs.remove('role');
  }

  // Registration
  static Future<User?> register({
    required String username,
    required String password,
    required String role,
    required String fullName,
    required String phone,
    String? language,
    String? location,
    List<String>? skills,
    String? aadhar,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'password': password,
          'role': role,
          'fullName': fullName,
          'phone': phone,
          'language': language ?? 'en',
          'location': location,
          'skills': skills != null ? skills.join(',') : null, // Backend expects comma-separated string
          'aadhar': aadhar,
        }),
      );

      if (response.statusCode == 201) {
        final userData = jsonDecode(response.body);
        final user = User(
          id: userData['id'],
          username: userData['username'],
          fullName: userData['fullName'],
          phone: phone, // Phone is not returned by backend, so we pass it from input
          role: userData['role'],
          language: userData['language'],
        );
        
        await _saveUser(user);
        return user;
      } else {
        final errorData = jsonDecode(response.body);
        throw Exception(errorData['message'] ?? 'Registration failed');
      }
    } catch (e) {
      print('Registration error: $e');
      throw Exception('Registration failed: $e');
    }
  }

  // Login
  static Future<User?> login({
    required String username,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        final userData = responseData['user'];

        // Get full user details after login
        final userResponse = await http.get(
          Uri.parse('$baseUrl/me'),
          headers: {
            'Content-Type': 'application/json',
            // Session cookie should be automatically included by http client
          },
        );

        if (userResponse.statusCode == 200) {
          final fullUserData = jsonDecode(userResponse.body);
          final user = User(
            id: fullUserData['id'],
            username: fullUserData['username'],
            fullName: fullUserData['fullName'],
            phone: fullUserData['phone'],
            role: fullUserData['role'],
            language: fullUserData['language'],
            location: fullUserData['location'],
            skills: fullUserData['skills'],
          );

          await _saveUser(user);
          return user;
        }
      } else {
        final errorData = jsonDecode(response.body);
        throw Exception(errorData['message'] ?? 'Login failed');
      }
    } catch (e) {
      print('Login error: $e');
      throw Exception('Login failed: $e');
    }

    return null;
  }

  // Logout
  static Future<void> logoutUser() async {
    try {
      await http.post(
        Uri.parse('$baseUrl/logout'),
        headers: {'Content-Type': 'application/json'},
      );
    } catch (e) {
      print('Logout error: $e');
      // Even if backend logout fails, we should clear local data
    } finally {
      await logout();
    }
  }

  // Get current user status
  static Future<Map<String, dynamic>?> getAuthStatus() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/status'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      print('Auth status error: $e');
    }
    return null;
  }
}