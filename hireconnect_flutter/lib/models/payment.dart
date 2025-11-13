class Payment {
  final String id;
  final String jobId;
  final String employerId;
  final String workerId;
  final int amount;
  final String currency;
  final String status;
  final String? paymentMethod;
  final String? razorpayOrderId;
  final String? razorpayPaymentId;
  final String? razorpaySignature;
  final String? failureReason;
  final DateTime? createdAt;
  final DateTime? paidAt;

  Payment({
    required this.id,
    required this.jobId,
    required this.employerId,
    required this.workerId,
    required this.amount,
    required this.currency,
    required this.status,
    this.paymentMethod,
    this.razorpayOrderId,
    this.razorpayPaymentId,
    this.razorpaySignature,
    this.failureReason,
    this.createdAt,
    this.paidAt,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'] ?? '',
      jobId: json['jobId'] ?? '',
      employerId: json['employerId'] ?? '',
      workerId: json['workerId'] ?? '',
      amount: json['amount'] ?? 0,
      currency: json['currency'] ?? '',
      status: json['status'] ?? '',
      paymentMethod: json['paymentMethod'],
      razorpayOrderId: json['razorpayOrderId'],
      razorpayPaymentId: json['razorpayPaymentId'],
      razorpaySignature: json['razorpaySignature'],
      failureReason: json['failureReason'],
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
      paidAt: json['paidAt'] != null ? DateTime.parse(json['paidAt']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'jobId': jobId,
      'employerId': employerId,
      'workerId': workerId,
      'amount': amount,
      'currency': currency,
      'status': status,
      'paymentMethod': paymentMethod,
      'razorpayOrderId': razorpayOrderId,
      'razorpayPaymentId': razorpayPaymentId,
      'razorpaySignature': razorpaySignature,
      'failureReason': failureReason,
      'createdAt': createdAt?.toIso8601String(),
      'paidAt': paidAt?.toIso8601String(),
    };
  }
}