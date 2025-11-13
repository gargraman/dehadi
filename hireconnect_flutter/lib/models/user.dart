class User {
  final String id;
  final String username;
  final String fullName;
  final String phone;
  final String role;
  final String? language;
  final String? location;
  final List<String>? skills;
  final String? aadhar;

  User({
    required this.id,
    required this.username,
    required this.fullName,
    required this.phone,
    required this.role,
    this.language,
    this.location,
    this.skills,
    this.aadhar,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      username: json['username'] ?? '',
      fullName: json['fullName'] ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? '',
      language: json['language'],
      location: json['location'],
      skills: json['skills'] != null ? List<String>.from(json['skills']) : null,
      aadhar: json['aadhar'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'fullName': fullName,
      'phone': phone,
      'role': role,
      'language': language,
      'location': location,
      'skills': skills,
      'aadhar': aadhar,
    };
  }
}