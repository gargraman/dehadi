import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/app_theme.dart';
import '../l10n/app_localizations.dart';
import '../providers/locale_provider.dart';
import '../services/auth_service.dart';
import 'home_screen.dart';
import 'employer_dashboard_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  final _fullNameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _locationController = TextEditingController();
  final _aadharController = TextEditingController();
  
  bool _isLoading = false;
  bool _obscurePassword = true;
  String _selectedRole = 'worker';
  String? _errorMessage;
  
  final Set<String> _selectedSkills = {};

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    _fullNameController.dispose();
    _phoneController.dispose();
    _locationController.dispose();
    _aadharController.dispose();
    super.dispose();
  }

  Future<void> _register() async {
    if (!_formKey.currentState!.validate()) return;
    
    final localeProvider = Provider.of<LocaleProvider>(context, listen: false);

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final user = await AuthService.register(
        username: _usernameController.text.trim(),
        password: _passwordController.text,
        role: _selectedRole,
        fullName: _fullNameController.text.trim(),
        phone: _phoneController.text.trim(),
        language: localeProvider.locale.languageCode,
        location: _locationController.text.trim(),
        skills: _selectedRole == 'worker' ? _selectedSkills.toList() : null,
        aadhar: _aadharController.text.trim().isNotEmpty 
            ? _aadharController.text.trim() 
            : null,
      );

      if (user != null && mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(
            builder: (context) => user.role == 'employer'
                ? const EmployerDashboardScreen()
                : const HomeScreen(),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString().replaceAll('Exception: ', '');
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final localeProvider = Provider.of<LocaleProvider>(context);
    final l10n = AppLocalizations.of(context)!;
    final isHindi = localeProvider.locale.languageCode == 'hi';
    
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.register),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppTheme.spacingLg),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Header
                Center(
                  child: Column(
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.person_add_rounded,
                          size: 40,
                          color: theme.colorScheme.primary,
                        ),
                      ),
                      const SizedBox(height: AppTheme.spacingMd),
                      Text(
                        l10n.createAccount,
                        style: theme.textTheme.headlineSmall?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: AppTheme.spacingSm),
                      Text(
                        l10n.joinMarketplace,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: AppTheme.spacingLg),
                
                // Error message
                if (_errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.all(AppTheme.spacingMd),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.error.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                      border: Border.all(
                        color: theme.colorScheme.error.withOpacity(0.5),
                      ),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.error_outline_rounded,
                          color: theme.colorScheme.error,
                        ),
                        const SizedBox(width: AppTheme.spacingSm),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: theme.colorScheme.error,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: AppTheme.spacingMd),
                ],
                
                // Role selection
                Text(
                  l10n.iAm,
                  style: theme.textTheme.titleSmall,
                ),
                const SizedBox(height: AppTheme.spacingSm),
                Row(
                  children: [
                    Expanded(
                      child: _RoleCard(
                        icon: Icons.construction_rounded,
                        label: l10n.worker,
                        subtitle: l10n.lookingForWork,
                        isSelected: _selectedRole == 'worker',
                        onTap: () => setState(() => _selectedRole = 'worker'),
                      ),
                    ),
                    const SizedBox(width: AppTheme.spacingMd),
                    Expanded(
                      child: _RoleCard(
                        icon: Icons.business_rounded,
                        label: l10n.employer,
                        subtitle: l10n.hiringWorkers,
                        isSelected: _selectedRole == 'employer',
                        onTap: () => setState(() => _selectedRole = 'employer'),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: AppTheme.spacingLg),
                
                // Full name
                TextFormField(
                  controller: _fullNameController,
                  textCapitalization: TextCapitalization.words,
                  decoration: InputDecoration(
                    labelText: l10n.fullName,
                    hintText: l10n.enterFullName,
                    prefixIcon: const Icon(Icons.person_outline_rounded),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return l10n.pleaseEnterName;
                    }
                    return null;
                  },
                ),
                
                const SizedBox(height: AppTheme.spacingMd),
                
                // Username
                TextFormField(
                  controller: _usernameController,
                  decoration: InputDecoration(
                    labelText: l10n.username,
                    hintText: l10n.chooseUsername,
                    prefixIcon: const Icon(Icons.alternate_email_rounded),
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return l10n.pleaseEnterUsername;
                    }
                    if (value.length < 3) {
                      return l10n.usernameMinChars;
                    }
                    return null;
                  },
                ),
                
                const SizedBox(height: AppTheme.spacingMd),
                
                // Password
                TextFormField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    labelText: l10n.password,
                    hintText: l10n.createPassword,
                    prefixIcon: const Icon(Icons.lock_outline_rounded),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword 
                            ? Icons.visibility_outlined 
                            : Icons.visibility_off_outlined,
                      ),
                      onPressed: () {
                        setState(() => _obscurePassword = !_obscurePassword);
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return l10n.pleaseEnterPassword;
                    }
                    if (value.length < 6) {
                      return l10n.passwordMinChars;
                    }
                    return null;
                  },
                ),
                
                const SizedBox(height: AppTheme.spacingMd),
                
                // Phone
                TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: InputDecoration(
                    labelText: l10n.phoneNumber,
                    hintText: l10n.enterPhoneNumber,
                    prefixIcon: const Icon(Icons.phone_outlined),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return l10n.pleaseEnterPhone;
                    }
                    if (value.length < 10) {
                      return l10n.enterValidPhone;
                    }
                    return null;
                  },
                ),
                
                const SizedBox(height: AppTheme.spacingMd),
                
                // Location
                TextFormField(
                  controller: _locationController,
                  decoration: InputDecoration(
                    labelText: l10n.location,
                    hintText: l10n.enterCityArea,
                    prefixIcon: const Icon(Icons.location_on_outlined),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return l10n.pleaseEnterLocation;
                    }
                    return null;
                  },
                ),
                
                // Skills (workers only)
                if (_selectedRole == 'worker') ...[
                  const SizedBox(height: AppTheme.spacingLg),
                  Text(
                    l10n.yourSkills,
                    style: theme.textTheme.titleSmall,
                  ),
                  const SizedBox(height: AppTheme.spacingSm),
                  _buildSkillsSelector(theme, l10n),
                ],
                
                const SizedBox(height: AppTheme.spacingMd),
                
                // Aadhar (optional)
                TextFormField(
                  controller: _aadharController,
                  keyboardType: TextInputType.number,
                  maxLength: 12,
                  decoration: InputDecoration(
                    labelText: l10n.aadharOptional,
                    hintText: l10n.enterAadhar,
                    prefixIcon: const Icon(Icons.badge_outlined),
                    counterText: '',
                  ),
                  validator: (value) {
                    if (value != null && value.isNotEmpty) {
                      if (value.length != 12) {
                        return l10n.aadhar12Digits;
                      }
                      if (!RegExp(r'^[0-9]+$').hasMatch(value)) {
                        return l10n.aadharDigitsOnly;
                      }
                    }
                    return null;
                  },
                ),
                
                const SizedBox(height: AppTheme.spacingXl),
                
                // Register button
                ElevatedButton(
                  onPressed: _isLoading ? null : _register,
                  child: _isLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : Text(l10n.register),
                ),
                
                const SizedBox(height: AppTheme.spacingMd),
                
                // Login link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '${l10n.alreadyHaveAccount} ',
                      style: theme.textTheme.bodyMedium,
                    ),
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: Text(l10n.login),
                    ),
                  ],
                ),
                
                // Language switcher
                Center(
                  child: TextButton.icon(
                    onPressed: () {
                      final newLocale = isHindi 
                          ? const Locale('en') 
                          : const Locale('hi');
                      localeProvider.setLocale(newLocale);
                    },
                    icon: const Icon(Icons.language_rounded, size: 20),
                    label: Text(
                      isHindi ? 'English' : 'हिंदी',
                      style: TextStyle(
                        fontFamily: isHindi ? 'Inter' : 'NotoSansDevanagari',
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSkillsSelector(ThemeData theme, AppLocalizations l10n) {
    final skills = [
      'mason',
      'electrician',
      'plumber',
      'carpenter',
      'painter',
      'cleaner',
      'driver',
      'helper',
      'cook',
      'welder',
    ];
    
    return Wrap(
      spacing: AppTheme.spacingSm,
      runSpacing: AppTheme.spacingSm,
      children: skills.map((skillKey) {
        final label = l10n.getWorkType(skillKey);
        final isSelected = _selectedSkills.contains(skillKey);
        final color = AppTheme.getCategoryColor(skillKey);
        
        return FilterChip(
          label: Text(label),
          selected: isSelected,
          selectedColor: color.withOpacity(0.2),
          checkmarkColor: color,
          labelStyle: TextStyle(
            color: isSelected ? color : theme.colorScheme.onSurface,
            fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
          ),
          onSelected: (selected) {
            setState(() {
              if (selected) {
                _selectedSkills.add(skillKey);
              } else {
                _selectedSkills.remove(skillKey);
              }
            });
          },
        );
      }).toList(),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String subtitle;
  final bool isSelected;
  final VoidCallback onTap;

  const _RoleCard({
    required this.icon,
    required this.label,
    required this.subtitle,
    required this.isSelected,
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
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(AppTheme.spacingSm),
                decoration: BoxDecoration(
                  color: isSelected 
                      ? theme.colorScheme.primary.withOpacity(0.2)
                      : theme.colorScheme.surfaceVariant,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  color: isSelected 
                      ? theme.colorScheme.primary
                      : theme.colorScheme.onSurfaceVariant,
                  size: AppTheme.iconSizeLg,
                ),
              ),
              const SizedBox(height: AppTheme.spacingSm),
              Text(
                label,
                style: theme.textTheme.titleSmall?.copyWith(
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                  color: isSelected 
                      ? theme.colorScheme.primary
                      : theme.colorScheme.onSurface,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                subtitle,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
