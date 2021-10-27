// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility that Flutter provides. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';

import 'package:mobile/src/models/Credit.dart';

void main() {
  test('String MM/YY convert to date YYYY/MM/DD', () {
    // Assign date MM/YY.
    String date = "10/22";

    // Verify that the format to Date in js is same.
    expect(Credit.convertexpiration(date), equals("2022/10/01"));
  });

  test('Date YYYY-MM-DD convert to String MM/YY', () {
    // Assign date yyyy/MM/DD.
    String date = "2022-10-01";

    // Verify that our date is convert to MM/YY.
    expect(Credit.covertToexpiration(date), equals("10/22"));
  });
}
