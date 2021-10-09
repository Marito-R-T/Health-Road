
import "package:http/http.dart" as http;
import "dart:async";
import "dart:convert";
import 'package:mobile/src/models/User.dart';

class Users {
  Users();

<<<<<<< HEAD
  Future<User?> insertUsers(String user, String password, String name,
      String lastName, String cellphone) async{
=======
  Future<User> insertUsers(String user, String password, String name,
      String lastName, String cellphone) async {
>>>>>>> 6e0ec53f3956712579617c4839bda983f14238da
    final response = await http.post(
      Uri.parse('http://localhost:3000/mobile/user/register/'),
      headers: {
        "Accept": "application/json",
<<<<<<< HEAD
        "Access-Control-Allow-Origin": "*"
=======
        "Content-Type": "application/x-www-form-urlencoded"
>>>>>>> 6e0ec53f3956712579617c4839bda983f14238da
      },
      body: {
        'user': user,
        'password': password,
        'name': name,
        'last_name': lastName,
<<<<<<< HEAD
        'celphone': cellphone
      },
      encoding: Encoding.getByName("utf-8"),
=======
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
>>>>>>> 6e0ec53f3956712579617c4839bda983f14238da
    );
    ;
    if (response.statusCode == 201) {
      return User.fromJson(jsonDecode(response.body));
    }else {
      print('Error en la entrada');
      return null;
    }
  }
}
