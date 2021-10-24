import "package:http/http.dart" as http;
import "dart:async";
import "dart:convert";
import 'package:mobile/src/models/Service.dart';

class Services {
  Services();

  Future<List<Service>> getServicesByCategory(String name) async {
    final uri = Uri.https(
      'health-road.herokuapp.com',
      '/mobile/service/services-by-category/$name/',
    );
    final response = await http.get(uri);
    /*.then((value) {
      /*Iterable list = json.decode(value.body);
      users = list.map((model) => Category.fromJson(model)).toList();*/
    });*/
    List users = json.decode(response.body);
    return users.map((m) => Service.fromJson(m)).toList();
  }

  Future<List<Service>> getServices() async {
    final response = await http.get(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/service/all-services/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        });
    /*.then((value) {
      /*Iterable list = json.decode(value.body);
      users = list.map((model) => Category.fromJson(model)).toList();*/
    });*/
    List users = json.decode(response.body);
    return users.map((m) => Service.fromJson(m)).toList();
  }

  Future<List<Service>> getServicesByName(String name) async {
    final uri = Uri.https(
        'health-road.herokuapp.com', '/mobile/service/get-services/$name/');
    final response = await http.get(uri);
    /*.then((value) {
      /*Iterable list = json.decode(value.body);
      users = list.map((model) => Category.fromJson(model)).toList();*/
    });*/
    print(uri.toString());
    print(response.body);
    List users = json.decode(response.body);
    return users.map((m) => Service.fromJson(m)).toList();
  }
}
