const User = require('../models/userModel');
const bcrypt = require('bcrypt')

const loadLogin = async (req,res) => {
    
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
        
    }
}

const securePassword = async (password) => {  
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
};


const verifyLogin = async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email });
        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    return res.render('login', { message: "Email or Password is incorrect" });
                } else {
                    req.session.user_id = userData._id;
                    return res.redirect('/admin/home');
                }
            } else {
                return res.render('login', { message: "Email and Password is incorrect" });
            }
        } else {
            return res.render('login', { message: "Email or Password is incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
};



const loadDashboard = async (req,res) => {
    try {
       const userData = await  User.findById({_id:req.session.user_id})
        res.render('home',{admin:userData}); 
    } catch (error) {
        console.log(error.message)
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Error in logging out');
            }
            return res.redirect('/admin');
        });
    } catch (error) {
        console.log(error.message);
    }
}


const adminDashboard = async(req,res)=>{
    try {
        const usersData = await User.find({is_admin:0})
        res.render('dashboard',{users:usersData});
    } catch (error) {
        console.log(error.message)
    }
}

const userAddpage = async (req, res) => {
    try {
        res.render('new-user')
    } catch (error) {
        console.error(error.message)
    }
};


const addUser = async(req,res)=> {
    try {
        const hashedPassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: hashedPassword,
            is_admin: 0
        });

        const userData = await user.save();

        if(userData){
             
            res.redirect('/admin/dashboard')
        }else{
            res.render('new-user',{message:'Failed To Register , Please try later'})
        }
    } catch (error) {
        if (error.code === 11000) {
            return res.render('new-user', { message: 'Email already exists! Please use a different email.' });
        } else {
            console.error('Error adding new user:', error.message);
            return res.render('new-user', { message: 'An error occurred while processing your request.' });
        }
    }
};


// edit user functionality

const editUserLoad = async(req,res) => {
    try {
         const id = req.query.id;
         const userData = await User.findById({_id:id});
         if(userData){
            res.render('edit-user',{user:userData})
         }else{
            res.redirect('/admin/dashboard')
         }
        res.render('edit-user');
    } catch (error) {
        console.log(error.message)
    }
}


const updateUsers = async (req,res) => {
    try{
        const userData = await User.findByIdAndUpdate({id:req.body.iid},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile}})
        res.redirect('/admin/dashboard')
    } catch(error){
        console.log(error.message);
    }
}

const deleteUser = async(req, res) => {
    try {
        const id = req.body.id
        await User.deleteOne({ _id: id });
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
};


module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    userAddpage,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}