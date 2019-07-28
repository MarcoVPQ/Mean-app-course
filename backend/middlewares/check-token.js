const jwt = require('jsonwebtoken')

module.exports = (req, res, next ) => { 

    try{
        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, "secret_this_should_be_longer")
        req.user = { email : decoded.email, _id: decoded.userId }
        next()

    } catch (e) {
        res.status(401).json({message: 'No are not authenticated'})
    }
}