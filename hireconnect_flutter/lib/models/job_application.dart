class JobApplication {
  final String id;
  final String jobId;
  final String workerId;
  final String status;
  final String? message;
  final DateTime createdAt;

  JobApplication({
    required this.id,
    required this.jobId,
    required this.workerId,
    required this.status,
    this.message,
    required this.createdAt,
  });

  factory JobApplication.fromJson(Map<String, dynamic> json) {
    return JobApplication(
      id: json['id'] ?? '',
      jobId: json['jobId'] ?? '',
      workerId: json['workerId'] ?? '',
      status: json['status'] ?? '',
      message: json['message'],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'jobId': jobId,
      'workerId': workerId,
      'status': status,
      'message': message,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}