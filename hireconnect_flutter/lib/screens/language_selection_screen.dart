import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/locale_provider.dart';
import '../config/app_theme.dart';

class LanguageSelectionScreen extends StatelessWidget {
  final VoidCallback onLanguageSelected;
  
  const LanguageSelectionScreen({
    super.key,
    required this.onLanguageSelected,
  });

  @override
  Widget build(BuildContext context) {
    final localeProvider = Provider.of<LocaleProvider>(context);
    final theme = Theme.of(context);
    
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppTheme.spacingLg),
          child: Column(
            children: [
              const Spacer(flex: 1),
              
              // App logo/icon
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  Icons.work_rounded,
                  size: 64,
                  color: theme.colorScheme.primary,
                ),
              ),
              
              const SizedBox(height: AppTheme.spacingLg),
              
              // App name
              Text(
                'HireConnect',
                style: theme.textTheme.headlineLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.primary,
                ),
              ),
              
              const SizedBox(height: AppTheme.spacingSm),
              
              // Subtitle
              Text(
                'Worker Marketplace',
                style: theme.textTheme.titleMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
              
              const Spacer(flex: 1),
              
              // Language selection header
              Column(
                children: [
                  Text(
                    'Select Language',
                    style: theme.textTheme.titleLarge,
                  ),
                  const SizedBox(height: AppTheme.spacingXs),
                  Text(
                    'भाषा चुनें',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontFamily: 'NotoSansDevanagari',
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
              
              const SizedBox(height: AppTheme.spacingXl),
              
              // Language options
              ...LocaleProvider.supportedLocales.map((locale) {
                final isSelected = localeProvider.locale == locale;
                final languageName = LocaleProvider.languageNames[locale.languageCode]!;
                final languageNameEnglish = LocaleProvider.languageNamesEnglish[locale.languageCode]!;
                
                return Padding(
                  padding: const EdgeInsets.only(bottom: AppTheme.spacingMd),
                  child: _LanguageOption(
                    languageName: languageName,
                    languageNameEnglish: languageNameEnglish,
                    isSelected: isSelected,
                    fontFamily: locale.languageCode == 'hi' ? 'NotoSansDevanagari' : 'Inter',
                    onTap: () {
                      localeProvider.setLocale(locale);
                    },
                  ),
                );
              }),
              
              const Spacer(flex: 2),
              
              // Continue button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: onLanguageSelected,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        localeProvider.locale.languageCode == 'hi' 
                            ? 'जारी रखें' 
                            : 'Continue',
                      ),
                      const SizedBox(width: AppTheme.spacingSm),
                      const Icon(Icons.arrow_forward_rounded),
                    ],
                  ),
                ),
              ),
              
              const SizedBox(height: AppTheme.spacingLg),
            ],
          ),
        ),
      ),
    );
  }
}

class _LanguageOption extends StatelessWidget {
  final String languageName;
  final String languageNameEnglish;
  final bool isSelected;
  final String fontFamily;
  final VoidCallback onTap;
  
  const _LanguageOption({
    required this.languageName,
    required this.languageNameEnglish,
    required this.isSelected,
    required this.fontFamily,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.all(AppTheme.spacingMd),
          decoration: BoxDecoration(
            color: isSelected 
                ? theme.colorScheme.primary.withOpacity(0.1)
                : theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(AppTheme.radiusMd),
            border: Border.all(
              color: isSelected 
                  ? theme.colorScheme.primary
                  : theme.colorScheme.outline,
              width: isSelected ? 2 : 1,
            ),
          ),
          child: Row(
            children: [
              // Radio indicator
              AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isSelected 
                      ? theme.colorScheme.primary
                      : Colors.transparent,
                  border: Border.all(
                    color: isSelected 
                        ? theme.colorScheme.primary
                        : theme.colorScheme.outline,
                    width: 2,
                  ),
                ),
                child: isSelected
                    ? const Icon(
                        Icons.check_rounded,
                        size: 16,
                        color: Colors.white,
                      )
                    : null,
              ),
              
              const SizedBox(width: AppTheme.spacingMd),
              
              // Language name
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      languageName,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontFamily: fontFamily,
                        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                        color: isSelected 
                            ? theme.colorScheme.primary
                            : theme.colorScheme.onSurface,
                      ),
                    ),
                    if (languageName != languageNameEnglish) ...[
                      const SizedBox(height: 2),
                      Text(
                        languageNameEnglish,
                        style: theme.textTheme.bodySmall?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              
              // Flag/icon placeholder
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: theme.colorScheme.surfaceVariant,
                  borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                ),
                child: Center(
                  child: Text(
                    languageNameEnglish == 'English' ? '🇮🇳' : '🇮🇳',
                    style: const TextStyle(fontSize: 24),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
