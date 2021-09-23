require('./models/connection_db');
//server
const express = require('express');
const app = express();
const port = 3000;

//enable aplication/json and form-urlencoded
var body_parser = require('body-parser');
app.use(body_parser.json())
app.use(body_parser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

//routes
var {hospital_router}=require('./routes/hospital');
var {services_router}=require('./routes/services');

app.use('/hospital',hospital_router);
app.use('/service',services_router);
app.get('/main', (req, res) => {
  res.render('prueba')
})



app.listen(port, () => console.log(`Example app listening on port port!`));