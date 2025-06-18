const jwt = require("jsonwebtoken");

//create token
const signToken = (payload) => { 
    return jwt.sign(payload,process.env.SECRETKEY)
}

//read Payload
const verifyToken = (token) => {
    return jwt.verify(token,process.env.SECRETKEY)
}

module.exports = { signToken, verifyToken };