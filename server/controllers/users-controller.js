const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const Vacation = require('../models/vacation');
const User = require('../models/user');
const ROLE = require("../models/role");

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Zohar Cor',
        email: 'test@test.com',
        password: 'test123'
    },
    {
        id: 'u2',
        name: 'Meital Bur',
        email: 'testM@test.com',
        password: 'test123'
    },
    {
        id: 'u1',
        name: 'Israer Isr',
        email: 'testI@test.com',
        password: 'test123'
    }
];

const getUsers =async (req, res, next) => {
    let users;
    try{
        users = await User.find({}, "-password");
    } catch (err) {
        const error = new HttpError("Fetching users failed, please try again later.", 500);
        return next(error);
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
    
};

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { username, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch(err) {
        const error = new HttpError("Signing up failed, please try again later.", 500);
        return next(error);
    }

    if(existingUser){
        const error = new HttpError("User exist already, please login instead.", 422);
        return next(error);
    }

    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('Could not create user, plase try again.', 500);
        return next(error);
    }

    const createdUser = new User({
        id: uuid(),
        username,
        email,
        password: hashedPassword,
        vacations: [],
        role: ROLE.BASIC
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError("Signing up failed, please try again.", 500);
        return next(error);
    }
    
    let token;
    try{
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email }, 
            'jhs23j4kj23kjb2kj34bjk234',
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError("Signing up failed, please try again.", 500);
        return next(error);
    }
    

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
    const { username, password } = req.body;
    
    let existingUser;
    try {
        existingUser = await User.findOne({ username: username });
    } catch(err) {
        const error = new HttpError("logging in failed, please try again later.", 500);
        return next(error);
    }
    
    if (!existingUser){
        const error = new HttpError("Invalid credentials, could not log you in.", 401);
        return next(error);
    }

    let isValidPassword =  false;
    try{
        isValidPassword = await  bcrypt.compare(password, existingUser.password);
    } catch(err) {
        const error = new HttpError('Could not log you in, please check your credentials and try again.', 500);
        return next(error);
    }

    if(!isValidPassword){
        const error = new HttpError("Invalid credentials, could not log you in.", 401);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email }, 
            'jhs23j4kj23kjb2kj34bjk234',
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError("Logging in failed, please try again.", 500);
        return next(error);
    }

    res.json({ userId: existingUser.id, email: existingUser.email, token: token, userRole: existingUser.role });
};


const getMyVacations = async (req, res, next) => {
    const userId = req.params.uid;
    let userVacations; 
    try {
        userVacations = await User.findById(userId).populate('vacations');
    } catch(err) {
        const error = new HttpError(
            'Fetching vacations failed, please try again later.',
            500
        );
        return next(error);
    }
    if(!userVacations || userVacations.vacations.length === 0) {
        return next(new HttpError('Could not find a vacations for the provided user id.', 404));
    }
    res.json({ vacations: userVacations.vacations.map(vacation => vacation.toObject({ getters: true })) });
};


const addFollower = async (req, res, next) => {
    const { userId, vacationId } = req.body;
    
    let user;
    try{
        user = await User.findById(userId);
    } catch(err) {
        const error = new HttpError('Adding user failed, please try again later.', 500);
        return next(error);
    }

    if(!user) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }
    let vacation;
    try {
        vacation = await Vacation.findById(vacationId);
    } catch(err) {
        const error = new HttpError('Adding user failed, please try again later.1', 500);
        return next(error);
    }
    
    if(!vacation) {
        const error = new HttpError('Could not find vacation for provided id', 404);
        return next(error);
    }
    const userExist =  vacation.followers.includes(user.id);
    if(userExist){
        const error = new HttpError('Already followed', 500);
        return next(error);
    }

    vacation.addFollower(user);
    user.addVacation(vacation);
    res.status(200).json({ message: 'succed follow' });
};

const removeFollower = async (req, res, next) => {
    const { userId, vacationId } = req.body;

    let user;
    try{
        user = await User.findById(userId).populate('vacations');
    } catch(err) {
        const error = new HttpError('Something went wrong, could not delete vacation.', 500);
        return next(error);
    }

    if(!user) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }

    let vacation;
    try {
        vacation = await Vacation.findById(vacationId);
        await vacation.populate('followers');
    } catch(err) {
        const error = new HttpError('Removing user failed, please try again later.', 500);
        return next(error);
    }

    if(!vacation) {
        const error = new HttpError('Could not find vacation for provided id', 404);
        return next(error);
    }
    
    const userExist = vacation.followers.some(u => u.id === user.id);
    if(!userExist){
        const error = new HttpError('Could not find follower user, please try again later.', 500);
        return next(error);
    }
   
    vacation.removeFollower(user.id);
    user.removeVacation(vacation.id);
    res.status(200).json({ message: 'succed unfollow' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.addFollower = addFollower;
exports.removeFollower = removeFollower;
exports.getMyVacations = getMyVacations;