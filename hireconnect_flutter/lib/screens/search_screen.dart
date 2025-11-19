import 'package:flutter/material.dart';
import '../widgets/job_card.dart';
import '../models/job.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'job_details_screen.dart';
import 'login_screen.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({Key? key}) : super(key: key);

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  int _selectedIndex = 1; // Index for search in bottom navigation
  List<Job> jobs = [];
  List<Job> filteredJobs = [];
  String currentLocation = 'Mumbai, India';
  String selectedSkill = 'All';
  String selectedWage = 'Any';
  String selectedTime = 'Any';
  String selectedDuration = 'Any';
  String sortBy = 'Most Recent';
  
  final TextEditingController _searchController = TextEditingController();

  final List<String> skills = ['All', 'Mason', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'Welder', 'Helper'];
  final List<String> wages = ['Any', '₹300+/day', '₹500+/day', '₹700+/day', '₹1000+/day'];
  final List<String> times = ['Any', 'Full-time', 'Part-time', 'Casual'];
  final List<String> durations = ['Any', '1 day+', '1 week+', '2 weeks+', '1 month+'];
  final List<String> sortOptions = ['Most Recent', 'Highest Pay', 'Closest'];

  @override
  void initState() {
    super.initState();
    _loadJobs();
  }

  Future<void> _loadJobs() async {
    final fetchedJobs = await ApiService.getJobs();
    setState(() {
      jobs = fetchedJobs;
      filteredJobs = List.from(jobs); // Initially show all jobs
    });
  }

  void _filterJobs() {
    List<Job> result = List.from(jobs);
    
    // Apply filters based on selections
    if (selectedSkill != 'All') {
      result = result.where((job) => 
        job.skills != null && job.skills!.contains(selectedSkill)
      ).toList();
    }
    
    if (selectedWage != 'Any') {
      int minWage = int.parse(selectedWage.replaceAll(RegExp(r'[^0-9]'), ''));
      result = result.where((job) => job.wage >= minWage).toList();
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'Highest Pay':
        result.sort((a, b) => b.wage.compareTo(a.wage));
        break;
      case 'Closest':
        // In a real app, this would sort by distance
        break;
      default: // Most Recent
        result.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
    }
    
    setState(() {
      filteredJobs = result;
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
      case 1: // Search (current)
        break; // Already on this screen
      case 2: // Nearby
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const NearbyScreen()),
        );
        break;
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
    return Scaffold(
      appBar: AppBar(
        title: const Text('Search Jobs'),
        actions: [
          PopupMenuButton<String>(
            onSelected: (String value) {
              if (value == 'logout') {
                _logout();
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'profile',
                child: Text('Profile'),
              ),
              const PopupMenuItem<String>(
                value: 'settings',
                child: Text('Settings'),
              ),
              const PopupMenuDivider(),
              const PopupMenuItem<String>(
                value: 'logout',
                child: Text('Logout'),
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
            // Location selector
            const Text(
              '📍 Location',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.location_on, color: Colors.blue),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      currentLocation,
                      style: const TextStyle(fontSize: 16),
                    ),
                  ),
                  const Icon(Icons.arrow_drop_down),
                ],
              ),
            ),
            const SizedBox(height: 16),
            
            // Filters section
            const Text(
              '⚙️ Filters',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            
            // Filter row 1: Skills and Wage
            Row(
              children: [
                Expanded(
                  child: _buildFilterChip(
                    label: '🧰 Skills',
                    value: selectedSkill,
                    options: skills,
                    onChanged: (value) {
                      setState(() {
                        selectedSkill = value!;
                      });
                      _filterJobs();
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildFilterChip(
                    label: '💰 Wage',
                    value: selectedWage,
                    options: wages,
                    onChanged: (value) {
                      setState(() {
                        selectedWage = value!;
                      });
                      _filterJobs();
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            
            // Filter row 2: Time and Duration
            Row(
              children: [
                Expanded(
                  child: _buildFilterChip(
                    label: '🕐 Time',
                    value: selectedTime,
                    options: times,
                    onChanged: (value) {
                      setState(() {
                        selectedTime = value!;
                      });
                      _filterJobs();
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildFilterChip(
                    label: '🕐 Duration',
                    value: selectedDuration,
                    options: durations,
                    onChanged: (value) {
                      setState(() {
                        selectedDuration = value!;
                      });
                      _filterJobs();
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            
            // Sort by section
            const Text(
              '📋 Sort By:',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(Icons.sort, color: Colors.grey),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      sortBy,
                      style: const TextStyle(fontSize: 16),
                    ),
                  ),
                  const Icon(Icons.arrow_drop_down),
                ],
              ),
            ),
            const SizedBox(height: 20),
            
            // Search results title
            const Text(
              '💼 Search Results',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            
            // Results list
            Expanded(
              child: filteredJobs.isEmpty
                  ? const Center(child: Text('No jobs match your filters'))
                  : ListView.builder(
                      itemCount: filteredJobs.length,
                      itemBuilder: (context, index) {
                        final job = filteredJobs[index];
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
                              const SnackBar(
                                content: Text('Applied to job successfully!'),
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

  Widget _buildFilterChip({
    required String label,
    required String value,
    required List<String> options,
    required Function(String?) onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
      ),
      child: DropdownButtonHideUnderline(
        child: ButtonTheme(
          alignedDropdown: true,
          child: DropdownButton<String>(
            value: value,
            isExpanded: true,
            icon: const Icon(Icons.arrow_drop_down),
            iconSize: 24,
            elevation: 16,
            style: const TextStyle(
              color: Colors.black,
              fontSize: 14,
            ),
            onChanged: onChanged,
            items: options.map<DropdownMenuItem<String>>((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8.0),
                  child: Row(
                    children: [
                      Text(value),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }
}

// Import needed for the SearchScreen to navigate to other screens
import 'home_screen.dart';
import 'nearby_screen.dart';
import 'messages_screen.dart';
import 'profile_screen.dart';