import 'dart:html';

import 'package:mobile/src/models/User.dart';
import 'package:mobile/src/service/http_users.dart';
import 'package:mobile/src/widget/homepage/design_course_app_theme.dart';
import 'package:mobile/src/widget/user/app_theme.dart';
import 'package:flutter/material.dart';

class HelpScreen extends StatefulWidget {
  const HelpScreen({Key? key, required this.user}) : super(key: key);

  final User user;

  @override
  // ignore: no_logic_in_create_state
  _HelpScreenState createState() => _HelpScreenState(user);
}

class _HelpScreenState extends State<HelpScreen> {
  final httpuser = Users();
  User user;

  _HelpScreenState(this.user);
  ////////////// TEXT EDITING CONTROLLERS ///////////////
  var _user;
  var _password;
  var _cellphone;
  var _name;
  var _lastname;
  ///////////////////////////////////////////////////////

  final _formKey = GlobalKey<FormState>();
  bool? editing = false;

  @override
  void initState() {
    ////////////// TEXT EDITING CONTROLLERS ///////////////
    _user = TextEditingController(text: widget.user.user);
    _password = TextEditingController(text: widget.user.password);
    _cellphone = TextEditingController(text: widget.user.celphone.toString());
    _name = TextEditingController(text: widget.user.name);
    _lastname = TextEditingController(text: widget.user.last_name);
    ///////////////////////////////////////////////////////
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppTheme.nearlyWhite,
      child: SafeArea(
        top: false,
        child: Scaffold(
          backgroundColor: AppTheme.nearlyWhite,
          body: Column(
            children: <Widget>[
              Form(
                  key: _formKey,
                  child: Column(children: <Widget>[
                    const Center(
                      child: Padding(
                        padding: EdgeInsets.only(top: 8.0, left: 18, right: 16),
                        child: Text(
                          'PROFILE',
                          textAlign: TextAlign.left,
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 22,
                            letterSpacing: 0.27,
                            color: DesignCourseAppTheme.darkerText,
                          ),
                        ),
                      ),
                    ),
                    /*Row(
                children: [
                  /*Container(
                    width: 200,
                    padding: EdgeInsets.only(
                        top: MediaQuery.of(context).padding.top,
                        left: 50,
                        right: 16),
                    child: Image.asset('images/helpImage.png'),
                  ),*/
                ],
              ),*/
                    _padding(),
                    Center(
                      child: Row(
                        children: <Widget>[
                          const SizedBox(
                            width: 10,
                          ), //SizedBox
                          const Text(
                            'Edit Information',
                            style: TextStyle(fontSize: 22.0),
                          ), //Text
                          const SizedBox(width: 10), //SizedBox
                          /** Checkbox Widget **/
                          Checkbox(
                            value: editing,
                            onChanged: (bool? value) {
                              setState(() {
                                editing = value;
                              });
                            },
                          ), //Checkbox
                        ], //<Widget>[]
                      ),
                    ),
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
            ],
          ),
        ),
      ),
    );
  }

  Widget _userText() {
    /*return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {*/
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
          // initialValue: widget.user.user,
        ));
    /*});*/
  }

  Widget _passwordText() {
    /*return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {*/
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
          enabled: editing,
          //initialValue: widget.user.password,
        ));
    //});
  }

  Widget _nameText() {
    /*return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {*/
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
          enabled: editing,
          //initialValue: widget.user.name,
        ));
    //});
  }

  Widget _lastnameText() {
    /*return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {*/
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
          enabled: editing,
          //initialValue: widget.user.last_name,
        ));
    //});
  }

  Widget _celphoneText() {
    /*return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {*/
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
          keyboardType: TextInputType.text,
          controller: _cellphone,
          decoration: const InputDecoration(
            icon: Icon(Icons.settings_cell),
            hintText: 'Ingrese numero celular',
            labelText: 'Cellphone:',
          ),
          enabled: editing,
          // initialValue: widget.user.celphone.toString(),
        ));
    //});
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
    /*return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {*/
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
            if (editing! && _formKey.currentState!.validate()) {
              // Si el formulario es válido, queremos mostrar un Snackbar
              httpuser
                  .updateUser(_user.text, _password.text, _name.text,
                      _lastname.text, _cellphone.text)
                  .then((value) {
                setState(() {
                  if (value) {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                      content: Text(
                          'Se ha modificado exitosamente la información \nvuelva a registrarse para notar los cambios'),
                      duration: Duration(seconds: 2),
                    ));
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                      content: Text(
                          'Ha sucedido un error con el servidor \n vuelva a intentarlo más tarde'),
                      duration: Duration(seconds: 2),
                    ));
                  }
                  editing = false;
                });
              });
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
          ),
        ),
      ),
    );
    //});
  }
}
