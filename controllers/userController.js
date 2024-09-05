const User = require('../models/userModel.js');
const bcrypt = require('bcrypt');

// password secure
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
     } catch (error) {
        console.log(error.message)
     }
}

// define loadregister
const loadRegister = async(req,res) => {
    try {
        res.render('registration')
    } catch (error) {
        console.log(error.message);
    }
}

// inserting user to mongodb
const insertUser = async(req,res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            mobile:req.body.mobile,
            email:req.body.email,
            password:spassword,
            is_admin:0,
        });

        const userData = await user.save();

        if(userData){
            res.render('registration',{message:"your registration has been success",messageType:'success'})
        }else{
            res.render('registration',{message:"your registration has been failed",messageType:'error'})
        }
    }catch(error){
        console.log(error.message);
        res.render('registration',{message:"your registration has been failed",messageType:'error'})
    }
}

// login user 
const loginLoad = async(req,res)=> {

    try {
        res.render('login');
    } catch (error) {
        console.log(error.message)
    }
}

// verify Login
const verifyLogin = async (req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email});
        if(userData){
          const passwordMatch = await bcrypt.compare(password,userData.password)
          if(passwordMatch){
            req.session.user_id = userData._id;
            res.redirect('/home');
          }else{
            res.render('login',{message:"Incorrect Email or Password"})
          }
        }else{
            res.render('login',{message:"Incorrect Email or Password"})
        }
    } catch (error) {
        console.log(error.message)
    }
}

// load home
const loadhome = async(req,res)=> {
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message)
    }
}

// logout

const userLogout = async(req,res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message)
    }
}

// exporting loadregister;
module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadhome,
    userLogout
}