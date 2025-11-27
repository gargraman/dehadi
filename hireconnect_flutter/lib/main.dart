import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'config/api_config.dart';
import 'config/app_theme.dart';
import 'l10n/app_localizations.dart';
import 'providers/locale_provider.dart';
import 'providers/theme_provider.dart';
import 'services/auth_service.dart';
import 'screens/language_selection_screen.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/employer_dashboard_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  // Log API configuration on app start
  ApiConfig.logConfig();
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LocaleProvider()),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
      ],
      child: const HireConnectApp(),
    ),
  );
}

class HireConnectApp extends StatelessWidget {
  const HireConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<LocaleProvider, ThemeProvider>(
      builder: (context, localeProvider, themeProvider, child) {
        // Get font family based on locale
        final fontFamily = localeProvider.getFontFamily();
        
        return MaterialApp(
          title: 'HireConnect',
          debugShowCheckedModeBanner: false,
          
          // Theme configuration
          theme: AppTheme.lightTheme(fontFamily: fontFamily),
          darkTheme: AppTheme.darkTheme(fontFamily: fontFamily),
          themeMode: themeProvider.themeMode,
          
          // Localization
          locale: localeProvider.locale,
          supportedLocales: LocaleProvider.supportedLocales,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          
          // App entry point
          home: const AppEntryPoint(),
        );
      },
    );
  }
}

class AppEntryPoint extends StatefulWidget {
  const AppEntryPoint({super.key});

  @override
  State<AppEntryPoint> createState() => _AppEntryPointState();
}

class _AppEntryPointState extends State<AppEntryPoint> {
  bool _isLoading = true;
  bool _showLanguageSelection = false;
  
  @override
  void initState() {
    super.initState();
    _checkFirstTimeUser();
  }
  
  Future<void> _checkFirstTimeUser() async {
    final prefs = await SharedPreferences.getInstance();
    final hasSelectedLanguage = prefs.containsKey('app_locale');
    
    if (mounted) {
      setState(() {
        _showLanguageSelection = !hasSelectedLanguage;
        _isLoading = false;
      });
    }
  }
  
  void _onLanguageSelected() {
    setState(() {
      _showLanguageSelection = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(),
        ),
      );
    }
    
    if (_showLanguageSelection) {
      return LanguageSelectionScreen(
        onLanguageSelected: _onLanguageSelected,
      );
    }
    
    return const AuthWrapper();
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
