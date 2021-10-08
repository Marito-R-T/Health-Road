class User {
  final String user;
  final String password;
  String name = "";
  String last_name = "";
  String email= "";
  String cellphone="";
  String rol="";

  User({required this.user, required this.password,
  required this.name, required this.last_name, required this.email,
  required this.cellphone, required this.rol});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      user: json['user'],
      password: json['password'],
      name: json['password'],
      last_name: json['last_name'],
      email: json['email'],
      cellphone: json['cellphone'],
      rol: json['rol'],
    );
  }
}