import "package:http/http.dart" as http;
import "dart:async";
import "dart:convert";
import 'package:mobile/src/models/User.dart';

class Users {
  Users();

  Future<User?> insertUsers(String user, String password, String name,
      String lastName, String cellphone) async {
    final response = await http.post(
        Uri.parse('https://health-road.herokuapp.com/mobile/user/register/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
          'user': user,
          'password': password,
          'name': name,
          'last_name': lastName,
          'celphone': cellphone
        },
        encoding: Encoding.getByName("utf-8"));
    if (response.statusCode == 201) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      return null;
    }
  }

  Future<User?> loginUser(String user, String password) async {
    final response = await http.post(
        Uri.parse('https://health-road.herokuapp.com/mobile/user/login/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {'user': user, 'password': password},
        encoding: Encoding.getByName("utf-8"));
    print(response.statusCode);
    if (response.statusCode == 201) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      print('Error en la entrada');
      return null;
    }
  }

  Future<bool> updateUser(String user, String password, String name,
      String lastName, String cellphone) async {
    final response = await http.put(
        Uri.parse('https://health-road.herokuapp.com/mobile/user/update/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
          'user': user,
          'password': password,
          'name': name,
          'last_name': lastName,
          'celphone': cellphone
        },
        encoding: Encoding.getByName("utf-8"));
    print(response.statusCode);
    if (response.statusCode == 201) {
      return true;
    } else {
      return false;
    }
  }
}
