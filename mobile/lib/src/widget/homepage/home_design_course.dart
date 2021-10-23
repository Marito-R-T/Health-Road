// ignore_for_file: unnecessary_new

import 'package:mobile/src/models/Category.dart';
import 'package:mobile/src/models/Hospital.dart';
import 'package:mobile/src/models/Service.dart';
import 'package:mobile/src/service/http_category.dart';
import 'package:mobile/src/service/http_hospital.dart';
import 'package:mobile/src/service/http_service.dart';
import 'package:mobile/src/widget/homepage/category_list_view.dart';
//import 'package:mobile/src/widget/homepage/category_list_view.dart';
import 'package:mobile/src/widget/homepage/popular_course_list_view.dart';
import 'package:mobile/main.dart';
import 'package:flutter/material.dart';
import 'design_course_app_theme.dart';

class DesignCourseHomeScreen extends StatefulWidget {
  const DesignCourseHomeScreen({Key? key}) : super(key: key);

  @override
  _DesignCourseHomeScreenState createState() => _DesignCourseHomeScreenState();
}

class _DesignCourseHomeScreenState extends State<DesignCourseHomeScreen> {
  String? categoryType;
  Categories categories = Categories();
  Services services = Services();
  final _searchText = TextEditingController();
  Hospitals hospitals = Hospitals();
  RangeValues _currentRangeValues = const RangeValues(0, 1000);
  // ignore: non_constant_identifier_names
  late Future<List<Service>?> Listservices;
  late Future<List<Hospital>?> nameHospital;
  bool? searchService = true;
  bool? searchHospital = false;
  String? ultimoService;

