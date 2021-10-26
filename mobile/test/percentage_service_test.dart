// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility that Flutter provides. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/src/models/Service.dart';

void main() {
  test('Discount prices of services', () {
    // Assign price an percentage of discount.
    double percentage = 0.1;
    double price = 100;

    // Verify that the discount is correctly.
    expect(Service.getDiscount(price, percentage), 10);
  });
}
