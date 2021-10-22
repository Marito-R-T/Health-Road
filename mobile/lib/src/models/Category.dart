// ignore_for_file: file_names

class Category {
  final String name;

  Category({required this.name});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      name: json['name'],
    );
  }
}
