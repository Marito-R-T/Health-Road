//imports
require('./models/connection_db');
const path_=require('./absolutepath').static_files
const uploads=require('./absolutepath').static_files_uploads
const session = require('express-session');

var url = require('url');
//server
const express = require('express');
const app = express();
const port = 3000;
var cors = require('cors')
//session
app.use(session({
  secret: '987f4bd6d4315c20b2ec70a46ae846d19d0ce563450c02c5b1bc71d5d580060b',
  resave: false,
  saveUninitialized: true
}))

app.use(cors())
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
var {user_router_mobile} = require('./routes/user_mobile')
var {service_router_mobile} = require('./routes/services_mobile')
var {hospital_router_mobile} = require('./routes/hospital_mobile')
var {category_router_mobile} = require('./routes/category_mobile')
var {views_router} = require('./routes/views_router')
var {views_router_auth} = require('./routes/views_router_aut')

//static
app.use(express.static(path_));
app.use(express.static(__dirname + '/uploads/'));
app.use(express.static('public'));

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  
  if (req.session && req.session.rol == "0"){
    return next();
  }
  else{
   res.redirect(url.format({ pathname: '/', query: { title: 'Error', message: 'Sesion expirada' , type: 'error' } }));
  
  }
};

app.use('/hospital',auth,hospital_router);
app.use('/service',auth,services_router);
app.use('/category',auth,categories_router);
app.use('/user',user_router);
app.use('/ambulance-driver',ambulance_driver_router);

//apis
app.use('/mobile/user/',user_router_mobile);
app.use('/mobile/service/',service_router_mobile);
app.use('/mobile/hospital/',hospital_router_mobile);
app.use('/mobile/category/',category_router_mobile);

app.use('',views_router);

app.use('/Hospital',auth,views_router_auth);

app.use((req,res,next)=> {
  res.status(404).render("404")
})

app.listen(port, () => console.log(`Example app listening on port port!`));