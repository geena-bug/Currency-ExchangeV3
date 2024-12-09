const checkRole = ()=> (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.user_type)) {
            next();
        } else {
            res.status(403).json({
                message: 'Forbidden! You are not allowed to access this resource.'
            })
        }
    }
}
module.exports = checkRole;