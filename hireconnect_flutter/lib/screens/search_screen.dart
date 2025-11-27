import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/app_theme.dart';
import '../l10n/app_localizations.dart';
import '../providers/locale_provider.dart';
import '../widgets/job_card.dart';
import '../widgets/voice_search_button.dart';
import '../models/job.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'job_details_screen.dart';
import 'login_screen.dart';
import 'home_screen.dart';
import 'nearby_screen.dart';
import 'messages_screen.dart';
import 'profile_screen.dart';

class SearchScreen extends StatefulWidget {
  final String? initialQuery;
  final String? initialWorkType;
  
  const SearchScreen({
    super.key,
    this.initialQuery,
    this.initialWorkType,
  });

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final int _selectedIndex = 1;
  List<Job> _allJobs = [];
  List<Job> _filteredJobs = [];
  bool _isLoading = true;
  
  final TextEditingController _searchController = TextEditingController();
  
  String _selectedWorkType = 'all';
  String _selectedWageRange = 'any';
  String _sortBy = 'recent';
  
  @override
  void initState() {
    super.initState();
    if (widget.initialQuery != null) {
      _searchController.text = widget.initialQuery!;
    }
    if (widget.initialWorkType != null) {
      _selectedWorkType = widget.initialWorkType!;
    }
    _loadJobs();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadJobs() async {
    setState(() => _isLoading = true);
    try {
      final jobs = await ApiService.getJobs();
      if (mounted) {
        setState(() {
          _allJobs = jobs;
          _isLoading = false;
        });
        _applyFilters();
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _applyFilters() {
    List<Job> result = List.from(_allJobs);
    
    // Text search
    final query = _searchController.text.toLowerCase().trim();
    if (query.isNotEmpty) {
      result = result.where((job) {
        return job.title.toLowerCase().contains(query) ||
               job.location.toLowerCase().contains(query) ||
               job.workType.toLowerCase().contains(query) ||
               (job.skills?.any((s) => s.toLowerCase().contains(query)) ?? false);
      }).toList();
    }
    
    // Work type filter
    if (_selectedWorkType != 'all') {
      result = result.where((job) => 
        job.workType.toLowerCase() == _selectedWorkType.toLowerCase()
      ).toList();
    }
    
    // Wage range filter
    switch (_selectedWageRange) {
      case '300':
        result = result.where((job) => job.wage >= 300).toList();
        break;
      case '500':
        result = result.where((job) => job.wage >= 500).toList();
        break;
      case '700':
        result = result.where((job) => job.wage >= 700).toList();
        break;
      case '1000':
        result = result.where((job) => job.wage >= 1000).toList();
        break;
    }
    
    // Sort
    switch (_sortBy) {
      case 'wage_high':
        result.sort((a, b) => b.wage.compareTo(a.wage));
        break;
      case 'wage_low':
        result.sort((a, b) => a.wage.compareTo(b.wage));
        break;
      default: // recent
        result.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    }
    
    setState(() {
      _filteredJobs = result;
    });
  }

  void _onVoiceSearchResult(String text) {
    if (text.isNotEmpty) {
      _searchController.text = text;
      _applyFilters();
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
        return;
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

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final localeProvider = Provider.of<LocaleProvider>(context);
    final isHindi = localeProvider.locale.languageCode == 'hi';
    
    return Scaffold(
      appBar: AppBar(
        title: Text(isHindi ? 'नौकरी खोजें' : 'Search Jobs'),
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(AppTheme.spacingMd),
            child: Row(
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
                                _applyFilters();
                              },
                            )
                          : null,
                    ),
                    onChanged: (_) => _applyFilters(),
                    textInputAction: TextInputAction.search,
                    onSubmitted: (_) => _applyFilters(),
                  ),
                ),
                const SizedBox(width: AppTheme.spacingSm),
                VoiceSearchButton(
                  onResult: _onVoiceSearchResult,
                  locale: isHindi ? 'hi_IN' : 'en_IN',
                ),
              ],
            ),
          ),
          
          // Filters
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingMd),
            child: Row(
              children: [
                _FilterChip(
                  label: isHindi ? 'काम का प्रकार' : 'Work Type',
                  value: _selectedWorkType == 'all' 
                      ? (isHindi ? 'सभी' : 'All')
                      : _getWorkTypeLabel(_selectedWorkType, isHindi),
                  onTap: () => _showWorkTypeFilter(context, isHindi),
                ),
                const SizedBox(width: AppTheme.spacingSm),
                _FilterChip(
                  label: isHindi ? 'वेतन' : 'Wage',
                  value: _getWageRangeLabel(_selectedWageRange, isHindi),
                  onTap: () => _showWageFilter(context, isHindi),
                ),
                const SizedBox(width: AppTheme.spacingSm),
                _FilterChip(
                  label: isHindi ? 'क्रम' : 'Sort',
                  value: _getSortLabel(_sortBy, isHindi),
                  onTap: () => _showSortOptions(context, isHindi),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: AppTheme.spacingMd),
          
          // Results count
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingMd),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  isHindi 
                      ? '${_filteredJobs.length} नौकरियां मिलीं' 
                      : '${_filteredJobs.length} jobs found',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurfaceVariant,
                  ),
                ),
                if (_selectedWorkType != 'all' || 
                    _selectedWageRange != 'any' ||
                    _searchController.text.isNotEmpty)
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _searchController.clear();
                        _selectedWorkType = 'all';
                        _selectedWageRange = 'any';
                        _sortBy = 'recent';
                      });
                      _applyFilters();
                    },
                    child: Text(isHindi ? 'सभी हटाएं' : 'Clear All'),
                  ),
              ],
            ),
          ),
          
          // Results
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _filteredJobs.isEmpty
                    ? _buildEmptyState(theme, isHindi)
                    : ListView.separated(
                        padding: const EdgeInsets.all(AppTheme.spacingMd),
                        itemCount: _filteredJobs.length,
                        separatorBuilder: (_, __) => const SizedBox(height: AppTheme.spacingMd),
                        itemBuilder: (context, index) {
                          final job = _filteredJobs[index];
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
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
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
      ),
    );
  }

  Widget _buildEmptyState(ThemeData theme, bool isHindi) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingXl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off_rounded,
              size: 64,
              color: theme.colorScheme.onSurfaceVariant,
            ),
            const SizedBox(height: AppTheme.spacingMd),
            Text(
              isHindi ? 'कोई नौकरी नहीं मिली' : 'No jobs found',
              style: theme.textTheme.titleLarge?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: AppTheme.spacingSm),
            Text(
              isHindi 
                  ? 'कोई और खोज आज़माएं या फ़िल्टर बदलें' 
                  : 'Try a different search or change filters',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  void _showWorkTypeFilter(BuildContext context, bool isHindi) {
    final workTypes = [
      {'key': 'all', 'en': 'All', 'hi': 'सभी'},
      {'key': 'mason', 'en': 'Mason', 'hi': 'राजमिस्त्री'},
      {'key': 'electrician', 'en': 'Electrician', 'hi': 'इलेक्ट्रीशियन'},
      {'key': 'plumber', 'en': 'Plumber', 'hi': 'प्लंबर'},
      {'key': 'carpenter', 'en': 'Carpenter', 'hi': 'बढ़ई'},
      {'key': 'painter', 'en': 'Painter', 'hi': 'पेंटर'},
      {'key': 'cleaner', 'en': 'Cleaner', 'hi': 'सफाईकर्मी'},
      {'key': 'driver', 'en': 'Driver', 'hi': 'ड्राइवर'},
      {'key': 'helper', 'en': 'Helper', 'hi': 'हेल्पर'},
      {'key': 'cook', 'en': 'Cook', 'hi': 'रसोइया'},
    ];
    
    showModalBottomSheet(
      context: context,
      builder: (context) => _FilterBottomSheet(
        title: isHindi ? 'काम का प्रकार' : 'Work Type',
        options: workTypes,
        selectedValue: _selectedWorkType,
        isHindi: isHindi,
        onSelected: (value) {
          setState(() => _selectedWorkType = value);
          _applyFilters();
          Navigator.pop(context);
        },
      ),
    );
  }

  void _showWageFilter(BuildContext context, bool isHindi) {
    final wageRanges = [
      {'key': 'any', 'en': 'Any', 'hi': 'कोई भी'},
      {'key': '300', 'en': '\u20B9300+ per day', 'hi': '\u20B9300+ प्रति दिन'},
      {'key': '500', 'en': '\u20B9500+ per day', 'hi': '\u20B9500+ प्रति दिन'},
      {'key': '700', 'en': '\u20B9700+ per day', 'hi': '\u20B9700+ प्रति दिन'},
      {'key': '1000', 'en': '\u20B91000+ per day', 'hi': '\u20B91000+ प्रति दिन'},
    ];
    
    showModalBottomSheet(
      context: context,
      builder: (context) => _FilterBottomSheet(
        title: isHindi ? 'वेतन' : 'Wage Range',
        options: wageRanges,
        selectedValue: _selectedWageRange,
        isHindi: isHindi,
        onSelected: (value) {
          setState(() => _selectedWageRange = value);
          _applyFilters();
          Navigator.pop(context);
        },
      ),
    );
  }

  void _showSortOptions(BuildContext context, bool isHindi) {
    final sortOptions = [
      {'key': 'recent', 'en': 'Most Recent', 'hi': 'सबसे नया'},
      {'key': 'wage_high', 'en': 'Highest Pay', 'hi': 'सबसे ज़्यादा वेतन'},
      {'key': 'wage_low', 'en': 'Lowest Pay', 'hi': 'सबसे कम वेतन'},
    ];
    
    showModalBottomSheet(
      context: context,
      builder: (context) => _FilterBottomSheet(
        title: isHindi ? 'क्रम' : 'Sort By',
        options: sortOptions,
        selectedValue: _sortBy,
        isHindi: isHindi,
        onSelected: (value) {
          setState(() => _sortBy = value);
          _applyFilters();
          Navigator.pop(context);
        },
      ),
    );
  }

  String _getWorkTypeLabel(String workType, bool isHindi) {
    final labels = {
      'all': isHindi ? 'सभी' : 'All',
      'mason': isHindi ? 'राजमिस्त्री' : 'Mason',
      'electrician': isHindi ? 'इलेक्ट्रीशियन' : 'Electrician',
      'plumber': isHindi ? 'प्लंबर' : 'Plumber',
      'carpenter': isHindi ? 'बढ़ई' : 'Carpenter',
      'painter': isHindi ? 'पेंटर' : 'Painter',
      'cleaner': isHindi ? 'सफाईकर्मी' : 'Cleaner',
      'driver': isHindi ? 'ड्राइवर' : 'Driver',
      'helper': isHindi ? 'हेल्पर' : 'Helper',
      'cook': isHindi ? 'रसोइया' : 'Cook',
    };
    return labels[workType.toLowerCase()] ?? workType;
  }

  String _getWageRangeLabel(String range, bool isHindi) {
    final labels = {
      'any': isHindi ? 'कोई भी' : 'Any',
      '300': '\u20B9300+',
      '500': '\u20B9500+',
      '700': '\u20B9700+',
      '1000': '\u20B91000+',
    };
    return labels[range] ?? range;
  }

  String _getSortLabel(String sort, bool isHindi) {
    final labels = {
      'recent': isHindi ? 'सबसे नया' : 'Recent',
      'wage_high': isHindi ? 'ज़्यादा वेतन' : 'High Pay',
      'wage_low': isHindi ? 'कम वेतन' : 'Low Pay',
    };
    return labels[sort] ?? sort;
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final String value;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.value,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppTheme.radiusFull),
        child: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: AppTheme.spacingMd,
            vertical: AppTheme.spacingSm,
          ),
          decoration: BoxDecoration(
            color: theme.colorScheme.surfaceVariant,
            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
            border: Border.all(color: theme.colorScheme.outline),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '$label: $value',
                style: theme.textTheme.labelLarge,
              ),
              const SizedBox(width: 4),
              const Icon(Icons.arrow_drop_down_rounded, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}

