class Hospital {
  String user;
  String? name;
  Map<String, dynamic>? direction;
  String? description;
  int? payment_type;
  String? director_name;
  bool? status;
  List<String>? photos;
  String? profile_pic;

  Hospital(
      {required this.user,
      required this.name,
      required this.direction,
      required this.description,
      required this.payment_type,
      required this.director_name,
      required this.status,
      required this.photos,
      required this.profile_pic});

  factory Hospital.fromJson(Map<String, dynamic> json) {
    return Hospital(
        user: json['user'],
        name: json['name'],
        direction: json['direction'],
        description: json['description'],
        payment_type: json['payment_type'],
        director_name: json['director_name'],
        status: json['status'],
        photos: json['photos'],
        profile_pic: json['profile_pic']);
  }
}
