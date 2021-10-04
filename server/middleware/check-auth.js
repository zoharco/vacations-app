const jwt = require('jsonwebtoken');
const HttpError = require("../models/http-error");

const checkAuth = (req, res, next) => {
    if(req.method === 'OPTIONS') {
        return next();
    }
    try{
        const token = req.headers.authorization.split(' ')[1]; 
        if(!token){
            throw new Error('Authentication failed!');
        }
        const decodedToken = jwt.verify(token, 'jhs23j4kj23kjb2kj34bjk234' );
        req.userData = { userId: decodedToken.userId };
        next();

    } catch (err) {
        const error = new HttpError('Authentication failed!', 401);
        return next(error);
    }
};


module.exports = {
    checkAuth
}