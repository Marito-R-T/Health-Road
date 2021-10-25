import 'package:confirm_dialog/confirm_dialog.dart';
import 'package:flutter_credit_card/credit_card_brand.dart';
import 'package:flutter_credit_card/credit_card_widget.dart';
import 'package:flutter_credit_card/flutter_credit_card.dart';
import 'package:mobile/src/models/Credit.dart';
import 'package:mobile/src/models/User.dart';
import 'package:mobile/src/service/http_users.dart';
import 'package:mobile/src/widget/homepage/design_course_app_theme.dart';
import 'package:mobile/src/widget/user/app_theme.dart';
import 'package:flutter/material.dart';

class FeedbackScreen extends StatefulWidget {
  const FeedbackScreen({Key? key}) : super(key: key);

  @override
  _FeedbackScreenState createState() => _FeedbackScreenState();
}

class _FeedbackScreenState extends State<FeedbackScreen> {
  String cardNumber = '';
  String expiryDate = '';
  String cardHolderName = '';
  String cvvCode = '';
  bool create = false;
  bool enabled = false;
  bool isCvvFocused = false;
  bool useGlassMorphism = false;
  bool useBackgroundImage = false;
  late Future<Credit?>? credit;
  OutlineInputBorder? border;
  final GlobalKey<FormState> formKey = GlobalKey<FormState>();
  Users users = Users();

