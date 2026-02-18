const { verifyToken } = require('../services/authentication')

function checkforauthentication(tokenname) {
    return (req, res, next) => {
        const tokenvalue = req.cookies[tokenname]
        if (!tokenvalue) {
            req.admin = null;
            res.locals.admin = null;
            return next();
        }
        try {
            const payload = verifyToken(tokenvalue)
            req.admin = payload
            res.locals.admin = payload;
        } catch (error) {
            res.clearCookie(tokenname)
            req.admin = null;
            res.locals.admin = null;
        }
        next();
    }
}

function isAdmin(req, res, next) {
    
    if (!req.admin) {
        return res.redirect('/admin/login?error=Please login as admin first');
    }
    next();
}

module.exports = { checkforauthentication,isAdmin }