class _FilterBottomSheet extends StatelessWidget {
  final String title;
  final List<Map<String, String>> options;
  final String selectedValue;
  final bool isHindi;
  final Function(String) onSelected;

  const _FilterBottomSheet({
    required this.title,
    required this.options,
    required this.selectedValue,
    required this.isHindi,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Container(
      padding: const EdgeInsets.all(AppTheme.spacingMd),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: theme.colorScheme.onSurfaceVariant.withOpacity(0.4),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: AppTheme.spacingMd),
          
          // Title
          Text(
            title,
            style: theme.textTheme.titleLarge,
          ),
          const SizedBox(height: AppTheme.spacingMd),
          
          // Options
          ...options.map((option) {
            final key = option['key']!;
            final label = isHindi ? option['hi']! : option['en']!;
            final isSelected = key == selectedValue;
            
            return ListTile(
              onTap: () => onSelected(key),
              leading: Icon(
                isSelected 
                    ? Icons.radio_button_checked_rounded 
                    : Icons.radio_button_off_rounded,
                color: isSelected ? theme.colorScheme.primary : null,
              ),
              title: Text(
                label,
                style: TextStyle(
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                  color: isSelected ? theme.colorScheme.primary : null,
                ),
              ),
            );
          }),
          
          const SizedBox(height: AppTheme.spacingMd),
        ],
      ),
    );
  }
}
