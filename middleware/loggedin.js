

module.exports = function loggedin(req,res,next){
    if (!req.session || !req.session.loggedin) {
        //console.log(req.session, "================");
        req.flash('error', 'Please login first')
        return res.redirect('login')
        res.end()
    }
    next();
}