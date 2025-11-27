import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LocaleProvider extends ChangeNotifier {
  static const String _localeKey = 'app_locale';
  
  Locale _locale = const Locale('en');
  bool _isInitialized = false;

  Locale get locale => _locale;
  bool get isInitialized => _isInitialized;
  
  // Supported locales
  static const List<Locale> supportedLocales = [
    Locale('en'), // English
    Locale('hi'), // Hindi
  ];

  // Language display names
  static const Map<String, String> languageNames = {
    'en': 'English',
    'hi': 'हिंदी',
  };

  // Language display names in English (for accessibility)
  static const Map<String, String> languageNamesEnglish = {
    'en': 'English',
    'hi': 'Hindi',
  };

  LocaleProvider() {
    _loadSavedLocale();
  }

  Future<void> _loadSavedLocale() async {
    final prefs = await SharedPreferences.getInstance();
    final savedLocale = prefs.getString(_localeKey);
    if (savedLocale != null) {
      _locale = Locale(savedLocale);
    }
    _isInitialized = true;
    notifyListeners();
  }

  Future<void> setLocale(Locale locale) async {
    if (!supportedLocales.contains(locale)) return;
    
    _locale = locale;
    notifyListeners();
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_localeKey, locale.languageCode);
  }

  Future<void> setLocaleByCode(String languageCode) async {
    await setLocale(Locale(languageCode));
  }

  String getLanguageName(String languageCode) {
    return languageNames[languageCode] ?? languageCode;
  }

  String getCurrentLanguageName() {
    return languageNames[_locale.languageCode] ?? _locale.languageCode;
  }

  // Check if first time user (no language selected)
  Future<bool> isFirstTimeUser() async {
    final prefs = await SharedPreferences.getInstance();
    return !prefs.containsKey(_localeKey);
  }

  // Get font family for current locale
  String getFontFamily() {
    switch (_locale.languageCode) {
      case 'hi':
        return 'NotoSansDevanagari';
      default:
        return 'Inter';
    }
  }
}
