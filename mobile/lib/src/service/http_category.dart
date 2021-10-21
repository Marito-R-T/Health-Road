import "package:http/http.dart" as http;
import 'package:mobile/src/models/Category.dart';
import "dart:async";
import "dart:convert";

class Categories {
  Categories();

  Future<List<Category>> getCategories() async {
    final response = await http.get(
        Uri.parse(
            'https://health-road.herokuapp.com/mobile/category/show-categories/'),
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        });
    /*.then((value) {
      /*Iterable list = json.decode(value.body);
      users = list.map((model) => Category.fromJson(model)).toList();*/
    });*/
    List users = json.decode(response.body);
    return users.map((m) => Category.fromJson(m)).toList();
  }
}