  @override
  void initState() {
    Listservices = services.getServices();
    nameHospital = hospitals.getHospitals();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: DesignCourseAppTheme.nearlyWhite,
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Column(
          children: <Widget>[
            SizedBox(
              height: MediaQuery.of(context).padding.top,
            ),
            getAppBarUI(),
            Expanded(
              child: SingleChildScrollView(
                controller: ScrollController(),
                child: Container(
                  height: MediaQuery.of(context).size.height,
                  child: Column(
                    children: <Widget>[
                      getSearchBarUI(),
                      const Padding(
                        padding: EdgeInsets.only(top: 8.0, left: 18, right: 16),
                        child: Text(
                          'Range Price Service',
                          textAlign: TextAlign.left,
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 12,
                            letterSpacing: 0.27,
                            color: DesignCourseAppTheme.darkerText,
                          ),
                        ),
                      ),
                      getRangeSlider(),
                      getCategoryUI(),
                      Flexible(
                        child: getPopularCourseUI(),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget getCategoryUI() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        const Padding(
          padding: EdgeInsets.only(top: 8.0, left: 18, right: 16),
          child: Text(
            'Category',
            textAlign: TextAlign.left,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 22,
              letterSpacing: 0.27,
              color: DesignCourseAppTheme.darkerText,
            ),
          ),
        ),
        const SizedBox(
          height: 16,
        ),
        Padding(
            padding: const EdgeInsets.only(left: 16, right: 16),
            child: Container(
              height: 50,
              width: double.infinity,
              child: new FutureBuilder<List<Category>>(
                future: categories.getCategories(),
                builder: (context, snapshot) {
                  if (snapshot.hasData) {
                    List<Category>? categories = snapshot.data;
                    return ListView.builder(
                      shrinkWrap: true,
                      physics: const ScrollPhysics(),
                      padding: const EdgeInsets.only(
                          top: 0, bottom: 0, right: 16, left: 16),
                      itemCount: categories?.length,
                      scrollDirection: Axis.horizontal,
                      itemBuilder: (BuildContext context, int index) {
                        return getButtonUI(categories![index].name,
                            categoryType == categories[index].name);
                      },
                    );
                    /*Row(
                        children: categories!
                            .map(
                              (category) => getButtonUI(
                                  category.name, categoryType == category.name),
                            )
                            .toList());*/
                  } else {
                    return const SizedBox();
                  }
                },
              ),
            )),
        /*Expanded(
          //padding: const EdgeInsets.only(left: 16, right: 16),
          child:*/
        const SizedBox(
          height: 16,
        ),
        /*nhospital != null
            ? CategoryListView(
                name: nhospital,
              )
            : CategoryListView(),*/
        FutureBuilder<List<Hospital>?>(
          future: nameHospital,
          builder: (context, snapshot) {
            if (snapshot.hasData) {
              return CategoryListView(
                listHospital: snapshot.data!,
              );
            } else {
              return Container();
            }
          },
        ),
      ],
    );
  }

  Widget getPopularCourseUI() {
    return Padding(
      padding: const EdgeInsets.only(top: 8.0, left: 18, right: 16),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const Text(
            'Services',
            textAlign: TextAlign.left,
            style: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: 22,
              letterSpacing: 0.27,
              color: DesignCourseAppTheme.darkerText,
            ),
          ),
          Flexible(
              child: FutureBuilder<List<Service>?>(
            future: Listservices,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return PopularCourseListView(
                  services: snapshot.data!,
                );
              } else {
                return const SizedBox(
                  width: double.maxFinite,
                  height: 50,
                );
              }
            },
          ))
        ],
      ),
    );
  }

  Widget getButtonUI(String categoryTypeData, bool isSelected) {
    return Padding(
      padding: const EdgeInsets.only(left: 5, right: 5),
      child: Container(
        decoration: BoxDecoration(
            color: isSelected
                ? DesignCourseAppTheme.nearlyBlue
                : DesignCourseAppTheme.nearlyWhite,
            borderRadius: const BorderRadius.all(Radius.circular(24.0)),
            border: Border.all(color: DesignCourseAppTheme.nearlyBlue)),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            splashColor: Colors.white24,
            borderRadius: const BorderRadius.all(Radius.circular(24.0)),
            onTap: () {
              if (!isSelected) {
                setState(() {
                  categoryType = categoryTypeData;
                  Listservices =
                      services.getServicesByCategory(categoryTypeData);
                });
              } else {
                setState(() {
                  categoryType = categoryTypeData;
                  Listservices = services.getServices();
                });
              }
            },
            child: Padding(
              padding: const EdgeInsets.only(
                  top: 12, bottom: 12, left: 18, right: 18),
              child: Center(
                child: Text(
                  categoryTypeData,
                  textAlign: TextAlign.left,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                    letterSpacing: 0.27,
                    color: isSelected
                        ? DesignCourseAppTheme.nearlyWhite
                        : DesignCourseAppTheme.nearlyBlue,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget getSearchBarUI() {
    return Padding(
      padding: const EdgeInsets.only(top: 8.0, left: 18),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            width: MediaQuery.of(context).size.width * 0.95,
            height: 64,
            child: Padding(
              padding: const EdgeInsets.only(top: 8, bottom: 8),
              child: Container(
                decoration: BoxDecoration(
                  color: HexColor('#F8FAFB'),
                  borderRadius: const BorderRadius.only(
                    bottomRight: Radius.circular(13.0),
                    bottomLeft: Radius.circular(13.0),
                    topLeft: Radius.circular(13.0),
                    topRight: Radius.circular(13.0),
                  ),
                ),
                child: Row(
                  children: <Widget>[
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.only(left: 16, right: 16),
                        child: TextFormField(
                          controller: _searchText,
                          style: const TextStyle(
                            fontFamily: 'WorkSans',
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: DesignCourseAppTheme.nearlyBlue,
                          ),
                          keyboardType: TextInputType.text,
                          decoration: InputDecoration(
                            labelText: 'Search for service',
                            border: InputBorder.none,
                            helperStyle: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: HexColor('#B9BABC'),
                            ),
                            labelStyle: TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                              letterSpacing: 0.2,
                              color: HexColor('#B9BABC'),
                            ),
                          ),
                          onEditingComplete: () {
                            if (searchService!) {
                              setState(() {
                                Listservices = services
                                    .getServicesByName(_searchText.text);
                              });
                              ultimoService = _searchText.text;
                            } else if (searchHospital!) {
                              print('hola entró');
                              setState(() {
                                nameHospital = hospitals
                                    .getHospitalsByName(_searchText.text);
                                //nhospital = _searchText.text;
                              });
                              /*listView..setHospitals(hospitals
                                  .getHospitalsByName(_searchText.text));*/
                            }
                          },
                          onChanged: (value) {
                            if (value.isEmpty) {
                              setState(() {
                                if (searchService!) {
                                  Listservices = services.getServices();
                                  ultimoService = null;
                                } else if (searchHospital!) {
                                  nameHospital = hospitals.getHospitals();
                                }
                              });
                            }
                          },
                        ),
                      ),
                    ),
                    SizedBox(
                      width: 60,
                      height: 60,
                      child: Icon(Icons.search, color: HexColor('#B9BABC')),
                    ),
                    const Text(
                      'Service',
                      textAlign: TextAlign.left,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                        letterSpacing: 0.20,
                        color: DesignCourseAppTheme.darkerText,
                      ),
                    ),
                    Checkbox(
                      value: searchService,
                      onChanged: (bool? value) {
                        setState(() {
                          searchService = value;
                          searchHospital = value == false;
                        });
                      },
                    ),
                    const Text(
                      'Hospital',
                      textAlign: TextAlign.left,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                        letterSpacing: 0.20,
                        color: DesignCourseAppTheme.darkerText,
                      ),
                    ),
                    Checkbox(
                      value: searchHospital,
                      onChanged: (bool? value) {
                        setState(() {
                          searchHospital = value;
                          searchService = value == false;
                        });
                      },
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget getAppBarUI() {
    return Padding(
      padding: const EdgeInsets.only(top: 8.0, left: 18, right: 18),
      child: Row(
        children: <Widget>[
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: const <Widget>[
                Text(
                  'Choose your',
                  textAlign: TextAlign.left,
                  style: TextStyle(
                    fontWeight: FontWeight.w400,
                    fontSize: 14,
                    letterSpacing: 0.2,
                    color: DesignCourseAppTheme.grey,
                  ),
                ),
                Text(
                  'Medical Service',
                  textAlign: TextAlign.left,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 22,
                    letterSpacing: 0.27,
                    color: DesignCourseAppTheme.darkerText,
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            width: 60,
            height: 60,
            child: Image.asset('homepage/icon-logo.png'),
          ),
        ],
      ),
    );
  }

  Widget getRangeSlider() {
    return RangeSlider(
      values: _currentRangeValues,
      min: 0,
      max: 1000,
      divisions: 100,
      labels: RangeLabels(
        _currentRangeValues.start.round().toString(),
        _currentRangeValues.end.round().toString(),
      ),
      onChanged: (RangeValues values) {
        setState(() {
          _currentRangeValues = values;
          if (ultimoService == null) {
            Listservices =
                services.getServicesByPrice(values.start, values.end);
          } else {
            Listservices = services.getServicesByPriceName(
                ultimoService!, values.start, values.end);
          }
        });
      },
    );
  }
}

enum CategoryType {
  ui,
  coding,
  basic,
}
