import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  int _selectedIndex = 4; // Index for profile in bottom navigation
  User? user;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    final fetchedUser = await ApiService.getCurrentUser();
    if (mounted) {
      setState(() {
        user = fetchedUser;
        _isLoading = false;
      });
    }
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
      case 4: // Profile (current)
        break; // Already on this screen
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
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // Handle notifications
            },
          ),
          PopupMenuButton<String>(
            onSelected: (String value) {
              if (value == 'logout') {
                _logout();
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
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
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : user == null
              ? const Center(child: Text('User not found'))
              : Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      // Profile picture
                      CircleAvatar(
                        radius: 50,
                        backgroundColor: Colors.grey[300],
                        child: Icon(
                          Icons.person,
                          size: 50,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // User name
                      Text(
                        user!.fullName,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      
                      // Phone number
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.phone, size: 16, color: Colors.grey),
                          const SizedBox(width: 4),
                          Text(
                            user!.phone,
                            style: const TextStyle(
                              fontSize: 16,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      
                      // Location
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.location_on, size: 16, color: Colors.grey),
                          const SizedBox(width: 4),
                          Text(
                            user!.location ?? 'Location not set',
                            style: const TextStyle(
                              fontSize: 16,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 30),
                      
                      // Earnings summary
                      const Text(
                        '💰 Earnings Summary',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildStatCard('12', 'Jobs Completed', Icons.work),
                          _buildStatCard('₹7,200', 'Total Earned', Icons.money),
                        ],
                      ),
                      const SizedBox(height: 30),
                      
                      // Skills section
                      const Text(
                        '🧰 Skills & Experience',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (user!.skills != null && user!.skills!.isNotEmpty)
                        Wrap(
                          spacing: 8.0,
                          runSpacing: 8.0,
                          children: user!.skills!.map((skill) {
                            return Chip(
                              label: Text(skill),
                              backgroundColor: Colors.blue[100],
                            );
                          }).toList(),
                        )
                      else
                        const Text(
                          'No skills added',
                          style: TextStyle(color: Colors.grey),
                        ),
                      const SizedBox(height: 8),
                      ElevatedButton(
                        onPressed: () {
                          // Handle edit skills
                        },
                        child: const Text('Edit Skills'),
                      ),
                      const SizedBox(height: 30),
                      
                      // Recent activity
                      const Text(
                        '📋 Recent Activity',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Expanded(
                        child: ListView(
                          children: [
                            _buildActivityItem(
                              icon: Icons.work,
                              title: 'Job completed: Painting',
                              subtitle: '₹450 earned (2 days ago)',
                              color: Colors.green,
                            ),
                            _buildActivityItem(
                              icon: Icons.work,
                              title: 'Job started: Construction',
                              subtitle: 'On day 3 of 7-day job',
                              color: Colors.blue,
                            ),
                            _buildActivityItem(
                              icon: Icons.assignment,
                              title: 'Applied to: Masonry',
                              subtitle: 'Awaiting response',
                              color: Colors.orange,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      
                      // Quick actions
                      const Text(
                        '🛠️ Quick Actions',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        alignment: WrapAlignment.center,
                        children: [
                          _buildActionChip('Edit Profile', Icons.edit),
                          _buildActionChip('Payment Info', Icons.payment),
                          _buildActionChip('Language', Icons.language),
                          _buildActionChip('Notifications', Icons.notifications),
                        ],
                      ),
                      
                      // Logout button
                      const SizedBox(height: 20),
                      OutlinedButton(
                        onPressed: _logout,
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.red,
                          side: const BorderSide(color: Colors.red),
                        ),
                        child: const Text('LOGOUT'),
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

  Widget _buildStatCard(String value, String label, IconData icon) {
    return Container(
      width: MediaQuery.of(context).size.width / 2.5,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, size: 28, color: Colors.blue),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Row(
          children: [
            Icon(icon, color: color),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: Colors.grey,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionChip(String label, IconData icon) {
    return ChoiceChip(
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16),
          const SizedBox(width: 4),
          Text(label),
        ],
      ),
      selected: false,
      onSelected: (selected) {
        // Handle action
      },
    );
  }
}

// Import needed for the ProfileScreen to navigate to other screens
import 'home_screen.dart';
import 'search_screen.dart';
import 'nearby_screen.dart';
import 'messages_screen.dart';