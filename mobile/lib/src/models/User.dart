class User {
  ///Static User
  static User? logged;

  ///Static User

  final String user;
  final String? password;
  String? name;
  String? last_name;
  String? email;
  int? celphone;
  int? rol;
  String? profile_pic;

  User(
      {required this.user,
      required this.password,
      required this.name,
      required this.last_name,
      required this.email,
      required this.celphone,
      required this.rol,
      required this.profile_pic});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
        user: json['user'],
        password: json['password'],
        name: json['name'],
        last_name: json['last_name'],
        email: json['email'],
        celphone: json['celphone'],
        rol: json['rol'],
        profile_pic: json['profile_pic']);
  }
}
