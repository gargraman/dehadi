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
import 'screens/onboarding_screen.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/employer_dashboard_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
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
        final fontFamily = localeProvider.getFontFamily();
        
        return MaterialApp(
          title: 'HireConnect',
          debugShowCheckedModeBanner: false,
          
          theme: AppTheme.lightTheme(fontFamily: fontFamily),
          darkTheme: AppTheme.darkTheme(fontFamily: fontFamily),
          themeMode: themeProvider.themeMode,
          
          locale: localeProvider.locale,
          supportedLocales: LocaleProvider.supportedLocales,
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          
          home: const AppEntryPoint(),
        );
      },
    );
  }
}

enum AppFlowStep {
  loading,
  languageSelection,
  onboarding,
  authWrapper,
}

class AppEntryPoint extends StatefulWidget {
  const AppEntryPoint({super.key});

  @override
  State<AppEntryPoint> createState() => _AppEntryPointState();
}

class _AppEntryPointState extends State<AppEntryPoint> {
  AppFlowStep _currentStep = AppFlowStep.loading;
  
  @override
  void initState() {
    super.initState();
    _determineInitialStep();
  }
  
  Future<void> _determineInitialStep() async {
    final prefs = await SharedPreferences.getInstance();
    final hasSelectedLanguage = prefs.containsKey('app_locale');
    final hasCompletedOnboarding = prefs.getBool('onboarding_complete') ?? false;
    
    if (mounted) {
      setState(() {
        if (!hasSelectedLanguage) {
          _currentStep = AppFlowStep.languageSelection;
        } else if (!hasCompletedOnboarding) {
          _currentStep = AppFlowStep.onboarding;
        } else {
          _currentStep = AppFlowStep.authWrapper;
        }
      });
    }
  }
  
  void _onLanguageSelected() {
    setState(() {
      _currentStep = AppFlowStep.onboarding;
    });
  }
  
  void _onOnboardingComplete() {
    setState(() {
      _currentStep = AppFlowStep.authWrapper;
    });
  }

  @override
  Widget build(BuildContext context) {
    switch (_currentStep) {
      case AppFlowStep.loading:
        return const Scaffold(
          body: Center(
            child: CircularProgressIndicator(),
          ),
        );
      
      case AppFlowStep.languageSelection:
        return LanguageSelectionScreen(
          onLanguageSelected: _onLanguageSelected,
        );
      
      case AppFlowStep.onboarding:
        return OnboardingScreen(
          onComplete: _onOnboardingComplete,
        );
      
      case AppFlowStep.authWrapper:
        return const AuthWrapper();
    }
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
