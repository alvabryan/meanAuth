const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.connect(config.database);

mongoose.connection.on('connected',()=>{
    console.log(`connected to database ${config.database}`);
});

mongoose.connection.on('error',(error)=>{
    console.log(`Database error ${error}`);
});

//initiate app
const app = express();

//user routes
const users = require('./routes/users');

//set static folder
app.use(express.static(path.join(__dirname,'public')));

//cors middleware 
//allows you to send request from a different domain
app.use(cors());

//body parser middleware
app.use(bodyParser.json());

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//require passport strategy
require('./models/passport')(passport);

//port
const port = 3000;

//extends users routes 
app.use('/users',users);

//index route
app.get('/',(req,res,next)=>{
    res.send("home page");
});

//port listener
app.listen(port, ()=>{
    console.log(`server started on port ${port}`)
});