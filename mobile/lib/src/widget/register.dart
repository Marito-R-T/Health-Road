import 'dart:async';

import 'package:flutter/material.dart';
import 'package:mobile/src/models/User.dart';
import 'package:mobile/src/service/http_users.dart';
import 'package:mobile/src/widget/user/navigation_home_screen.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final httpuser = Users();
  final _user = TextEditingController();
  final _password = TextEditingController();
  final _cellphone = TextEditingController();
  final _name = TextEditingController();
  final _lastname = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  Future<User?>? ffuser;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: const Text("Register")),
        body: Column(children: <Widget>[
          Form(
              key: _formKey,
              child: Column(children: <Widget>[
                _userText(),
                _padding(),
                _passwordText(),
                _padding(),
                _nameText(),
                _padding(),
                _lastnameText(),
                _padding(),
                _celphoneText(),
                _padding(),
                Container(
                  alignment: Alignment.center,
                  padding: const EdgeInsets.all(8.0),
                  child: _registerButton(),
                ),
              ])),
        ]));
  }

  Widget _userText() {
    return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {
      return Container(
          padding: const EdgeInsets.symmetric(horizontal: 50.0),
          child: TextFormField(
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Porfavor ingresar usuario';
              }
            },
            keyboardType: TextInputType.text,
            controller: _user,
            decoration: const InputDecoration(
              icon: Icon(Icons.confirmation_number),
              hintText: 'Ingrese user name',
              labelText: 'User Name:',
            ),
          ));
    });
  }

  Widget _passwordText() {
    return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {
      return Container(
          padding: const EdgeInsets.symmetric(horizontal: 50.0),
          child: TextFormField(
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Porfavor ingresar contraseña';
              }
            },
            keyboardType: TextInputType.visiblePassword,
            controller: _password,
            obscureText: true,
            enableSuggestions: false,
            autocorrect: false,
            decoration: const InputDecoration(
              icon: Icon(Icons.confirmation_number),
              hintText: 'Ingrese su contraseña',
              labelText: 'Password:',
            ),
          ));
    });
  }

  Widget _nameText() {
    return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {
      return Container(
          padding: const EdgeInsets.symmetric(horizontal: 50.0),
          child: TextFormField(
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Porfavor ingresar nombre';
              }
            },
            keyboardType: TextInputType.text,
            controller: _name,
            decoration: const InputDecoration(
              icon: Icon(Icons.text_fields),
              hintText: 'Ingrese su nombre',
              labelText: 'Nombre:',
            ),
          ));
    });
  }

  Widget _lastnameText() {
    return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {
      return Container(
          padding: const EdgeInsets.symmetric(horizontal: 50.0),
          child: TextFormField(
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Porfavor ingresar apellido';
              }
            },
            keyboardType: TextInputType.text,
            controller: _lastname,
            decoration: const InputDecoration(
              icon: Icon(Icons.text_fields),
              hintText: 'Ingrese su apellido',
              labelText: 'Last name:',
            ),
          ));
    });
  }

  Widget _celphoneText() {
    return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {
      return Container(
          padding: const EdgeInsets.symmetric(horizontal: 50.0),
          child: TextFormField(
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Porfavor ingresar telefono';
              } else if (int.tryParse(value) == null) {
                return 'No es un numero';
              }
            },
            keyboardType: TextInputType.phone,
            controller: _cellphone,
            decoration: const InputDecoration(
              icon: Icon(Icons.settings_cell),
              hintText: 'Ingrese numero celular',
              labelText: 'Cellphone:',
            ),
          ));
    });
  }

  Widget _padding() {
    return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {
      return Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
      );
    });
  }

  Widget _registerButton() {
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
              onPressed: () {
                // devolverá true si el formulario es válido, o falso si
                // el formulario no es válido.
                if (_formKey.currentState!.validate()) {
                  ffuser = httpuser
                      .insertUsers(
                          _user.value.text,
                          _password.value.text,
                          _name.value.text,
                          _lastname.value.text,
                          _cellphone.value.text)
                      .then((value) {
                    if (value == null) {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                        content: Text('Error al registrar usuario'),
                        duration: Duration(seconds: 2),
                      ));
                    } else {
                      User.logged = value;
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) =>
                                  const NavigationHomeScreen()));
                    }
                  });
                  // Si el formulario es válido, queremos mostrar un Snackbar
                }
              },
              icon: const Icon(Icons.supervised_user_circle_rounded,
                  color: Colors.white),
              style: OutlinedButton.styleFrom(
                fixedSize: const Size(double.maxFinite, double.maxFinite),
              ),
              /*style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 50),
                elevation: 10,
                primary: Colors.purpleAccent),*/
              label: const Text(
                "Submit",
                style: TextStyle(color: Colors.white),
              )),
        ),
      );
    });
  }
}
