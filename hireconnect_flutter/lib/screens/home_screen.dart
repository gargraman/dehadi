import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
import '../config/app_theme.dart';
import '../l10n/app_localizations.dart';
import '../providers/locale_provider.dart';
import '../providers/theme_provider.dart';
import '../widgets/job_card.dart';
import '../widgets/voice_search_button.dart';
import '../models/job.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'job_details_screen.dart';
import 'search_screen.dart';
import 'nearby_screen.dart';
import 'messages_screen.dart';
import 'profile_screen.dart';
import 'login_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;
  List<Job> _jobs = [];
  User? _currentUser;
  String? _currentLocation;
  bool _isLoadingJobs = true;
  final _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    await Future.wait([
      _loadUser(),
      _loadJobs(),
      _getCurrentLocation(),
    ]);
  }

  Future<void> _loadUser() async {
    final user = await AuthService.getCurrentUser();
    if (mounted) {
      setState(() {
        _currentUser = user;
      });
    }
  }

  Future<void> _loadJobs() async {
    setState(() => _isLoadingJobs = true);
    try {
      final fetchedJobs = await ApiService.getJobs();
      if (mounted) {
        setState(() {
          _jobs = fetchedJobs.take(10).toList();
          _isLoadingJobs = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoadingJobs = false);
      }
    }
  }

  Future<void> _getCurrentLocation() async {
    try {
      final permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        await Geolocator.requestPermission();
      }
      
      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );
      
      if (mounted) {
        setState(() {
          _currentLocation = '${position.latitude.toStringAsFixed(4)}, ${position.longitude.toStringAsFixed(4)}';
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _currentLocation = null;
        });
      }
    }
  }

  void _onItemTapped(int index) {
    if (index == _selectedIndex) return;
    
    Widget screen;
    switch (index) {
      case 0:
        return; // Already on home
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
        screen = const ProfileScreen();
        break;
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

  void _onVoiceSearchResult(String text) {
    if (text.isNotEmpty) {
      _searchController.text = text;
      // Navigate to search with query
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => SearchScreen(initialQuery: text),
        ),
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
        title: Text(isHindi ? 'हायरकनेक्ट' : 'HireConnect'),
        actions: [
          // Theme toggle
          IconButton(
            icon: Icon(
              themeProvider.isDarkMode 
                  ? Icons.light_mode_rounded 
                  : Icons.dark_mode_rounded,
            ),
            onPressed: () => themeProvider.toggleTheme(),
            tooltip: isHindi ? 'थीम बदलें' : 'Toggle theme',
          ),
          // Notifications
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () {
              // Handle notifications
            },
            tooltip: isHindi ? 'सूचनाएं' : 'Notifications',
          ),
          // Menu
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert_rounded),
            onSelected: (String value) {
              switch (value) {
                case 'profile':
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const ProfileScreen()),
                  );
                  break;
                case 'language':
                  final newLocale = isHindi 
                      ? const Locale('en') 
                      : const Locale('hi');
                  localeProvider.setLocale(newLocale);
                  break;
                case 'logout':
                  _logout();
                  break;
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              PopupMenuItem<String>(
                value: 'profile',
                child: Row(
                  children: [
                    const Icon(Icons.person_outline_rounded),
                    const SizedBox(width: AppTheme.spacingSm),
                    Text(isHindi ? 'प्रोफ़ाइल' : 'Profile'),
                  ],
                ),
              ),
              PopupMenuItem<String>(
                value: 'language',
                child: Row(
                  children: [
                    const Icon(Icons.language_rounded),
                    const SizedBox(width: AppTheme.spacingSm),
                    Text(isHindi ? 'English' : 'हिंदी'),
                  ],
                ),
              ),
              const PopupMenuDivider(),
              PopupMenuItem<String>(
                value: 'logout',
                child: Row(
                  children: [
                    Icon(Icons.logout_rounded, color: theme.colorScheme.error),
                    const SizedBox(width: AppTheme.spacingSm),
                    Text(
                      isHindi ? 'लॉगआउट' : 'Logout',
                      style: TextStyle(color: theme.colorScheme.error),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(AppTheme.spacingMd),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Greeting
              _buildGreeting(theme, isHindi),
              
              const SizedBox(height: AppTheme.spacingMd),
              
              // Location
              _buildLocationCard(theme, isHindi),
              
              const SizedBox(height: AppTheme.spacingLg),
              
              // Stats
              _buildStats(theme, isHindi),
              
              const SizedBox(height: AppTheme.spacingLg),
              
              // Search bar
              _buildSearchBar(theme, isHindi),
              
              const SizedBox(height: AppTheme.spacingLg),
              
              // Job categories
              _buildCategories(theme, isHindi),
              
              const SizedBox(height: AppTheme.spacingLg),
              
              // Recommended jobs
              _buildJobsList(theme, isHindi),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNav(theme, isHindi),
    );
  }

  Widget _buildGreeting(ThemeData theme, bool isHindi) {
    final name = _currentUser?.fullName ?? (isHindi ? 'कामगार' : 'Worker');
    final firstName = name.split(' ').first;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '${isHindi ? 'नमस्ते' : 'Hi'}, $firstName',
          style: theme.textTheme.headlineSmall?.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: AppTheme.spacingXs),
        Text(
          isHindi ? 'आज के लिए काम खोजें' : 'Find work for today',
          style: theme.textTheme.bodyLarge?.copyWith(
            color: theme.colorScheme.onSurfaceVariant,
          ),
        ),
      ],
    );
  }

  Widget _buildLocationCard(ThemeData theme, bool isHindi) {
    return Container(
      padding: const EdgeInsets.all(AppTheme.spacingMd),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceVariant,
        borderRadius: BorderRadius.circular(AppTheme.radiusMd),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(AppTheme.spacingSm),
            decoration: BoxDecoration(
              color: theme.colorScheme.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(AppTheme.radiusSm),
            ),
            child: Icon(
              Icons.location_on_rounded,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(width: AppTheme.spacingMd),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isHindi ? 'आपका स्थान' : 'Your Location',
                  style: theme.textTheme.labelMedium?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  _currentLocation ?? (isHindi ? 'स्थान प्राप्त कर रहे हैं...' : 'Getting location...'),
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _getCurrentLocation,
            tooltip: isHindi ? 'स्थान रीफ्रेश करें' : 'Refresh location',
          ),
        ],
      ),
    );
  }

  Widget _buildStats(ThemeData theme, bool isHindi) {
    return Row(
      children: [
        Expanded(
          child: _StatCard(
            icon: Icons.assignment_turned_in_rounded,
            value: '2',
            label: isHindi ? 'सक्रिय आवेदन' : 'Active Apps',
            color: AppTheme.secondaryColor,
          ),
        ),
        const SizedBox(width: AppTheme.spacingMd),
        Expanded(
          child: _StatCard(
            icon: Icons.account_balance_wallet_rounded,
            value: '\u20B94,500',
            label: isHindi ? 'कुल कमाई' : 'Total Earned',
            color: AppTheme.accentColor,
          ),
        ),
      ],
    );
  }

  Widget _buildSearchBar(ThemeData theme, bool isHindi) {
    final localeCode = isHindi ? 'hi_IN' : 'en_IN';
    
    return Row(
      children: [
        Expanded(
          child: TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: isHindi 
                  ? 'नौकरी, कौशल या स्थान खोजें' 
                  : 'Search jobs, skills, location',
              prefixIcon: const Icon(Icons.search_rounded),
              suffixIcon: _searchController.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear_rounded),
                      onPressed: () {
                        _searchController.clear();
                        setState(() {});
                      },
                    )
                  : null,
            ),
            onChanged: (_) => setState(() {}),
            onSubmitted: (query) {
              if (query.isNotEmpty) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => SearchScreen(initialQuery: query),
                  ),
                );
              }
            },
          ),
        ),
        const SizedBox(width: AppTheme.spacingSm),
        VoiceSearchButton(
          onResult: _onVoiceSearchResult,
          locale: localeCode,
        ),
      ],
    );
  }

  Widget _buildCategories(ThemeData theme, bool isHindi) {
    final categories = [
      {'key': 'mason', 'en': 'Mason', 'hi': 'राजमिस्त्री', 'icon': Icons.construction_rounded},
      {'key': 'electrician', 'en': 'Electrician', 'hi': 'इलेक्ट्रीशियन', 'icon': Icons.electrical_services_rounded},
      {'key': 'plumber', 'en': 'Plumber', 'hi': 'प्लंबर', 'icon': Icons.plumbing_rounded},
      {'key': 'carpenter', 'en': 'Carpenter', 'hi': 'बढ़ई', 'icon': Icons.handyman_rounded},
      {'key': 'painter', 'en': 'Painter', 'hi': 'पेंटर', 'icon': Icons.format_paint_rounded},
      {'key': 'driver', 'en': 'Driver', 'hi': 'ड्राइवर', 'icon': Icons.directions_car_rounded},
    ];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              isHindi ? 'नौकरी श्रेणियां' : 'Job Categories',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            TextButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const SearchScreen()),
                );
              },
              child: Text(isHindi ? 'सभी देखें' : 'See All'),
            ),
          ],
        ),
        const SizedBox(height: AppTheme.spacingSm),
        SizedBox(
          height: 100,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: categories.length,
            separatorBuilder: (_, __) => const SizedBox(width: AppTheme.spacingSm),
            itemBuilder: (context, index) {
              final category = categories[index];
              return _CategoryCard(
                icon: category['icon'] as IconData,
                label: isHindi ? category['hi'] as String : category['en'] as String,
                color: AppTheme.getCategoryColor(category['key'] as String),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SearchScreen(
                        initialWorkType: category['key'] as String,
                      ),
                    ),
                  );
                },
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildJobsList(ThemeData theme, bool isHindi) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              isHindi ? 'सुझाई गई नौकरियां' : 'Recommended Jobs',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            TextButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const SearchScreen()),
                );
              },
              child: Text(isHindi ? 'सभी देखें' : 'See All'),
            ),
          ],
        ),
        const SizedBox(height: AppTheme.spacingSm),
        if (_isLoadingJobs)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(AppTheme.spacingXl),
              child: CircularProgressIndicator(),
            ),
          )
        else if (_jobs.isEmpty)
          Center(
            child: Padding(
              padding: const EdgeInsets.all(AppTheme.spacingXl),
              child: Column(
                children: [
                  Icon(
                    Icons.work_off_rounded,
                    size: 64,
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                  const SizedBox(height: AppTheme.spacingMd),
                  Text(
                    isHindi ? 'कोई नौकरी उपलब्ध नहीं' : 'No jobs available',
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                    ),
                  ),
                ],
              ),
            ),
          )
        else
          ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _jobs.length,
            separatorBuilder: (_, __) => const SizedBox(height: AppTheme.spacingMd),
            itemBuilder: (context, index) {
              final job = _jobs[index];
              return JobCard(
                job: job,
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => JobDetailsScreen(jobId: job.id),
                    ),
                  );
                },
                onApply: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        isHindi 
                            ? 'नौकरी के लिए आवेदन किया गया!' 
                            : 'Applied to job successfully!',
                      ),
                    ),
                  );
                },
              );
            },
          ),
      ],
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
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: AppTheme.iconSizeLg),
          const SizedBox(height: AppTheme.spacingSm),
          Text(
            value,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _CategoryCard({
    required this.icon,
    required this.label,
    required this.color,
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
        child: Container(
          width: 80,
          padding: const EdgeInsets.all(AppTheme.spacingSm),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(AppTheme.radiusMd),
            border: Border.all(color: color.withOpacity(0.3)),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(AppTheme.spacingSm),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: AppTheme.iconSizeMd),
              ),
              const SizedBox(height: AppTheme.spacingSm),
              Text(
                label,
                style: theme.textTheme.labelSmall?.copyWith(
                  color: theme.colorScheme.onSurface,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
