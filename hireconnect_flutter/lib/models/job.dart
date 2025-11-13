class Job {
  final String id;
  final String employerId;
  final String title;
  final String description;
  final String workType;
  final String location;
  final String? locationLat;
  final String? locationLng;
  final String wageType;
  final int wage;
  final int? headcount;
  final List<String>? skills;
  final String status;
  final String? assignedWorkerId;
  final DateTime? startedAt;
  final DateTime? completedAt;
  final DateTime createdAt;

  Job({
    required this.id,
    required this.employerId,
    required this.title,
    required this.description,
    required this.workType,
    required this.location,
    this.locationLat,
    this.locationLng,
    required this.wageType,
    required this.wage,
    this.headcount,
    this.skills,
    required this.status,
    this.assignedWorkerId,
    this.startedAt,
    this.completedAt,
    required this.createdAt,
  });

  factory Job.fromJson(Map<String, dynamic> json) {
    return Job(
      id: json['id'] ?? '',
      employerId: json['employerId'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      workType: json['workType'] ?? '',
      location: json['location'] ?? '',
      locationLat: json['locationLat'],
      locationLng: json['locationLng'],
      wageType: json['wageType'] ?? '',
      wage: json['wage'] ?? 0,
      headcount: json['headcount'] ?? 1,
      skills: json['skills'] != null ? List<String>.from(json['skills']) : null,
      status: json['status'] ?? '',
      assignedWorkerId: json['assignedWorkerId'],
      startedAt: json['startedAt'] != null ? DateTime.parse(json['startedAt']) : null,
      completedAt: json['completedAt'] != null ? DateTime.parse(json['completedAt']) : null,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employerId': employerId,
      'title': title,
      'description': description,
      'workType': workType,
      'location': location,
      'locationLat': locationLat,
      'locationLng': locationLng,
      'wageType': wageType,
      'wage': wage,
      'headcount': headcount,
      'skills': skills,
      'status': status,
      'assignedWorkerId': assignedWorkerId,
      'startedAt': startedAt?.toIso8601String(),
      'completedAt': completedAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
    };
  }
}