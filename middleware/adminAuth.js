const isLogin = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is logged in, allow the request to continue
            return next();
        } else {
            // User is not logged in, redirect to the login page
            return res.redirect('/admin');
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            // User is already logged in, redirect to the home page
            return res.redirect('/admin/home');
        } else {
            // User is not logged in, allow the request to continue
            return next();
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}
