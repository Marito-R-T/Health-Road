import 'dart:html';

import 'package:mobile/src/models/User.dart';
import 'package:mobile/src/service/http_users.dart';
import 'package:mobile/src/widget/homepage/design_course_app_theme.dart';
import 'package:mobile/src/widget/user/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:email_validator/email_validator.dart';
import 'package:confirm_dialog/confirm_dialog.dart';

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
  var _email;
  var _code;
  ///////////////////////////////////////////////////////

  final _formKey = GlobalKey<FormState>();
  final _formKeyEmail = GlobalKey<FormState>();
  final _formKeyCode = GlobalKey<FormState>();
  bool? editing = false;
  bool? editingemail = false;
  bool? sendingcode = false;
  String? code;
  final _prueba = TextEditingController();

  @override
  void initState() {
    ////////////// TEXT EDITING CONTROLLERS ///////////////
    _user = TextEditingController(text: widget.user.user);
    _password = TextEditingController(text: widget.user.password);
    _cellphone = TextEditingController(text: widget.user.celphone.toString());
    _name = TextEditingController(text: widget.user.name);
    _lastname = TextEditingController(text: widget.user.last_name);
    _email = TextEditingController(text: widget.user.email);
    _code = TextEditingController();
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
            body: ListView(
              children: <Widget>[
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
                _padding(),
                Center(
                  child: Row(
                    children: <Widget>[
                      /** Checkbox Widget **/
                      Checkbox(
                        value: editing,
                        onChanged: (bool? value) {
                          setState(() {
                            editing = value;
                          });
                        },
                      ), //Checkbox
                      const SizedBox(
                        width: 10,
                      ), //SizedBox
                      const Text(
                        'Edit Information',
                        style: TextStyle(fontSize: 18.0),
                      ), //Text
                      const SizedBox(width: 10), //SizedBox
                    ], //<Widget>[]
                  ),
                ),
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
                      _padding(),
                    ])),
                Center(
                  child: Row(
                    children: <Widget>[
                      /** Checkbox Widget **/
                      Checkbox(
                        value: editingemail,
                        onChanged: (bool? value) {
                          setState(() {
                            editingemail = value;
                          });
                        },
                      ), //Checkbox//S
                      Expanded(
                        flex: 5,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10),
                          child: widget.user.email == null
                              ? const Text(
                                  'Add Email',
                                  style: TextStyle(fontSize: 18.0),
                                )
                              : const Text(
                                  'Change Email',
                                  style: TextStyle(fontSize: 18.0),
                                ),
                        ),
                      ),
                      widget.user.email != null
                          ? Expanded(
                              flex: 2,
                              child: Container(
                                  padding: const EdgeInsets.only(
                                      left: 10.0, right: 10.0),
                                  child: _deleteEmailButton()))
                          : Expanded(flex: 1, child: Container())
                    ], //<Widget>[]
                  ),
                ),
                Form(
                    key: _formKeyEmail,
                    child: Column(
                      children: [
                        Row(children: <Widget>[
                          Expanded(
                            flex: 3,
                            child: _emailText(),
                          ),
                          Expanded(
                            flex: 1,
                            child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 10.0),
                                child: _emailButton()),
                          ),
                        ]),
                        _padding(),
                      ],
                    )),
                Form(
                    key: _formKeyCode,
                    child: Column(children: [
                      _emailCode(),
                      _padding(),
                      Container(
                          alignment: Alignment.center,
                          padding: const EdgeInsets.only(left: 100, right: 100),
                          child: _confirmEmailButton()),
                    ])),
              ],
            )),
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
          enabled: false,
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
          label: const Text(
            "Submit",
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
    );
    //});
  }

  Widget _emailText() {
    /*return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {*/
    return Container(
        width: 420,
        padding: const EdgeInsets.symmetric(horizontal: 10.0),
        child: TextFormField(
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Porfavor ingresar email';
              } else if (!EmailValidator.validate(value)) {
                return 'No ha ingresado un email valido';
              }
            },
            keyboardType: TextInputType.emailAddress,
            controller: _email,
            decoration: const InputDecoration(
              icon: Icon(Icons.email),
              hintText: 'Ingrese email',
              labelText: 'Email:',
            ),
            enabled: editingemail
            // initialValue: widget.user.user,
            ));
    /*});*/
  }

  Widget _emailButton() {
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
            if (editingemail! && _formKeyEmail.currentState!.validate()) {
              // Si el formulario es válido, queremos mostrar un Snackbar
              httpuser.emailSend(_user.text, _email.text);
              setState(() {
                sendingcode = true;
                editingemail = false;
              });
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                content: Text('El codigo ha sido enviado con exito'),
                duration: Duration(seconds: 2),
              ));
            }
          },
          icon: const Icon(Icons.qr_code, color: Colors.white),
          style: OutlinedButton.styleFrom(
            fixedSize: const Size(double.maxFinite, double.maxFinite),
          ),
          label: const Text(
            "Send Code",
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
    );
    //});
  }

  Widget _emailCode() {
    /*return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {*/
    return Container(
        padding: const EdgeInsets.only(left: 100, right: 100),
        child: TextFormField(
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Confirmar Code';
            } else if (int.tryParse(value) == null) {
              return 'No es un Codigo';
            }
          },
          keyboardType: TextInputType.text,
          controller: _code,
          decoration: const InputDecoration(
            icon: Icon(Icons.email),
            hintText: 'Ingrese Codigo',
            labelText: 'code:',
          ),
          enabled: sendingcode,
          // initialValue: widget.user.user,
        ));
    /*});*/
  }

  Widget _confirmEmailButton() {
    /*return StreamBuilder(
        builder: (BuildContext context, AsyncSnapshot snapshot) {*/
    return Container(
      height: 30,
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
            // Si el formulario es válido, queremos mostrar un Snackbar
            if (sendingcode!) {
              httpuser
                  .verifyCode(_user.text, _code.text, _email.text)
                  .then((value) {
                setState(() {
                  sendingcode = false;
                });
                if (value) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                    content: Text(
                        'Verificado correctamente \n vuelva a loguearse para ver el cambio'),
                    duration: Duration(seconds: 2),
                  ));
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                    content: Text(
                        'El codigo es incorrecto \n vuelva a intentarlo más tarde'),
                    duration: Duration(seconds: 2),
                  ));
                }
              });
            }
          },
          icon: const Icon(Icons.supervised_user_circle_rounded,
              color: Colors.white),
          style: OutlinedButton.styleFrom(
            fixedSize: const Size(double.maxFinite, double.maxFinite),
          ),
          label: const Text(
            "Save Email",
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
    );
  }

  Widget _deleteEmailButton() {
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
          onPressed: () async {
            if (await confirm(context)) {
              httpuser.deleteEmail(widget.user.user!).then((value) {
                if (value) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                    content: Text('Se ha eliminado el Email!'),
                    duration: Duration(seconds: 2),
                  ));
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                    content: Text('No se pudo eliminar'),
                    duration: Duration(seconds: 2),
                  ));
                }
              });
            } else {
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                content: Text('Se ha cancelado!'),
                duration: Duration(seconds: 2),
              ));
            }
          },
          icon: const Icon(Icons.supervised_user_circle_rounded,
              color: Colors.white),
          style: OutlinedButton.styleFrom(
            fixedSize: const Size(double.maxFinite, double.maxFinite),
          ),
          label: const Text(
            "Delete",
            style: TextStyle(color: Colors.white),
          ),
        ),
      ),
    );
  }
}
