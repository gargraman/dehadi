import 'package:flutter/material.dart';

/// HireConnect App Theme
/// 
/// Design principles:
/// - High contrast colors for outdoor visibility
/// - Large touch targets (48dp minimum)
/// - Clear visual hierarchy
/// - Accessible for low-literacy users
class AppTheme {
  // Brand colors
  static const Color primaryColor = Color(0xFF2563EB);      // Bright blue - trust, reliability
  static const Color primaryDark = Color(0xFF1D4ED8);       // Darker blue
  static const Color primaryLight = Color(0xFF60A5FA);      // Lighter blue
  
  static const Color secondaryColor = Color(0xFF059669);    // Emerald green - success, growth
  static const Color secondaryDark = Color(0xFF047857);
  static const Color secondaryLight = Color(0xFF34D399);
  
  static const Color accentColor = Color(0xFFF59E0B);       // Amber - attention, warmth
  static const Color accentDark = Color(0xFFD97706);
  static const Color accentLight = Color(0xFFFBBF24);
  
  // Semantic colors
  static const Color successColor = Color(0xFF10B981);      // Green
  static const Color warningColor = Color(0xFFF59E0B);      // Amber
  static const Color errorColor = Color(0xFFEF4444);        // Red
  static const Color infoColor = Color(0xFF3B82F6);         // Blue
  
  // Neutral colors - Light mode
  static const Color backgroundLight = Color(0xFFF8FAFC);
  static const Color surfaceLight = Color(0xFFFFFFFF);
  static const Color cardLight = Color(0xFFFFFFFF);
  static const Color textPrimaryLight = Color(0xFF1E293B);
  static const Color textSecondaryLight = Color(0xFF64748B);
  static const Color textTertiaryLight = Color(0xFF94A3B8);
  static const Color dividerLight = Color(0xFFE2E8F0);
  
  // Neutral colors - Dark mode
  static const Color backgroundDark = Color(0xFF0F172A);
  static const Color surfaceDark = Color(0xFF1E293B);
  static const Color cardDark = Color(0xFF1E293B);
  static const Color textPrimaryDark = Color(0xFFF8FAFC);
  static const Color textSecondaryDark = Color(0xFF94A3B8);
  static const Color textTertiaryDark = Color(0xFF64748B);
  static const Color dividerDark = Color(0xFF334155);
  
  // Job category colors
  static const Map<String, Color> categoryColors = {
    'mason': Color(0xFFEF4444),
    'electrician': Color(0xFFF59E0B),
    'plumber': Color(0xFF3B82F6),
    'carpenter': Color(0xFF8B5CF6),
    'painter': Color(0xFFEC4899),
    'cleaner': Color(0xFF10B981),
    'driver': Color(0xFF6366F1),
    'helper': Color(0xFF14B8A6),
    'cook': Color(0xFFF97316),
    'gardener': Color(0xFF22C55E),
    'security': Color(0xFF64748B),
    'tailor': Color(0xFFD946EF),
    'mechanic': Color(0xFF78716C),
    'welder': Color(0xFFEAB308),
    'other': Color(0xFF6B7280),
  };

  // Typography
  static const String fontFamilyPrimary = 'Inter';
  static const String fontFamilyHindi = 'NotoSansDevanagari';
  
  // Spacing
  static const double spacingXs = 4.0;
  static const double spacingSm = 8.0;
  static const double spacingMd = 16.0;
  static const double spacingLg = 24.0;
  static const double spacingXl = 32.0;
  static const double spacingXxl = 48.0;
  
  // Border radius
  static const double radiusSm = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 24.0;
  static const double radiusFull = 999.0;
  
  // Touch targets (accessibility)
  static const double minTouchTarget = 48.0;
  static const double buttonHeight = 56.0;
  static const double inputHeight = 56.0;
  
  // Icon sizes
  static const double iconSizeSm = 20.0;
  static const double iconSizeMd = 24.0;
  static const double iconSizeLg = 32.0;
  static const double iconSizeXl = 48.0;
  
