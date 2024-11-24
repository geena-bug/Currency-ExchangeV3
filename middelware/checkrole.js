const checkRole = (role)=> {
    return (req, res, next) => {
        if (req.user.role === role) {
            next();
        } else {
            res.status(405).json({
                message: 'Forbidden! You are not allowed to access this resource.'
            })
        }
    }
}
module.exports = checkRole;