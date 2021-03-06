import 'package:flutter/rendering.dart';
import "package:http/http.dart" as http;
import 'package:mobile/src/models/Credit.dart';
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
      print(response.body);
      return null;
    }
  }

  Future<User?> updateUser(String user, String password, String name,
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
      return User.fromJson(jsonDecode(response.body));
    } else {
      return null;
    }
  }

  void emailSend(String user, String email) async {
    await http.get(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/user/send-code-mail/$email/$user'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        });
  }

  Future<bool> verifyCode(String user, String code, String email) async {
    final response = await http.post(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/user/validate-code/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {'user': user, 'code': code, 'email': email},
        encoding: Encoding.getByName("utf-8"));
    if (response.statusCode == 201) {
      return true;
    } else {
      return false;
    }
  }

  Future<bool> deleteEmail(String user) async {
    final response = await http.delete(
        Uri.parse('https://health-road.herokuapp.com/mobile/user/delete-mail/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {'user': user},
        encoding: Encoding.getByName("utf-8"));
    if (response.statusCode == 201) {
      return true;
    } else {
      return false;
    }
  }

  Future<Credit?> createCreditCard(String cvv, String cardNumber,
      String expiration, String user, String holder) async {
    final response = await http.post(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/user/register-credit-card/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
          'user': user,
          "cvv": cvv,
          "card_number": cardNumber.replaceAll(" ", ""),
          "expiration": Credit.convertexpiration(expiration),
          "holder": holder
        },
        encoding: Encoding.getByName("utf-8"));
    if (response.statusCode == 201) {
      return Credit.fromJson(jsonDecode(response.body));
    } else {
      return null;
    }
  }

  Future<bool> updateCreditCard(String cvv, String cardNumber,
      String expiration, String user, String holder) async {
    final response = await http.put(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/user/update-credit-card/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
          'user': user,
          "cvv": cvv,
          "card_number": cardNumber.replaceAll(" ", ""),
          "expiration": Credit.convertexpiration(expiration),
          "holder": holder,
        },
        encoding: Encoding.getByName("utf-8"));
    if (response.statusCode == 201) {
      return true;
    } else {
      return false;
    }
  }

  Future<String> deleteCreditCard(String user) async {
    final response = await http.delete(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/user/eliminar-credit-card/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {'user': user},
        encoding: Encoding.getByName("utf-8"));
    return jsonDecode(response.body)['error'];
  }

  Future<Credit?> getCreditCard(String user) async {
    final response = await http.post(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/user/get-credit-card/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {'user': user},
        encoding: Encoding.getByName("utf-8"));
    if (response.statusCode == 201) {
      return Credit.fromJson(jsonDecode(response.body));
    } else {
      return null;
    }
  }

  Future<Credit?> returnNull() async {
    return null;
  }
}