  // Light theme
  static ThemeData lightTheme({String fontFamily = fontFamilyPrimary}) {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      fontFamily: fontFamily,
      
      // Color scheme
      colorScheme: ColorScheme.light(
        primary: primaryColor,
        onPrimary: Colors.white,
        primaryContainer: primaryLight.withOpacity(0.2),
        onPrimaryContainer: primaryDark,
        secondary: secondaryColor,
        onSecondary: Colors.white,
        secondaryContainer: secondaryLight.withOpacity(0.2),
        onSecondaryContainer: secondaryDark,
        tertiary: accentColor,
        onTertiary: Colors.white,
        tertiaryContainer: accentLight.withOpacity(0.2),
        onTertiaryContainer: accentDark,
        error: errorColor,
        onError: Colors.white,
        background: backgroundLight,
        onBackground: textPrimaryLight,
        surface: surfaceLight,
        onSurface: textPrimaryLight,
        surfaceVariant: const Color(0xFFF1F5F9),
        onSurfaceVariant: textSecondaryLight,
        outline: dividerLight,
        outlineVariant: const Color(0xFFCBD5E1),
      ),
      
      // Scaffold
      scaffoldBackgroundColor: backgroundLight,
      
      // App bar
      appBarTheme: AppBarTheme(
        elevation: 0,
        scrolledUnderElevation: 1,
        centerTitle: false,
        backgroundColor: surfaceLight,
        foregroundColor: textPrimaryLight,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimaryLight,
        ),
        iconTheme: const IconThemeData(
          color: textPrimaryLight,
          size: iconSizeMd,
        ),
      ),
      
      // Bottom navigation bar
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: surfaceLight,
        selectedItemColor: primaryColor,
        unselectedItemColor: textSecondaryLight,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        selectedLabelStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
      
      // Navigation bar (Material 3)
      navigationBarTheme: NavigationBarThemeData(
        height: 80,
        elevation: 0,
        backgroundColor: surfaceLight,
        indicatorColor: primaryColor.withOpacity(0.15),
        labelTextStyle: MaterialStateProperty.resolveWith((states) {
          if (states.contains(MaterialState.selected)) {
            return TextStyle(
              fontFamily: fontFamily,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: primaryColor,
            );
          }
          return TextStyle(
            fontFamily: fontFamily,
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: textSecondaryLight,
          );
        }),
        iconTheme: MaterialStateProperty.resolveWith((states) {
          if (states.contains(MaterialState.selected)) {
            return const IconThemeData(color: primaryColor, size: iconSizeLg);
          }
          return const IconThemeData(color: textSecondaryLight, size: iconSizeLg);
        }),
      ),
      
