import 'package:mobile/src/models/Hospital.dart';

class Rating {
  String? service;
  String? hospital;
  double? score;
  //Hospital? hospital;

  Rating({required this.service, required this.hospital, this.score});

  factory Rating.fromJson(Map<String, dynamic> json) {
    return Rating(
        service: json['service'],
        hospital: json['hospital_user'],
        score: json['score']);
  }
}
