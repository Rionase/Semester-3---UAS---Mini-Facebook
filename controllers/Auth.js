const Auth = (req,res,next) => {

    if ( req.session.user ) {
        if ( req.originalUrl.toLowerCase() == "/user/login" || req.originalUrl.toLowerCase() == "/user/signup" ) {
            res.redirect("/forbidden")
        }
        else {
            next()
        }
    }
    else {
        if ( req.originalUrl.toLowerCase() == "/user/login" || req.originalUrl.toLowerCase() == "/user/signup" ) {
            next()
        }
        else {
            res.redirect("/forbidden")
        }
    }

}

export default Auth;