//mongodb connecting
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

//express
const express = require('express');
const app = express();


//user routes
const user_Route = require('./routes/userRoutes')
app.use('/',user_Route);

//Admin routes
const admin_Route = require('./routes/adminRoute')
app.use('/admin',admin_Route);

//app listening
app.listen(3000,()=>console.log('http://localhost:3000'))

