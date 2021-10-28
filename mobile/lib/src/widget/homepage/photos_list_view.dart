import 'package:mobile/src/service/http_hospital.dart';
import 'package:mobile/main.dart';
import 'package:flutter/material.dart';

class PhotoListView extends StatefulWidget {
  const PhotoListView({Key? key, required this.listphoto}) : super(key: key);
  final List<String> listphoto;

  @override
  _PhotoListViewState createState() => _PhotoListViewState();
}

class _PhotoListViewState extends State<PhotoListView>
    with TickerProviderStateMixin {
  AnimationController? animationController;

  @override
  void initState() {
    animationController = AnimationController(
        duration: const Duration(milliseconds: 2000), vsync: this);
    super.initState();
  }

  Future<bool> getData() async {
    await Future<dynamic>.delayed(const Duration(milliseconds: 50));
    return true;
  }

  @override
  void dispose() {
    animationController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 16, bottom: 16),
      child: Container(
        height: 134,
        width: double.infinity,
        child: ListView.builder(
          padding:
              const EdgeInsets.only(top: 0, bottom: 0, right: 16, left: 16),
          itemCount: widget.listphoto.length,
          scrollDirection: Axis.horizontal,
          itemBuilder: (BuildContext context, int index) {
            final int count =
                widget.listphoto.length > 10 ? 10 : widget.listphoto.length;
            final Animation<double> animation =
                Tween<double>(begin: 0.0, end: 1.0).animate(CurvedAnimation(
                    parent: animationController!,
                    curve: Interval((1 / count) * (index), 1.0,
                        curve: Curves.fastOutSlowIn)));
            animationController?.forward();

            return PhotoView(
              photo: widget.listphoto[index],
              animation: animation,
              animationController: animationController,
            );
          },
        ),
      ),
    );
  }
}

class PhotoView extends StatelessWidget {
  const PhotoView(
      {Key? key, this.photo, this.animationController, this.animation})
      : super(key: key);

  final String? photo;
  final AnimationController? animationController;
  final Animation<double>? animation;

  /*Navigator.push<dynamic>(
      context,
      MaterialPageRoute<dynamic>(
        builder: (BuildContext context) => HospitalInfoScreen(),
      ),
    );*/
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animationController!,
      builder: (BuildContext context, Widget? child) {
        return FadeTransition(
          opacity: animation!,
          child: Transform(
            transform: Matrix4.translationValues(
                100 * (1.0 - animation!.value), 0.0, 0.0),
            child: InkWell(
              splashColor: Colors.transparent,
              child: SizedBox(
                width: 130,
                child: Stack(
                  children: <Widget>[
                    Container(
                      child: Padding(
                        padding: const EdgeInsets.only(
                            top: 24, bottom: 24, left: 16),
                        child: Row(
                          children: <Widget>[
                            ClipRRect(
                              borderRadius:
                                  const BorderRadius.all(Radius.circular(16.0)),
                              child: AspectRatio(
                                  aspectRatio: 1.0,
                                  child: Hospitals.getImageOnline(photo!)),
                            )
                          ],
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}
