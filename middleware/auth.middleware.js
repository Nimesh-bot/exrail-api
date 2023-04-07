const jwt = require('jsonwebtoken')

const ACCESS_SECRET = process.env.ACCESS_SECRET

const verify_user = (req, res, next) => {
    try {
        var token = req.header("Authorization")
        if(!token) return res.status(400).json({message: "Please login to perform this action."})

        if(token.startsWith("Bearer")){
            token = token.split(" ")[1]
        }

        jwt.verify(token, ACCESS_SECRET, (err, user) => {
            if(err) return res.status(400).json({message: "You are not authorized to access this information."})

            req.user = user
            next()
        })
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}

module.exports = {
    verify_user
}