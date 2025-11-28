import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/app_theme.dart';
import '../l10n/app_localizations.dart';

enum OnboardingStep {
  roleSelection,
  skillSelection,
}

class OnboardingScreen extends StatefulWidget {
  final VoidCallback onComplete;
  
  const OnboardingScreen({
    Key? key,
    required this.onComplete,
  }) : super(key: key);

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  OnboardingStep _currentStep = OnboardingStep.roleSelection;
  String? _selectedRole;
  Set<String> _selectedSkills = <String>{};
  
  final List<String> _availableSkills = [
    'mason', 'electrician', 'plumber', 'carpenter', 
    'painter', 'cleaner', 'driver', 'helper', 
    'cook', 'gardener', 'security', 'tailor',
    'mechanic', 'welder'
  ];
  
  Future<void> _saveOnboardingData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_role', _selectedRole ?? 'worker');
    await prefs.setStringList('user_skills', _selectedSkills.toList());
    await prefs.setBool('onboarding_complete', true);
  }
  
  void _onRoleSelected(String role) {
    setState(() {
      _selectedRole = role;
    });
  }
  
  void _onNextPressed() {
    if (_currentStep == OnboardingStep.roleSelection) {
      if (_selectedRole == 'worker') {
        setState(() {
          _currentStep = OnboardingStep.skillSelection;
        });
      } else {
        _completeOnboarding();
      }
    } else if (_currentStep == OnboardingStep.skillSelection) {
      _completeOnboarding();
    }
  }
  
  void _onBackPressed() {
    if (_currentStep == OnboardingStep.skillSelection) {
      setState(() {
        _currentStep = OnboardingStep.roleSelection;
      });
    }
  }
  
  Future<void> _completeOnboarding() async {
    await _saveOnboardingData();
    widget.onComplete();
  }
  
  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);
    
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            _buildProgressIndicator(theme),
            Expanded(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: _currentStep == OnboardingStep.roleSelection
                    ? _buildRoleSelectionStep(l10n, theme)
                    : _buildSkillSelectionStep(l10n, theme),
              ),
            ),
            _buildBottomButtons(l10n, theme),
          ],
        ),
      ),
    );
  }
  
  Widget _buildProgressIndicator(ThemeData theme) {
    final totalSteps = _selectedRole == 'worker' ? 2 : 1;
    final currentStepIndex = _currentStep == OnboardingStep.roleSelection ? 0 : 1;
    
    return Padding(
      padding: const EdgeInsets.all(AppTheme.spacingMd),
      child: Row(
        children: List.generate(totalSteps, (index) {
          final isActive = index <= currentStepIndex;
          return Expanded(
            child: Container(
              height: 4,
              margin: EdgeInsets.only(right: index < totalSteps - 1 ? AppTheme.spacingSm : 0),
              decoration: BoxDecoration(
                color: isActive 
                    ? theme.colorScheme.primary 
                    : theme.colorScheme.primary.withOpacity(0.2),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          );
        }),
      ),
    );
  }
  
  Widget _buildRoleSelectionStep(AppLocalizations? l10n, ThemeData theme) {
    final isDark = theme.brightness == Brightness.dark;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppTheme.spacingLg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: AppTheme.spacingXl),
          Icon(
            Icons.handshake,
            size: 80,
            color: theme.colorScheme.primary,
          ),
          const SizedBox(height: AppTheme.spacingLg),
          Text(
            l10n?.chooseYourRole ?? 'How will you use HireConnect?',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppTheme.spacingXl),
          
          _buildRoleCard(
            role: 'worker',
            icon: Icons.construction,
            title: l10n?.worker ?? 'Worker',
            description: l10n?.workerRoleDescription ?? 'Find daily wage jobs near you',
            theme: theme,
            isDark: isDark,
          ),
          const SizedBox(height: AppTheme.spacingMd),
          
          _buildRoleCard(
            role: 'employer',
            icon: Icons.business,
            title: l10n?.employer ?? 'Employer',
            description: l10n?.employerRoleDescription ?? 'Post jobs and hire skilled workers',
            theme: theme,
            isDark: isDark,
          ),
        ],
      ),
    );
  }
  
  Widget _buildRoleCard({
    required String role,
    required IconData icon,
    required String title,
    required String description,
    required ThemeData theme,
    required bool isDark,
  }) {
    final isSelected = _selectedRole == role;
    final primaryColor = role == 'worker' ? AppTheme.primaryColor : AppTheme.secondaryColor;
    
    return GestureDetector(
      onTap: () => _onRoleSelected(role),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(AppTheme.spacingLg),
        decoration: BoxDecoration(
          color: isSelected 
              ? primaryColor.withOpacity(0.1)
              : (isDark ? AppTheme.cardDark : AppTheme.cardLight),
          borderRadius: BorderRadius.circular(AppTheme.radiusLg),
          border: Border.all(
            color: isSelected ? primaryColor : theme.dividerColor,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected ? [
            BoxShadow(
              color: primaryColor.withOpacity(0.2),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ] : null,
        ),
        child: Row(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: isSelected 
                    ? primaryColor.withOpacity(0.2)
                    : primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              ),
              child: Icon(
                icon,
                size: 32,
                color: primaryColor,
              ),
            ),
            const SizedBox(width: AppTheme.spacingMd),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: isSelected ? primaryColor : null,
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingXs),
                  Text(
                    description,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: isDark 
                          ? AppTheme.textSecondaryDark 
                          : AppTheme.textSecondaryLight,
                    ),
                  ),
                ],
              ),
            ),
            if (isSelected)
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: primaryColor,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check,
                  color: Colors.white,
                  size: 18,
                ),
              )
            else
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  border: Border.all(color: theme.dividerColor, width: 2),
                  shape: BoxShape.circle,
                ),
              ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildSkillSelectionStep(AppLocalizations? l10n, ThemeData theme) {
    final isDark = theme.brightness == Brightness.dark;
    
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppTheme.spacingLg),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          const SizedBox(height: AppTheme.spacingLg),
          Icon(
            Icons.handyman,
            size: 64,
            color: theme.colorScheme.primary,
          ),
          const SizedBox(height: AppTheme.spacingMd),
          Text(
            l10n?.selectYourSkills ?? 'Select Your Skills',
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppTheme.spacingSm),
          Text(
            l10n?.whatSkillsDoYouHave ?? 'What work can you do?',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: isDark 
                  ? AppTheme.textSecondaryDark 
                  : AppTheme.textSecondaryLight,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: AppTheme.spacingXl),
          
          Wrap(
            spacing: AppTheme.spacingMd,
            runSpacing: AppTheme.spacingMd,
            alignment: WrapAlignment.center,
            children: _availableSkills.map((skill) {
              return _buildSkillChip(skill, l10n, theme, isDark);
            }).toList(),
          ),
          
          if (_selectedSkills.isEmpty)
            Padding(
              padding: const EdgeInsets.only(top: AppTheme.spacingLg),
              child: Text(
                l10n?.selectAtLeastOneSkill ?? 'Please select at least one skill',
                style: theme.textTheme.bodySmall?.copyWith(
                  color: AppTheme.warningColor,
                ),
              ),
            ),
        ],
      ),
    );
  }
  
  Widget _buildSkillChip(String skill, AppLocalizations? l10n, ThemeData theme, bool isDark) {
    final isSelected = _selectedSkills.contains(skill);
    final color = AppTheme.categoryColors[skill] ?? AppTheme.primaryColor;
    
    return GestureDetector(
      onTap: () {
        setState(() {
          if (isSelected) {
            _selectedSkills.remove(skill);
          } else {
            _selectedSkills.add(skill);
          }
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(
          horizontal: AppTheme.spacingMd,
          vertical: AppTheme.spacingMd,
        ),
        decoration: BoxDecoration(
          color: isSelected 
              ? color.withOpacity(0.15)
              : (isDark ? AppTheme.surfaceDark : AppTheme.surfaceLight),
          borderRadius: BorderRadius.circular(AppTheme.radiusMd),
          border: Border.all(
            color: isSelected ? color : theme.dividerColor,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: color.withOpacity(isSelected ? 0.2 : 0.1),
                borderRadius: BorderRadius.circular(AppTheme.radiusSm),
              ),
              child: Icon(
                _getSkillIcon(skill),
                color: color,
                size: 28,
              ),
            ),
            const SizedBox(height: AppTheme.spacingSm),
            Text(
              l10n?.getWorkType(skill) ?? skill,
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                color: isSelected ? color : null,
              ),
            ),
            if (isSelected)
              Padding(
                padding: const EdgeInsets.only(top: AppTheme.spacingXs),
                child: Icon(
                  Icons.check_circle,
                  color: color,
                  size: 18,
                ),
              ),
          ],
        ),
      ),
    );
  }
  
  IconData _getSkillIcon(String skill) {
    switch (skill) {
      case 'mason':
        return Icons.foundation;
      case 'electrician':
        return Icons.electrical_services;
      case 'plumber':
        return Icons.plumbing;
      case 'carpenter':
        return Icons.carpenter;
      case 'painter':
        return Icons.format_paint;
      case 'cleaner':
        return Icons.cleaning_services;
      case 'driver':
        return Icons.drive_eta;
      case 'helper':
        return Icons.support;
      case 'cook':
        return Icons.restaurant;
      case 'gardener':
        return Icons.yard;
      case 'security':
        return Icons.security;
      case 'tailor':
        return Icons.checkroom;
      case 'mechanic':
        return Icons.build;
      case 'welder':
        return Icons.hardware;
      default:
        return Icons.work;
    }
  }
  
  Widget _buildBottomButtons(AppLocalizations? l10n, ThemeData theme) {
    final canProceed = _currentStep == OnboardingStep.roleSelection
        ? _selectedRole != null
        : _selectedSkills.isNotEmpty;
    
    return Container(
      padding: const EdgeInsets.all(AppTheme.spacingMd),
      decoration: BoxDecoration(
        color: theme.scaffoldBackgroundColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            if (_currentStep == OnboardingStep.skillSelection)
              Expanded(
                child: OutlinedButton(
                  onPressed: _onBackPressed,
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(0, AppTheme.buttonHeight),
                    side: BorderSide(color: theme.colorScheme.primary),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                    ),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.arrow_back, size: 20),
                      const SizedBox(width: AppTheme.spacingSm),
                      Text(
                        l10n?.back ?? 'Back',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            if (_currentStep == OnboardingStep.skillSelection)
              const SizedBox(width: AppTheme.spacingMd),
            Expanded(
              child: FilledButton(
                onPressed: canProceed ? _onNextPressed : null,
                style: FilledButton.styleFrom(
                  minimumSize: const Size(0, AppTheme.buttonHeight),
                  backgroundColor: theme.colorScheme.primary,
                  disabledBackgroundColor: theme.colorScheme.primary.withOpacity(0.3),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      _currentStep == OnboardingStep.skillSelection || _selectedRole == 'employer'
                          ? (l10n?.getStarted ?? 'Get Started')
                          : (l10n?.next ?? 'Next'),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: AppTheme.spacingSm),
                    const Icon(Icons.arrow_forward, size: 20, color: Colors.white),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
