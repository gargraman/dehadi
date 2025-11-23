import 'package:flutter/material.dart';
import 'config/api_config.dart';
import 'services/auth_service.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/employer_dashboard_screen.dart';

void main() {
  // Log API configuration on app start
  ApiConfig.logConfig();
  runApp(const HireConnectApp());
}

class HireConnectApp extends StatelessWidget {
  const HireConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HireConnect - Worker Marketplace',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const AuthWrapper(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({super.key});

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  bool _isCheckingAuth = true;
  bool _isLoggedIn = false;

  @override
  void initState() {
    super.initState();
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    final isLoggedIn = await AuthService.isLoggedIn();
    if (mounted) {
      setState(() {
        _isCheckingAuth = false;
        _isLoggedIn = isLoggedIn;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isCheckingAuth) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return _isLoggedIn ? const HomeOrEmployerWrapper() : const LoginScreen();
  }
}

class HomeOrEmployerWrapper extends StatefulWidget {
  const HomeOrEmployerWrapper({super.key});

  @override
  State<HomeOrEmployerWrapper> createState() => _HomeOrEmployerWrapperState();
}

class _HomeOrEmployerWrapperState extends State<HomeOrEmployerWrapper> {
  @override
  Widget build(BuildContext context) {
    // Get the user from auth service to determine which screen to show
    return FutureBuilder(
      future: AuthService.getCurrentUser(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        final user = snapshot.data;
        if (user == null) {
          // If somehow we get here without a user, redirect to login
          return const LoginScreen();
        }

        if (user.role == 'employer') {
          return const EmployerDashboardScreen();
        } else {
          return const HomeScreen();
        }
      },
    );
  }
}