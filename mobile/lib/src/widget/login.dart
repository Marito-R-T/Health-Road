import 'dart:ui';

import 'package:mobile/src/animation/fade_animation.dart';
import 'package:flutter/material.dart';
import 'package:mobile/src/models/User.dart';
import 'package:mobile/src/service/http_users.dart';
import 'package:mobile/src/widget/register.dart';
import 'package:mobile/src/widget/user/navigation_home_screen.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final http_user = Users();
  final Users users = new Users();
  final _user = TextEditingController();
  final _pass = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  Future<User?>? ffuser;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: SingleChildScrollView(
          child: Container(
            child: Column(
              children: <Widget>[
                Container(
                  height: 400,
                  decoration: BoxDecoration(
                      image: DecorationImage(
                          image: AssetImage('assets/images/background.png'),
                          fit: BoxFit.fill)),
                  child: Stack(
                    children: <Widget>[
                      Positioned(
                        left: 30,
                        width: 80,
                        height: 200,
                        child: FadeAnimation(
                            1,
                            Container(
                              decoration: BoxDecoration(
                                  image: DecorationImage(
                                      image: AssetImage(
                                          'assets/images/light-1.png'))),
                            )),
                      ),
                      Positioned(
                        left: 140,
                        width: 80,
                        height: 150,
                        child: FadeAnimation(
                            1.3,
                            Container(
                              decoration: BoxDecoration(
                                  image: DecorationImage(
                                      image: AssetImage(
                                          'assets/images/light-2.png'))),
                            )),
                      ),
                      Positioned(
                        right: 40,
                        top: 40,
                        width: 80,
                        height: 150,
                        child: FadeAnimation(
                            1.5,
                            Container(
                              decoration: BoxDecoration(
                                  image: DecorationImage(
                                      image: AssetImage(
                                          'assets/images/clock.png'))),
                            )),
                      ),
                      Positioned(
                        child: FadeAnimation(
                            1.6,
                            Container(
                              margin: EdgeInsets.only(top: 50),
                              child: Center(
                                child: Text(
                                  "Login",
                                  style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 40,
                                      fontWeight: FontWeight.bold),
                                ),
                              ),
                            )),
                      )
                    ],
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(30.0),
                  child: Column(
                    children: <Widget>[
                      Form(
                          key: _formKey,
                          child: FadeAnimation(
                              1.8,
                              Container(
                                padding: EdgeInsets.all(5),
                                decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: [
                                      BoxShadow(
                                          color:
                                              Color.fromRGBO(143, 148, 251, .2),
                                          blurRadius: 20.0,
                                          offset: Offset(0, 10))
                                    ]),
                                child: Column(
                                  children: <Widget>[
                                    Container(
                                      padding: EdgeInsets.all(8.0),
                                      decoration: BoxDecoration(
                                          border: Border(
                                              bottom: BorderSide(
                                                  color: Colors.grey))),
                                      child: TextFormField(
                                        validator: (value) {
                                          if (value == null || value.isEmpty) {
                                            return 'Porfavor ingresar usuario';
                                          }
                                        },
                                        decoration: InputDecoration(
                                            border: InputBorder.none,
                                            hintText: "User",
                                            hintStyle: TextStyle(
                                                color: Colors.grey[400])),
                                        style: TextStyle(color: Colors.black),
                                        keyboardType: TextInputType.text,
                                        controller: _user,
                                      ),
                                    ),
                                    Container(
                                      padding: EdgeInsets.all(8.0),
                                      child: TextFormField(
                                        validator: (value) {
                                          if (value == null || value.isEmpty) {
                                            return 'Porfavor ingresar usuario';
                                          }
                                        },
                                        decoration: InputDecoration(
                                            border: InputBorder.none,
                                            hintText: "Password",
                                            hintStyle: TextStyle(
                                                color: Colors.grey[400])),
                                        style: TextStyle(color: Colors.black),
                                        keyboardType: TextInputType.text,
                                        controller: _pass,
                                        obscureText: true,
                                        enableSuggestions: false,
                                        autocorrect: false,
                                      ),
                                    )
                                  ],
                                ),
                              ))),
                      SizedBox(
                        height: 30,
                      ),
                      FadeAnimation(2, _LoginButton()),
                      SizedBox(
                        height: 10,
                      ),
                      FadeAnimation(1.5, _Register()),
                      SizedBox(
                        height: 30,
                      ),
                      FadeAnimation(
                          1.5,
                          Text(
                            "Forgot Password?",
                            style: TextStyle(
                                color: Color.fromRGBO(143, 148, 251, 1)),
                          ))
                    ],
                  ),
                )
              ],
            ),
          ),
        ));
  }

  Widget _Register() {
    return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {
      return Container(
        height: 45,
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            gradient: const LinearGradient(colors: [
              Color.fromRGBO(143, 148, 251, 1),
              Color.fromRGBO(143, 148, 251, .6),
            ])),
        child: Center(
          child: OutlinedButton.icon(
              onPressed: () => Navigator.push(context,
                  MaterialPageRoute(builder: (context) => RegisterScreen())),
              icon: const Icon(Icons.supervised_user_circle_rounded,
                  color: Colors.white),
              style: OutlinedButton.styleFrom(
                fixedSize: Size(double.maxFinite, double.maxFinite),
              ),
              /*style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 50),
                elevation: 10,
                primary: Colors.purpleAccent),*/
              label: const Text(
                "Register",
                style: TextStyle(color: Colors.white),
              )),
        ),
      );
    });
  }

  Widget _LoginButton() {
    return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {
      return Container(
        height: 50,
        decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            gradient: const LinearGradient(colors: [
              Color.fromRGBO(130, 90, 251, 1),
              Color.fromRGBO(130, 90, 251, .6),
            ])),
        child: Center(
          child: OutlinedButton.icon(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  ffuser = http_user
                      .loginUser(_user.value.text, _pass.value.text)
                      .then((value) {
                    if (value == null) {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                        content: Text('No existe usuario'),
                        duration: Duration(seconds: 2),
                      ));
                    } else {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => NavigationHomeScreen()));
                    }
                  });
                }
              },
              icon: Icon(Icons.verified_user, color: Colors.white),
              style: OutlinedButton.styleFrom(
                fixedSize: Size(double.maxFinite, double.maxFinite),
              ),
              /*style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 50),
                elevation: 10,
                primary: Colors.purpleAccent),*/
              label: Text(
                "Login",
                style: TextStyle(color: Colors.white),
              )),
        ),
      );
    });
  }
}
