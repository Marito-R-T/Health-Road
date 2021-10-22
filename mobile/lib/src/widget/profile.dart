import 'package:flutter/material.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
            title: Text("Profile")
        ),
        body: SingleChildScrollView(
            child: Container(
                child: Column(
                    children: <Widget>[
                      Container(
                        child: Text('Hola que tal'),
                      )
                    ])
            )
        )
    );
  }
}