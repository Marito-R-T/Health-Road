import "package:http/http.dart" as http;
import "dart:async";
import "dart:convert";
import 'package:mobile/src/models/User.dart';

class Users {
  Users();

  Future<User> insertUsers(String user, String password, String name,
      String lastName, String cellphone) async {
    final response = await http.post(
      Uri.parse('http://localhost:3000/mobile/user/register/'),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: jsonEncode(<String, String>{
        'user': user,
        'password': password,
        'name': name,
        'last_name': lastName,
        'cellphone': cellphone
      }),
      encoding: Encoding.getByName("utf-8"),
      /*headers: {
        "Accept": "application/json",
        "Access-Control_Allow_Origin": "",
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'user': user,
        'password': password,
        'name': name,
        'last_name': lastName,
        'cellphone': cellphone
      })*/
    );
    ;
    if (response.statusCode == 201) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed');
    }
  }
}
