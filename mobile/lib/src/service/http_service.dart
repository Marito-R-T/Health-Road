import "package:http/http.dart" as http;
import 'package:mobile/src/models/Rating.dart';
import "dart:async";
import "dart:convert";
import 'package:mobile/src/models/Service.dart';

class Services {
  Services();

  Future<List<Service>?> getServicesByCategory(String name) async {
    final uri = Uri.https(
      'health-road.herokuapp.com',
      '/mobile/service/services-by-category/$name/',
    );
    final response = await http.get(uri);
    if (response.statusCode == 201) {
      List users = json.decode(response.body);
      return users.map((m) => Service.fromJson(m)).toList();
    } else {
      return null;
    }
  }

  Future<List<Service>?> getServices() async {
    final response = await http.get(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/service/all-services/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        });
    if (response.statusCode == 201) {
      List users = json.decode(response.body);
      return users.map((m) => Service.fromJson(m)).toList();
    } else {
      return null;
    }
  }

  Future<List<Service>?> getServicesByName(String name) async {
    final uri = Uri.https(
        'health-road.herokuapp.com', '/mobile/service/get-services/$name/');
    final response = await http.get(uri);
    if (response.statusCode == 201) {
      List users = json.decode(response.body);
      return users.map((m) => Service.fromJson(m)).toList();
    } else {
      return null;
    }
  }

  Future<List<Service>?> getServicesByPriceName(
      String name, double gte, double lte) async {
    final uri = Uri.https('health-road.herokuapp.com',
        '/mobile/service/services-by-price/$name/$gte/$lte');
    final response = await http.get(uri);
    if (response.statusCode == 201) {
      List users = json.decode(response.body);
      return users.map((m) => Service.fromJson(m)).toList();
    } else {
      return null;
    }
  }

  Future<List<Service>?> getServicesByPrice(double gte, double lte) async {
    final uri = Uri.https('health-road.herokuapp.com',
        '/mobile/service/services-by-price/$gte/$lte');
    final response = await http.get(uri);
    if (response.statusCode == 201) {
      List users = json.decode(response.body);
      return users.map((m) => Service.fromJson(m)).toList();
    } else {
      return null;
    }
  }

  Future<Rating?> RatingService(
      double score, String service, String hospital) async {
    final response = await http.post(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/service/rate-a-service/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
          'score': score.toString(),
          'service': service,
          'hospital': hospital
        },
        encoding: Encoding.getByName("utf-8"));
    if (response.statusCode == 201) {
      return Rating.fromJson(json.decode(response.body));
    } else {
      return null;
    }
  }

  Future<double?> getRatingService(String service, String hospital) async {
    final response = await http.get(
      Uri.parse(
          'https://health-road.herokuapp.com/mobile/service/service-rating/$service/$hospital'),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
    );
    if (response.statusCode == 201) {
      print(json.decode(response.body)['rating']);
      return double.parse(json.decode(response.body)['rating']);
    } else {
      return null;
    }
  }
}
