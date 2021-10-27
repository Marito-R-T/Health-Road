import 'package:mobile/src/models/Hospital.dart';

class Service {
  String? name;
  String? description;
  double? price;
  double? discount;
  bool? status;
  Map<String, dynamic>? schedule;
  String? hospital;
  String? category_name;
  //Hospital? hospital;

  Service(
      {required this.name,
      required this.description,
      required this.price,
      required this.status,
      required this.schedule,
      required this.hospital,
      required this.category_name,
      required this.discount});

  factory Service.fromJson(Map<String, dynamic> json) {
    return Service(
        name: json['name'],
        description: json['description'],
        price: json['price'],
        status: json['status'],
        schedule: json['schedule'],
        //hospital: Hospital.fromJson(json['hospital_user']));
        hospital: json['hospital_user'],
        category_name: json['category_name'],
        discount: json['percentage']);
  }

  static double getDiscount(double price, percentage) {
    return price - (price * percentage / 100);
  }
}
