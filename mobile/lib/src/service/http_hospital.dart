import "package:http/http.dart" as http;
import 'package:mobile/src/models/Hospital.dart';
import "dart:async";
import "dart:convert";

class Hospitals {
  Hospitals();

  Future<List<Hospital>?> getHospitals() async {
    final response = await http.get(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/hospital/all-hospitals/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        });

    if (response.statusCode == 201) {
      List hospitals = json.decode(response.body);
      return hospitals.map((m) => Hospital.fromJson(m)).toList();
    } else {
      return null;
    }
  }

  Future<List<Hospital>?> getHospitalsByName(String name) async {
    final response = await http.get(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/hospital/info/$name'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        });
    if (response.statusCode == 201) {
      List hopitals = json.decode(response.body);
      return hopitals.map((m) => Hospital.fromJson(m)).toList();
    } else {
      return null;
    }
  }

  Future<List<Hospital>?> getHospitalSuggestions() async {
    final response = await http.get(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/hospital/suggestion-best-hospitals/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        });
    if (response.statusCode == 201) {
      List hopitals = json.decode(response.body);
      return hopitals.map((m) => Hospital.fromJson(m)).toList();
    } else {
      return null;
    }
  }

  Future<String?> name(String? name) async {
    return name;
  }
}
