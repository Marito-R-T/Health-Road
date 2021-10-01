//imports
require('./models/connection_db');
const session = require('express-session');
//server
const express = require('express');
const app = express();
const port = 3000;

//session
app.use(session({
  secret: '987f4bd6d4315c20b2ec70a46ae846d19d0ce563450c02c5b1bc71d5d580060b',
  resave: false,
  saveUninitialized: true
}))

//enable aplication/json and form-urlencoded
var body_parser = require('body-parser');
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

//routes
var {hospital_router}=require('./routes/hospital');
var {services_router}=require('./routes/services');
var {categories_router}=require('./routes/category')
var {user_router}=require('./routes/user')
var {ambulance_driver_router}=require('./routes/ambulance_driver')


// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.rol == "0"){
    return next();
  }
  else{
    return res.sendStatus(401);
  }
};

app.use('/hospital',auth,hospital_router);
app.use('/service',auth,services_router);
app.use('/category',auth,categories_router);
app.use('/user',user_router);
app.use('/ambulance-driver',ambulance_driver_router);



app.get('/main', (req, res) => {
  res.render('prueba')
})



app.listen(port, () => console.log(`Example app listening on port port!`));