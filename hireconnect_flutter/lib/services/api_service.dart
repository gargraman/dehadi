import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/job.dart';
import '../models/job_application.dart';
import '../models/message.dart';
import '../models/payment.dart';
import '../config/api_config.dart';
import 'auth_service.dart';

class ApiService {
  static String get baseUrl => ApiConfig.baseUrl;

  // Helper method to create authenticated requests
  static Future<http.Response> _authenticatedRequest(
    String method,
    String endpoint, {
    Map<String, String>? headers,
    Object? body,
  }) async {
    final cookies = await _getSessionCookies();
    final Map<String, String> requestHeaders = {
      'Content-Type': 'application/json',
      if (cookies != null) 'cookie': cookies,
      ...?headers,
    };

    http.Response response;
    final url = '$baseUrl$endpoint';

    switch (method.toUpperCase()) {
      case 'GET':
        response = await http.get(Uri.parse(url), headers: requestHeaders);
        break;
      case 'POST':
        response = await http.post(
          Uri.parse(url),
          headers: requestHeaders,
          body: body != null ? jsonEncode(body) : null,
        );
        break;
      case 'PUT':
        response = await http.put(
          Uri.parse(url),
          headers: requestHeaders,
          body: body != null ? jsonEncode(body) : null,
        );
        break;
      case 'DELETE':
        response = await http.delete(Uri.parse(url), headers: requestHeaders);
        break;
      default:
        throw Exception('Unsupported HTTP method: $method');
    }

    // If authentication fails, redirect to login
    if (response.statusCode == 401) {
      await AuthService.logout();
      // In a real app, you'd want to navigate to login screen
    }

    return response;
  }

  static Future<String?> _getSessionCookies() async {
    final prefs = await SharedPreferences.getInstance();
    // In a real Flutter app with session cookies, we would retrieve the session cookie
    // For now, we're just returning null as the http client handles cookies automatically
    // In a more complex scenario, you might store and manage session cookies manually
    return null;
  }

  // User related APIs
  static Future<User?> getCurrentUser() async {
    try {
      final response = await _authenticatedRequest('GET', '/auth/me');

      if (response.statusCode == 200) {
        return User.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Error getting current user: $e');
      return null;
    }
  }

  // Job related APIs
  static Future<List<Job>> getJobs({String? workType, String? location, String? status}) async {
    try {
      String url = '/jobs';
      if (workType != null || location != null || status != null) {
        url += '?';
        final params = [];
        if (workType != null) params.add('workType=$workType');
        if (location != null) params.add('location=$location');
        if (status != null) params.add('status=$status');
        url += params.join('&');
      }

      final response = await _authenticatedRequest('GET', url);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((job) => Job.fromJson(job)).toList();
      }
      return [];
    } catch (e) {
      print('Error getting jobs: $e');
      return [];
    }
  }

  static Future<Job?> getJob(String jobId) async {
    try {
      final response = await _authenticatedRequest('GET', '/jobs/$jobId');

      if (response.statusCode == 200) {
        return Job.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Error getting job: $e');
      return null;
    }
  }

  static Future<Job?> createJob(Job job) async {
    try {
      final response = await _authenticatedRequest('POST', '/jobs', body: job.toJson());

      if (response.statusCode == 200 || response.statusCode == 201) {
        return Job.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Error creating job: $e');
      return null;
    }
  }

  static Future<Job?> updateJobStatus(String jobId, String status) async {
    try {
      final response = await _authenticatedRequest(
        'PATCH', 
        '/jobs/$jobId/status', 
        body: {'status': status}
      );

      if (response.statusCode == 200) {
        return Job.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Error updating job status: $e');
      return null;
    }
  }

  static Future<Job?> assignWorkerToJob(String jobId, String workerId) async {
    try {
      final response = await _authenticatedRequest(
        'POST', 
        '/jobs/$jobId/assign', 
        body: {'workerId': workerId}
      );

      if (response.statusCode == 200) {
        return Job.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Error assigning worker to job: $e');
      return null;
    }
  }

  // Job Application related APIs
  static Future<List<JobApplication>> getApplicationsForJob(String jobId) async {
    try {
      final response = await _authenticatedRequest('GET', '/jobs/$jobId/applications');

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((app) => JobApplication.fromJson(app)).toList();
      }
      return [];
    } catch (e) {
      print('Error getting applications for job: $e');
      return [];
    }
  }

  static Future<List<JobApplication>> getApplicationsForWorker(String workerId) async {
    try {
      final response = await _authenticatedRequest('GET', '/workers/$workerId/applications');

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((app) => JobApplication.fromJson(app)).toList();
      }
      return [];
    } catch (e) {
      print('Error getting applications for worker: $e');
      return [];
    }
  }

  static Future<JobApplication?> createApplication(JobApplication application) async {
    try {
      final response = await _authenticatedRequest(
        'POST', 
        '/applications', 
        body: application.toJson()
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return JobApplication.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Error creating application: $e');
      return null;
    }
  }

  static Future<JobApplication?> updateApplicationStatus(String applicationId, String status) async {
    try {
      final response = await _authenticatedRequest(
        'PATCH', 
        '/applications/$applicationId/status', 
        body: {'status': status}
      );

      if (response.statusCode == 200) {
        return JobApplication.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Error updating application status: $e');
      return null;
    }
  }

  // Message related APIs
  static Future<List<Message>> getMessagesForConversation(String userId1, String userId2) async {
    try {
      final response = await _authenticatedRequest('GET', '/messages/$userId1/$userId2');

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((msg) => Message.fromJson(msg)).toList();
      }
      return [];
    } catch (e) {
      print('Error getting messages: $e');
      return [];
    }
  }

  static Future<Message?> createMessage(Message message) async {
    try {
      final response = await _authenticatedRequest(
        'POST', 
        '/messages', 
        body: message.toJson()
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return Message.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Error creating message: $e');
      return null;
    }
  }

  static Future<void> markMessageAsRead(String messageId) async {
    try {
      final response = await _authenticatedRequest(
        'PATCH', 
        '/messages/$messageId/read'
      );

      if (response.statusCode != 200) {
        print('Error marking message as read: ${response.statusCode}');
      }
    } catch (e) {
      print('Error marking message as read: $e');
    }
  }

  // Payment related APIs
  static Future<Payment?> getPaymentForJob(String jobId) async {
    try {
      final response = await _authenticatedRequest('GET', '/payments/job/$jobId');

      if (response.statusCode == 200) {
        return Payment.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Error getting payment for job: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> createRazorpayOrder(int amount, String currency) async {
    try {
      final response = await _authenticatedRequest(
        'POST', 
        '/payments/create-order', 
        body: {
          'amount': amount,
          'currency': currency,
        }
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Error creating Razorpay order: $e');
      return null;
    }
  }

  static Future<bool> verifyPayment(Map<String, dynamic> paymentData) async {
    try {
      final response = await _authenticatedRequest(
        'POST', 
        '/payments/verify', 
        body: paymentData
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error verifying payment: $e');
      return false;
    }
  }
}