import 'package:intl/intl.dart';

class Credit {
  String? expiration;
  String? cvv;
  String card_number;
  String? holder;

  Credit(
      {required this.expiration,
      required this.cvv,
      required this.card_number,
      required this.holder});

  factory Credit.fromJson(Map<String, dynamic> json) {
    return Credit(
        expiration: json['expiration'].toString().replaceAll(" ", ""),
        cvv: json['cvv'].toString(),
        card_number: json['card_number'],
        holder: json['holder']);
  }

  static String convertexpiration(String exp) {
    String fechafinal =
        '20' + exp.substring(3, 5) + '/' + exp.substring(0, 2) + '/01';
    return fechafinal;
  }

  static String covertToexpiration(String exp) {
    String fechafinal = exp.substring(5, 7) + '/' + exp.substring(2, 4);
    return fechafinal;
  }
}
