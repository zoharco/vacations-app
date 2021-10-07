const jwt = require('jsonwebtoken');
const HttpError = require("../models/http-error");
const User = require('../models/user');

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

const authoRole = (role) => {
    return async (req, res, next) => {
        const { userId } = req.body;
        let user;
        try {
            user = await User.findById(userId);
            if(user.role !== role){
                const error = new HttpError("Error: User Not have Permission!", 401);
                return next(error);
            }
        } catch(err) {
            const error = new HttpError("Adding vacation failed, please try again later.", 500);
           return(error);
        }
        
        next();
    };
};

module.exports = {
    checkAuth,
    authoRole
};