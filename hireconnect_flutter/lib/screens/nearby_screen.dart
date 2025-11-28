import 'package:flutter/material.dart';
import '../l10n/app_localizations.dart';
import '../widgets/job_card.dart';
import '../models/job.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'job_details_screen.dart';
import 'login_screen.dart';

class NearbyScreen extends StatefulWidget {
  const NearbyScreen({Key? key}) : super(key: key);

  @override
  State<NearbyScreen> createState() => _NearbyScreenState();
}

class _NearbyScreenState extends State<NearbyScreen> {
  int _selectedIndex = 2; // Index for nearby in bottom navigation
  List<Job> jobs = [];
  List<String> radiusOptions = ['2 km', '5 km', '10 km', '25 km'];
  String selectedRadius = '5 km';
  
  @override
  void initState() {
    super.initState();
    _loadNearbyJobs();
  }

  Future<void> _loadNearbyJobs() async {
    // In a real app, this would use actual location to find nearby jobs
    final fetchedJobs = await ApiService.getJobs();
    setState(() {
      jobs = fetchedJobs.take(5).toList(); // Show only first 5 jobs
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });

    // Navigate to different screens based on index
    switch (index) {
      case 0: // Home
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const HomeScreen()),
        );
        break;
      case 1: // Search
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const SearchScreen()),
        );
        break;
      case 2: // Nearby (current)
        break; // Already on this screen
      case 3: // Messages
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MessagesScreen()),
        );
        break;
      case 4: // Profile
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const ProfileScreen()),
        );
        break;
    }
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
    final l10n = AppLocalizations.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n?.nearbyJobs ?? 'Nearby Jobs'),
        actions: [
          IconButton(
            icon: const Icon(Icons.location_on),
            onPressed: () {
              // Handle location refresh
            },
            tooltip: l10n?.refreshLocation ?? 'Refresh Location',
          ),
          PopupMenuButton<String>(
            onSelected: (String value) {
              if (value == 'logout') {
                _logout();
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              PopupMenuItem<String>(
                value: 'profile',
                child: Text(l10n?.profile ?? 'Profile'),
              ),
              PopupMenuItem<String>(
                value: 'settings',
                child: Text(l10n?.settings ?? 'Settings'),
              ),
              const PopupMenuDivider(),
              PopupMenuItem<String>(
                value: 'logout',
                child: Text(l10n?.logout ?? 'Logout'),
              ),
            ],
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Current location display
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.blue[50],
                border: Border.all(color: Colors.blue[200]!),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.location_on, color: Colors.blue),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'Current Location: Mumbai, India',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.refresh, color: Colors.blue),
                    onPressed: _loadNearbyJobs,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            
            // Radius selection
            Text(
              l10n?.searchRadius ?? 'Select Search Radius',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 8.0,
              runSpacing: 8.0,
              children: radiusOptions.map((radius) {
                return ChoiceChip(
                  label: Text(radius),
                  selected: selectedRadius == radius,
                  selectedColor: Colors.blue,
                  onSelected: (selected) {
                    setState(() {
                      selectedRadius = selected ? radius : selectedRadius;
                    });
                    // In a real app, we would filter jobs based on the selected radius
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 24),
            
            Row(
              children: [
                Icon(Icons.work, size: 22, color: Theme.of(context).colorScheme.primary),
                const SizedBox(width: 8),
                Text(
                  l10n?.nearbyJobs ?? 'Nearby Jobs',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            
            // Jobs list
            Expanded(
              child: jobs.isEmpty
                  ? Center(child: Text(l10n?.noJobsFound ?? 'No nearby jobs found'))
                  : ListView.builder(
                      itemCount: jobs.length,
                      itemBuilder: (context, index) {
                        final job = jobs[index];
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
                            // Handle job application
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(l10n?.appliedSuccessfully ?? 'Applied to job successfully!'),
                              ),
                            );
                          },
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'Search',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.location_on),
            label: 'Nearby',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat),
            label: 'Messages',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue,
        onTap: _onItemTapped,
      ),
    );
  }
}

// Import needed for the NearbyScreen to navigate to other screens
import 'home_screen.dart';
import 'search_screen.dart';
import 'messages_screen.dart';
import 'profile_screen.dart';