  @override
  void initState() {
    setState(() {
      credit = users.getCreditCard(User.logged!.user);
    });
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
          body: Container(
            decoration: const BoxDecoration(
              color: DesignCourseAppTheme.nearlyWhite,
            ),
            child: SafeArea(
              child: Column(
                children: <Widget>[
                  const SizedBox(
                    height: 30,
                  ),
                  FutureBuilder<Credit?>(
                    future: credit,
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        create = false;
                        return Center(
                            child: Text(
                          'Tarjeta Ya Ingresada con el Nombre de: \n                             ${snapshot.data!.holder}',
                          textAlign: TextAlign.left,
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 18,
                            letterSpacing: 0.0,
                            color: DesignCourseAppTheme.nearlyBlack,
                          ),
                        ));
                      } else {
                        create = true;
                        enabled = true;
                        return const Center(
                            child: Text(
                          'No Tiene Ninguna Tarjeta Ingresada',
                          textAlign: TextAlign.left,
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 22,
                            letterSpacing: 0.0,
                            color: DesignCourseAppTheme.nearlyBlack,
                          ),
                        ));
                      }
                    },
                  ),
                  const SizedBox(
                    height: 30,
                  ),
                  CreditCardWidget(
                    cardNumber: cardNumber,
                    expiryDate: expiryDate,
                    cardHolderName: cardHolderName,
                    cvvCode: cvvCode,
                    showBackView: isCvvFocused,
                    obscureCardNumber: true,
                    obscureCardCvv: true,
                    isHolderNameVisible: true,
                    cardBgColor: DesignCourseAppTheme.nearlyBlue,
                    isSwipeGestureEnabled: true,
                    onCreditCardWidgetChange:
                        (CreditCardBrand creditCardBrand) {},
                    customCardTypeIcons: <CustomCardTypeIcon>[
                      CustomCardTypeIcon(
                        cardType: CardType.mastercard,
                        cardImage: Image.asset(
                          'homepage/icon-logo.png',
                          height: 48,
                          width: 48,
                        ),
                      ),
                    ],
                  ),
                  Expanded(
                    child: SingleChildScrollView(
                      child: Column(
                        children: <Widget>[
                          CreditCardForm(
                            formKey: formKey,
                            obscureCvv: true,
                            obscureNumber: true,
                            cardNumber: cardNumber,
                            cvvCode: cvvCode,
                            isHolderNameVisible: true,
                            isCardNumberVisible: true,
                            isExpiryDateVisible: true,
                            cardHolderName: cardHolderName,
                            expiryDate: expiryDate,
                            themeColor: Colors.blue,
                            textColor: DesignCourseAppTheme.darkerText,
                            cardNumberDecoration: InputDecoration(
                              labelText: 'Number',
                              hintText: 'XXXX XXXX XXXX XXXX',
                              hintStyle: const TextStyle(
                                  color: DesignCourseAppTheme.darkText),
                              labelStyle: const TextStyle(
                                  color: DesignCourseAppTheme.darkerText),
                              focusedBorder: border,
                              enabledBorder: border,
                              enabled: enabled,
                            ),
                            expiryDateDecoration: InputDecoration(
                              hintStyle: const TextStyle(
                                  color: DesignCourseAppTheme.darkText),
                              labelStyle: const TextStyle(
                                  color: DesignCourseAppTheme.darkerText),
                              focusedBorder: border,
                              enabledBorder: border,
                              labelText: 'Expired Date',
                              hintText: 'XX/XX',
                              enabled: enabled,
                            ),
                            cvvCodeDecoration: InputDecoration(
                              hintStyle: const TextStyle(
                                  color: DesignCourseAppTheme.darkText),
                              labelStyle: const TextStyle(
                                  color: DesignCourseAppTheme.darkerText),
                              focusedBorder: border,
                              enabledBorder: border,
                              labelText: 'CVV',
                              hintText: 'XXX',
                              enabled: enabled,
                            ),
                            cardHolderDecoration: InputDecoration(
                              hintStyle: const TextStyle(
                                  color: DesignCourseAppTheme.darkText),
                              labelStyle: const TextStyle(
                                  color: DesignCourseAppTheme.darkerText),
                              focusedBorder: border,
                              enabledBorder: border,
                              labelText: 'Card Holder',
                              enabled: enabled,
                            ),
                            onCreditCardModelChange: onCreditCardModelChange,
                          ),
                          const SizedBox(
                            height: 20,
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: <Widget>[
                              const Text(
                                'Modify',
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 18,
                                ),
                              ),
                              Switch(
                                value: enabled,
                                inactiveTrackColor: Colors.grey,
                                activeColor: Colors.white,
                                activeTrackColor:
                                    DesignCourseAppTheme.nearlyBlue,
                                onChanged: (bool value) => setState(() {
                                  enabled = value;
                                }),
                              ),
                            ],
                          ),
                          const SizedBox(
                            height: 20,
                          ),
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8.0),
                              ),
                              primary: const Color(0xff1b447b),
                            ),
                            child: Container(
                              margin: const EdgeInsets.all(12),
                              child: create
                                  ? const Text(
                                      'Add Credit Card',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontFamily: 'halter',
                                        fontSize: 14,
                                        package: 'flutter_credit_card',
                                      ),
                                    )
                                  : const Text(
                                      'Change Credit Card',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontFamily: 'halter',
                                        fontSize: 14,
                                        package: 'flutter_credit_card',
                                      ),
                                    ),
                            ),
                            onPressed: () {
                              if (formKey.currentState!.validate()) {
                                if (create) {
                                  _createCreditCard();
                                } else {
                                  _updateCreditCard();
                                }
                              } else {
                                ScaffoldMessenger.of(context)
                                    .showSnackBar(const SnackBar(
                                  content: Text(
                                      'Arreglar los campos mal ingresados'),
                                  duration: Duration(seconds: 1),
                                ));
                              }
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _createCreditCard() {
    users
        .createCreditCard(
            cvvCode, cardNumber, expiryDate, User.logged!.user, cardHolderName)
        .then((value) {
      if (value != null) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Se ha agregado con exito'),
          duration: Duration(seconds: 2),
        ));
        setState(() {
          enabled = false;
          create = false;
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text(
              'Error al Agregar Tarjeta de Credito \n Ver si ya esta agregado a otra cuenta'),
          duration: Duration(seconds: 2),
        ));
      }
    });
  }

  void _updateCreditCard() async {
    if (await confirm(context,
        title: const Text('Change Credit Card'),
        content: const Text('Are you want change your credit card?'))) {
      users
          .updateCreditCard(cvvCode, cardNumber, expiryDate, User.logged!.user,
              cardHolderName)
          .then((value) {
        if (value) {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text('Se ha cambiado con exito'),
            duration: Duration(seconds: 2),
          ));
          setState(() {
            enabled = false;
            create = false;
            credit = users.getCreditCard(User.logged!.user);
          });
        } else {
          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text(
                'Error al Cambiar Tarjeta de Credito \n Ver si ya esta agregado a otra cuenta'),
            duration: Duration(seconds: 2),
          ));
        }
      });
    }
  }

  void onCreditCardModelChange(CreditCardModel? creditCardModel) {
    setState(() {
      cardNumber = creditCardModel!.cardNumber;
      expiryDate = creditCardModel.expiryDate;
      cardHolderName = creditCardModel.cardHolderName;
      cvvCode = creditCardModel.cvvCode;
      isCvvFocused = creditCardModel.isCvvFocused;
    });
  }
}
