import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/app_theme.dart';
import '../l10n/app_localizations.dart';
import '../providers/locale_provider.dart';
import '../providers/theme_provider.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';
import 'home_screen.dart';
import 'search_screen.dart';
import 'nearby_screen.dart';
import 'messages_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final int _selectedIndex = 4;
  User? _user;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    try {
      final fetchedUser = await ApiService.getCurrentUser();
      if (mounted) {
        setState(() {
          _user = fetchedUser;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _onItemTapped(int index) {
    if (index == _selectedIndex) return;
    
    Widget screen;
    switch (index) {
      case 0:
        screen = const HomeScreen();
        break;
      case 1:
        screen = const SearchScreen();
        break;
      case 2:
        screen = const NearbyScreen();
        break;
      case 3:
        screen = const MessagesScreen();
        break;
      case 4:
        return;
      default:
        return;
    }
    
    Navigator.pushReplacement(
      context,
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) => screen,
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 200),
      ),
    );
  }

  Future<void> _logout() async {
    await AuthService.logoutUser();
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final localeProvider = Provider.of<LocaleProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    final isHindi = localeProvider.locale.languageCode == 'hi';
    
    return Scaffold(
      appBar: AppBar(
        title: Text(isHindi ? 'प्रोफ़ाइल' : 'Profile'),
        actions: [
          IconButton(
            icon: Icon(
              themeProvider.isDarkMode 
                  ? Icons.light_mode_rounded 
                  : Icons.dark_mode_rounded,
            ),
            onPressed: () => themeProvider.toggleTheme(),
            tooltip: isHindi ? 'थीम बदलें' : 'Toggle theme',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _user == null
              ? _buildErrorState(theme, isHindi)
              : RefreshIndicator(
                  onRefresh: _loadUserProfile,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.all(AppTheme.spacingMd),
                    child: Column(
                      children: [
                        // Profile header
                        _buildProfileHeader(theme, isHindi),
                        
                        const SizedBox(height: AppTheme.spacingLg),
                        
                        // Stats
                        _buildStats(theme, isHindi),
                        
                        const SizedBox(height: AppTheme.spacingLg),
                        
                        // Skills
                        if (_user!.role == 'worker') ...[
                          _buildSkillsSection(theme, isHindi),
                          const SizedBox(height: AppTheme.spacingLg),
                        ],
                        
                        // Settings
                        _buildSettingsSection(theme, isHindi),
                        
                        const SizedBox(height: AppTheme.spacingLg),
                        
                        // Logout
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: _logout,
                            icon: Icon(
                              Icons.logout_rounded,
                              color: theme.colorScheme.error,
                            ),
                            label: Text(
                              isHindi ? 'लॉगआउट' : 'Logout',
                              style: TextStyle(color: theme.colorScheme.error),
                            ),
                            style: OutlinedButton.styleFrom(
                              side: BorderSide(color: theme.colorScheme.error),
                            ),
                          ),
                        ),
                        
                        const SizedBox(height: AppTheme.spacingXl),
                      ],
                    ),
                  ),
                ),
      bottomNavigationBar: _buildBottomNav(theme, isHindi),
    );
  }

  Widget _buildErrorState(ThemeData theme, bool isHindi) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline_rounded,
            size: 64,
            color: theme.colorScheme.onSurfaceVariant,
          ),
          const SizedBox(height: AppTheme.spacingMd),
          Text(
            isHindi ? 'प्रोफ़ाइल लोड नहीं हो सकी' : 'Could not load profile',
            style: theme.textTheme.titleMedium,
          ),
          const SizedBox(height: AppTheme.spacingMd),
          ElevatedButton(
            onPressed: _loadUserProfile,
            child: Text(isHindi ? 'पुनः प्रयास करें' : 'Retry'),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileHeader(ThemeData theme, bool isHindi) {
    return Column(
      children: [
        // Avatar
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            color: theme.colorScheme.primary.withOpacity(0.1),
            shape: BoxShape.circle,
            border: Border.all(
              color: theme.colorScheme.primary,
              width: 3,
            ),
          ),
          child: Center(
            child: Text(
              _user!.fullName.isNotEmpty 
                  ? _user!.fullName[0].toUpperCase() 
                  : '?',
              style: theme.textTheme.headlineLarge?.copyWith(
                color: theme.colorScheme.primary,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
        
        const SizedBox(height: AppTheme.spacingMd),
        
        // Name
        Text(
          _user!.fullName,
          style: theme.textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        
        const SizedBox(height: AppTheme.spacingXs),
        
        // Role badge
        Container(
          padding: const EdgeInsets.symmetric(
            horizontal: AppTheme.spacingMd,
            vertical: AppTheme.spacingXs,
          ),
          decoration: BoxDecoration(
            color: theme.colorScheme.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
          ),
          child: Text(
            _user!.role == 'worker' 
                ? (isHindi ? 'कामगार' : 'Worker')
                : (isHindi ? 'नियोक्ता' : 'Employer'),
            style: theme.textTheme.labelMedium?.copyWith(
              color: theme.colorScheme.primary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
        
        const SizedBox(height: AppTheme.spacingMd),
        
        // Contact info
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.phone_outlined,
              size: 16,
              color: theme.colorScheme.onSurfaceVariant,
            ),
            const SizedBox(width: 4),
            Text(
              _user!.phone,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
        
        if (_user!.location != null) ...[
          const SizedBox(height: AppTheme.spacingXs),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.location_on_outlined,
                size: 16,
                color: theme.colorScheme.onSurfaceVariant,
              ),
              const SizedBox(width: 4),
              Text(
                _user!.location!,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }

  Widget _buildStats(ThemeData theme, bool isHindi) {
    return Row(
      children: [
        Expanded(
          child: _StatCard(
            icon: Icons.work_rounded,
            value: '12',
            label: isHindi ? 'पूर्ण नौकरियां' : 'Jobs Done',
            color: AppTheme.primaryColor,
          ),
        ),
        const SizedBox(width: AppTheme.spacingMd),
        Expanded(
          child: _StatCard(
            icon: Icons.account_balance_wallet_rounded,
            value: '\u20B97,200',
            label: isHindi ? 'कुल कमाई' : 'Total Earned',
            color: AppTheme.successColor,
          ),
        ),
        const SizedBox(width: AppTheme.spacingMd),
        Expanded(
          child: _StatCard(
            icon: Icons.star_rounded,
            value: '4.5',
            label: isHindi ? 'रेटिंग' : 'Rating',
            color: AppTheme.accentColor,
          ),
        ),
      ],
    );
  }

  Widget _buildSkillsSection(ThemeData theme, bool isHindi) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingMd),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.handyman_rounded,
                      color: theme.colorScheme.primary,
                    ),
                    const SizedBox(width: AppTheme.spacingSm),
                    Text(
                      isHindi ? 'कौशल' : 'Skills',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: () {
                    // Edit skills
                  },
                  child: Text(isHindi ? 'संपादित करें' : 'Edit'),
                ),
              ],
            ),
            const SizedBox(height: AppTheme.spacingSm),
            if (_user!.skills != null && _user!.skills!.isNotEmpty)
              Wrap(
                spacing: AppTheme.spacingSm,
                runSpacing: AppTheme.spacingSm,
                children: _user!.skills!.map((skill) {
                  final color = AppTheme.getCategoryColor(skill);
                  return Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppTheme.spacingMd,
                      vertical: AppTheme.spacingSm,
                    ),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                      border: Border.all(color: color.withOpacity(0.3)),
                    ),
                    child: Text(
                      _getSkillLabel(skill, isHindi),
                      style: theme.textTheme.labelLarge?.copyWith(
                        color: color,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  );
                }).toList(),
              )
            else
              Text(
                isHindi ? 'कोई कौशल नहीं जोड़ा गया' : 'No skills added',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsSection(ThemeData theme, bool isHindi) {
    final localeProvider = Provider.of<LocaleProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);
    
    return Card(
      child: Column(
        children: [
          _SettingsTile(
            icon: Icons.language_rounded,
            title: isHindi ? 'भाषा' : 'Language',
            subtitle: isHindi ? 'हिंदी' : 'English',
            onTap: () {
              final newLocale = isHindi 
                  ? const Locale('en') 
                  : const Locale('hi');
              localeProvider.setLocale(newLocale);
            },
          ),
          const Divider(height: 1),
          _SettingsTile(
            icon: themeProvider.isDarkMode 
                ? Icons.dark_mode_rounded 
                : Icons.light_mode_rounded,
            title: isHindi ? 'थीम' : 'Theme',
            subtitle: themeProvider.isDarkMode 
                ? (isHindi ? 'डार्क मोड' : 'Dark Mode')
                : (isHindi ? 'लाइट मोड' : 'Light Mode'),
            onTap: () => themeProvider.toggleTheme(),
          ),
          const Divider(height: 1),
          _SettingsTile(
            icon: Icons.notifications_outlined,
            title: isHindi ? 'नोटिफ़िकेशन' : 'Notifications',
            subtitle: isHindi ? 'सूचनाएं प्रबंधित करें' : 'Manage notifications',
            onTap: () {},
          ),
          const Divider(height: 1),
          _SettingsTile(
            icon: Icons.help_outline_rounded,
            title: isHindi ? 'मदद' : 'Help',
            subtitle: isHindi ? 'सहायता केंद्र' : 'Support center',
            onTap: () {},
          ),
          const Divider(height: 1),
          _SettingsTile(
            icon: Icons.info_outline_rounded,
            title: isHindi ? 'हमारे बारे में' : 'About',
            subtitle: 'HireConnect v1.0.0',
            onTap: () {},
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNav(ThemeData theme, bool isHindi) {
    return NavigationBar(
      selectedIndex: _selectedIndex,
      onDestinationSelected: _onItemTapped,
      destinations: [
        NavigationDestination(
          icon: const Icon(Icons.home_outlined),
          selectedIcon: const Icon(Icons.home_rounded),
          label: isHindi ? 'होम' : 'Home',
        ),
        NavigationDestination(
          icon: const Icon(Icons.search_outlined),
          selectedIcon: const Icon(Icons.search_rounded),
          label: isHindi ? 'खोजें' : 'Search',
        ),
        NavigationDestination(
          icon: const Icon(Icons.location_on_outlined),
          selectedIcon: const Icon(Icons.location_on_rounded),
          label: isHindi ? 'आस-पास' : 'Nearby',
        ),
        NavigationDestination(
          icon: const Icon(Icons.chat_bubble_outline_rounded),
          selectedIcon: const Icon(Icons.chat_bubble_rounded),
          label: isHindi ? 'संदेश' : 'Messages',
        ),
        NavigationDestination(
          icon: const Icon(Icons.person_outline_rounded),
          selectedIcon: const Icon(Icons.person_rounded),
          label: isHindi ? 'प्रोफ़ाइल' : 'Profile',
        ),
      ],
    );
  }

  String _getSkillLabel(String skill, bool isHindi) {
    final labels = {
      'mason': isHindi ? 'राजमिस्त्री' : 'Mason',
      'electrician': isHindi ? 'इलेक्ट्रीशियन' : 'Electrician',
      'plumber': isHindi ? 'प्लंबर' : 'Plumber',
      'carpenter': isHindi ? 'बढ़ई' : 'Carpenter',
      'painter': isHindi ? 'पेंटर' : 'Painter',
      'cleaner': isHindi ? 'सफाईकर्मी' : 'Cleaner',
      'driver': isHindi ? 'ड्राइवर' : 'Driver',
      'helper': isHindi ? 'हेल्पर' : 'Helper',
      'cook': isHindi ? 'रसोइया' : 'Cook',
      'welder': isHindi ? 'वेल्डर' : 'Welder',
    };
    return labels[skill.toLowerCase()] ?? skill;
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Container(
      padding: const EdgeInsets.all(AppTheme.spacingMd),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: AppTheme.iconSizeMd),
          const SizedBox(height: AppTheme.spacingSm),
          Text(
            value,
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: theme.textTheme.labelSmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _SettingsTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return ListTile(
      leading: Icon(icon, color: theme.colorScheme.onSurfaceVariant),
      title: Text(title),
      subtitle: Text(
        subtitle,
        style: theme.textTheme.bodySmall?.copyWith(
          color: theme.colorScheme.onSurfaceVariant,
        ),
      ),
      trailing: const Icon(Icons.chevron_right_rounded),
      onTap: onTap,
    );
  }
}