      // Cards
      cardTheme: CardTheme(
        elevation: 0,
        color: cardLight,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          side: BorderSide(color: dividerLight, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      
      // Elevated buttons
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          elevation: 0,
          minimumSize: const Size(double.infinity, buttonHeight),
          backgroundColor: primaryColor,
          foregroundColor: Colors.white,
          disabledBackgroundColor: textTertiaryLight,
          disabledForegroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusMd),
          ),
          textStyle: TextStyle(
            fontFamily: fontFamily,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: spacingLg,
            vertical: spacingMd,
          ),
        ),
      ),
      
      // Outlined buttons
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(double.infinity, buttonHeight),
          foregroundColor: primaryColor,
          side: const BorderSide(color: primaryColor, width: 1.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusMd),
          ),
          textStyle: TextStyle(
            fontFamily: fontFamily,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: spacingLg,
            vertical: spacingMd,
          ),
        ),
      ),
      
      // Text buttons
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          minimumSize: const Size(minTouchTarget, minTouchTarget),
          foregroundColor: primaryColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusSm),
          ),
          textStyle: TextStyle(
            fontFamily: fontFamily,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      
      // Floating action button
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: primaryColor,
        foregroundColor: Colors.white,
        elevation: 4,
        shape: CircleBorder(),
      ),
      
      // Input decoration
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceLight,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: spacingMd,
          vertical: spacingMd,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: BorderSide(color: dividerLight, width: 1),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: BorderSide(color: dividerLight, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: primaryColor, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: errorColor, width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: errorColor, width: 2),
        ),
        labelStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 16,
          color: textSecondaryLight,
        ),
        hintStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 16,
          color: textTertiaryLight,
        ),
        errorStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 12,
          color: errorColor,
        ),
        prefixIconColor: textSecondaryLight,
        suffixIconColor: textSecondaryLight,
      ),
      
      // Chips
      chipTheme: ChipThemeData(
        backgroundColor: surfaceLight,
        selectedColor: primaryColor.withOpacity(0.15),
        labelStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusFull),
          side: BorderSide(color: dividerLight),
        ),
        padding: const EdgeInsets.symmetric(horizontal: spacingSm),
      ),
      
      // Dialogs
      dialogTheme: DialogTheme(
        backgroundColor: surfaceLight,
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusLg),
        ),
        titleTextStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimaryLight,
        ),
        contentTextStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 16,
          color: textSecondaryLight,
        ),
      ),
      
      // Bottom sheets
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: surfaceLight,
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(radiusXl),
          ),
        ),
      ),
      
      // Snackbar
      snackBarTheme: SnackBarThemeData(
        backgroundColor: textPrimaryLight,
        contentTextStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 14,
          color: Colors.white,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusSm),
        ),
        behavior: SnackBarBehavior.floating,
      ),
      
      // Divider
      dividerTheme: const DividerThemeData(
        color: dividerLight,
        thickness: 1,
        space: 1,
      ),
      
      // Text theme
      textTheme: _buildTextTheme(fontFamily, textPrimaryLight, textSecondaryLight),
    );
  }
  
  // Dark theme
  static ThemeData darkTheme({String fontFamily = fontFamilyPrimary}) {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      fontFamily: fontFamily,
      
      // Color scheme
      colorScheme: ColorScheme.dark(
        primary: primaryLight,
        onPrimary: primaryDark,
        primaryContainer: primaryColor.withOpacity(0.3),
        onPrimaryContainer: primaryLight,
        secondary: secondaryLight,
        onSecondary: secondaryDark,
        secondaryContainer: secondaryColor.withOpacity(0.3),
        onSecondaryContainer: secondaryLight,
        tertiary: accentLight,
        onTertiary: accentDark,
        tertiaryContainer: accentColor.withOpacity(0.3),
        onTertiaryContainer: accentLight,
        error: const Color(0xFFF87171),
        onError: const Color(0xFF7F1D1D),
        background: backgroundDark,
        onBackground: textPrimaryDark,
        surface: surfaceDark,
        onSurface: textPrimaryDark,
        surfaceVariant: const Color(0xFF334155),
        onSurfaceVariant: textSecondaryDark,
        outline: dividerDark,
        outlineVariant: const Color(0xFF475569),
      ),
      
      // Scaffold
      scaffoldBackgroundColor: backgroundDark,
      
      // App bar
      appBarTheme: AppBarTheme(
        elevation: 0,
        scrolledUnderElevation: 1,
        centerTitle: false,
        backgroundColor: surfaceDark,
        foregroundColor: textPrimaryDark,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimaryDark,
        ),
        iconTheme: const IconThemeData(
          color: textPrimaryDark,
          size: iconSizeMd,
        ),
      ),
      
      // Bottom navigation bar
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: surfaceDark,
        selectedItemColor: primaryLight,
        unselectedItemColor: textSecondaryDark,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
        selectedLabelStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 12,
          fontWeight: FontWeight.w600,
        ),
        unselectedLabelStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
      
      // Navigation bar (Material 3)
      navigationBarTheme: NavigationBarThemeData(
        height: 80,
        elevation: 0,
        backgroundColor: surfaceDark,
        indicatorColor: primaryLight.withOpacity(0.2),
        labelTextStyle: MaterialStateProperty.resolveWith((states) {
          if (states.contains(MaterialState.selected)) {
            return TextStyle(
              fontFamily: fontFamily,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: primaryLight,
            );
          }
          return TextStyle(
            fontFamily: fontFamily,
            fontSize: 12,
            fontWeight: FontWeight.w500,
            color: textSecondaryDark,
          );
        }),
        iconTheme: MaterialStateProperty.resolveWith((states) {
          if (states.contains(MaterialState.selected)) {
            return const IconThemeData(color: primaryLight, size: iconSizeLg);
          }
          return const IconThemeData(color: textSecondaryDark, size: iconSizeLg);
        }),
      ),
      
      // Cards
      cardTheme: CardTheme(
        elevation: 0,
        color: cardDark,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          side: BorderSide(color: dividerDark, width: 1),
        ),
        margin: EdgeInsets.zero,
      ),
      
      // Elevated buttons
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          elevation: 0,
          minimumSize: const Size(double.infinity, buttonHeight),
          backgroundColor: primaryLight,
          foregroundColor: primaryDark,
          disabledBackgroundColor: textTertiaryDark,
          disabledForegroundColor: textSecondaryDark,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusMd),
          ),
          textStyle: TextStyle(
            fontFamily: fontFamily,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: spacingLg,
            vertical: spacingMd,
          ),
        ),
      ),
      
      // Outlined buttons
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(double.infinity, buttonHeight),
          foregroundColor: primaryLight,
          side: const BorderSide(color: primaryLight, width: 1.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusMd),
          ),
          textStyle: TextStyle(
            fontFamily: fontFamily,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
          padding: const EdgeInsets.symmetric(
            horizontal: spacingLg,
            vertical: spacingMd,
          ),
        ),
      ),
      
      // Text buttons
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          minimumSize: const Size(minTouchTarget, minTouchTarget),
          foregroundColor: primaryLight,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(radiusSm),
          ),
          textStyle: TextStyle(
            fontFamily: fontFamily,
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      
      // Floating action button
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
        backgroundColor: primaryLight,
        foregroundColor: primaryDark,
        elevation: 4,
        shape: CircleBorder(),
      ),
      
      // Input decoration
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceDark,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: spacingMd,
          vertical: spacingMd,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: BorderSide(color: dividerDark, width: 1),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: BorderSide(color: dividerDark, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: primaryLight, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: Color(0xFFF87171), width: 1),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(radiusMd),
          borderSide: const BorderSide(color: Color(0xFFF87171), width: 2),
        ),
        labelStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 16,
          color: textSecondaryDark,
        ),
        hintStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 16,
          color: textTertiaryDark,
        ),
        errorStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 12,
          color: const Color(0xFFF87171),
        ),
        prefixIconColor: textSecondaryDark,
        suffixIconColor: textSecondaryDark,
      ),
      
      // Chips
      chipTheme: ChipThemeData(
        backgroundColor: surfaceDark,
        selectedColor: primaryLight.withOpacity(0.2),
        labelStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusFull),
          side: BorderSide(color: dividerDark),
        ),
        padding: const EdgeInsets.symmetric(horizontal: spacingSm),
      ),
      
      // Dialogs
      dialogTheme: DialogTheme(
        backgroundColor: surfaceDark,
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusLg),
        ),
        titleTextStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimaryDark,
        ),
        contentTextStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 16,
          color: textSecondaryDark,
        ),
      ),
      
      // Bottom sheets
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: surfaceDark,
        elevation: 8,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(radiusXl),
          ),
        ),
      ),
      
      // Snackbar
      snackBarTheme: SnackBarThemeData(
        backgroundColor: textPrimaryDark,
        contentTextStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 14,
          color: backgroundDark,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusSm),
        ),
        behavior: SnackBarBehavior.floating,
      ),
      
      // Divider
      dividerTheme: const DividerThemeData(
        color: dividerDark,
        thickness: 1,
        space: 1,
      ),
      
      // Text theme
      textTheme: _buildTextTheme(fontFamily, textPrimaryDark, textSecondaryDark),
    );
  }
  
  static TextTheme _buildTextTheme(
    String fontFamily,
    Color primaryColor,
    Color secondaryColor,
  ) {
    return TextTheme(
      // Display styles
      displayLarge: TextStyle(
        fontFamily: fontFamily,
        fontSize: 57,
        fontWeight: FontWeight.w700,
        color: primaryColor,
        height: 1.12,
      ),
      displayMedium: TextStyle(
        fontFamily: fontFamily,
        fontSize: 45,
        fontWeight: FontWeight.w700,
        color: primaryColor,
        height: 1.16,
      ),
      displaySmall: TextStyle(
        fontFamily: fontFamily,
        fontSize: 36,
        fontWeight: FontWeight.w600,
        color: primaryColor,
        height: 1.22,
      ),
      
      // Headline styles
      headlineLarge: TextStyle(
        fontFamily: fontFamily,
        fontSize: 32,
        fontWeight: FontWeight.w600,
        color: primaryColor,
        height: 1.25,
      ),
      headlineMedium: TextStyle(
        fontFamily: fontFamily,
        fontSize: 28,
        fontWeight: FontWeight.w600,
        color: primaryColor,
        height: 1.29,
      ),
      headlineSmall: TextStyle(
        fontFamily: fontFamily,
        fontSize: 24,
        fontWeight: FontWeight.w600,
        color: primaryColor,
        height: 1.33,
      ),
      
      // Title styles
      titleLarge: TextStyle(
        fontFamily: fontFamily,
        fontSize: 22,
        fontWeight: FontWeight.w600,
        color: primaryColor,
        height: 1.27,
      ),
      titleMedium: TextStyle(
        fontFamily: fontFamily,
        fontSize: 16,
        fontWeight: FontWeight.w600,
        color: primaryColor,
        height: 1.5,
      ),
      titleSmall: TextStyle(
        fontFamily: fontFamily,
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: primaryColor,
        height: 1.43,
      ),
      
      // Body styles
      bodyLarge: TextStyle(
        fontFamily: fontFamily,
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: primaryColor,
        height: 1.5,
      ),
      bodyMedium: TextStyle(
        fontFamily: fontFamily,
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: secondaryColor,
        height: 1.43,
      ),
      bodySmall: TextStyle(
        fontFamily: fontFamily,
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: secondaryColor,
        height: 1.33,
      ),
      
      // Label styles
      labelLarge: TextStyle(
        fontFamily: fontFamily,
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: primaryColor,
        height: 1.43,
      ),
      labelMedium: TextStyle(
        fontFamily: fontFamily,
        fontSize: 12,
        fontWeight: FontWeight.w600,
        color: secondaryColor,
        height: 1.33,
      ),
      labelSmall: TextStyle(
        fontFamily: fontFamily,
        fontSize: 11,
        fontWeight: FontWeight.w500,
        color: secondaryColor,
        height: 1.45,
      ),
    );
  }
  
  // Get color for job category
  static Color getCategoryColor(String category) {
    return categoryColors[category.toLowerCase()] ?? categoryColors['other']!;
  }
}
