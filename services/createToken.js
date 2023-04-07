const jwt = require('jsonwebtoken')

const access_secret = process.env.ACCESS_SECRET
const refresh_secret = process.env.REFRESH_SECRET

const access_token = async(_id, session_id="", time='30d') =>{
    const payload = {session_id}
    const token = jwt.sign(payload, access_secret, {expiresIn: time, issuer: 'ex-rail', audience: String(_id)})
    return token
}

const refresh_token = async(_id, session_id="", time='60d') =>{
    const payload = {session_id}
    const token = jwt.sign(payload, refresh_secret, {expiresIn: time, issuer: 'ex-rail', audience: String(_id)})
    return token
}


module.exports = {access_token, refresh_token}