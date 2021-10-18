import "package:http/http.dart" as http;
import 'package:mobile/src/models/Hospital.dart';
import "dart:async";
import "dart:convert";

class Hospitals {
  Hospitals();

  Future<List<Hospital>> getHospitals() async {
    final response = await http.get(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/hospital/all-hospitals/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        });
    /*.then((value) {
      /*Iterable list = json.decode(value.body);
      users = list.map((model) => Category.fromJson(model)).toList();*/
    });*/
    List hopitals = json.decode(response.body);
    return hopitals.map((m) => Hospital.fromJson(m)).toList();
  }
}
