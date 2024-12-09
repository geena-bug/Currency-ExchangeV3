const checkRole = (role)=> {
    return (req, res, next) => {
        if (req.user.user_type === role) {
            next();
        } else {
            res.status(403).json({
                message: 'Forbidden! You are not allowed to access this resource.'
            })
        }
    }
}
module.exports = checkRole;