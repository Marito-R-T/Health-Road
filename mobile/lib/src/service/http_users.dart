import "package:http/http.dart" as http;
import "dart:async";
import "dart:convert";
import 'package:mobile/src/models/User.dart';

class Users {
  Users();

  Future<User> insertUsers(String user, String password, String name,
      String last_name, String cellphone) async {
    final response = await http.post(
      Uri.parse('http://localhost:3000/users/register'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF=8',
      },
      body: jsonEncode(<String, String>{
        'user': user,
        'password': password,
        'name': name,
        'last_name': last_name,
        'cellphone': cellphone
      }),
    );
    if (response.statusCode == 201) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed');
    }
  }
}
