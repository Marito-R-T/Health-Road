import 'package:mobile/src/models/Hospital.dart';

class Service {
  String? name;
  String? description;
  double? price;
  bool? status;
  Map<String, dynamic>? schedule;
  String? hospital;
  //Hospital? hospital;

  Service(
      {required this.name,
      required this.description,
      required this.price,
      required this.status,
      required this.schedule,
      required this.hospital});

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
        name: json['name'],
        description: json['description'],
        price: json['price'],
        status: json['status'],
        schedule: json['schedule'],
        //hospital: Hospital.fromJson(json['hospital_user']));
        hospital: json['hospital_user']);
  }
}
