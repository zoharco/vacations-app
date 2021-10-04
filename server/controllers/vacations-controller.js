const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Vacation = require('../models/vacation');
const User = require('../models/user');

const getAllVacations = async (req, res, next) => {
    let vacations;
    try {
        vacations = await Vacation.find();
    } catch(err) {
        const error = new HttpError("Fetchimg vacation failed, please try again later.", 500);
        return next(error);
    }
    
    res.json({ vacations: vacations.map(vacation => vacation.toObject({ getters: true })) });
};
  
const getVacationById = async (req, res, next) => {
    const vacationId = req.params.vid;
    let vacation;
    try{
       vacation = await Vacation.findById(vacationId);
    } catch (err){
        const error = new HttpError(
            'Something went wrong, could not find a vacation.', 
            500
        );
        return next(error);
    }

    if(!vacation) {
        const error = new HttpError(
            'Could not find a vacation for the provided id.', 
            404
        );
        return next(error);
    }
    res.json({ vacation: vacation.toObject({ getters: true }) });// => { vacation } => {vacation: vacation}
};

const createVacation = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new HttpError('Invalid inputs passed, please check your data.', 422);
        return next(error);
    }

    const { title, description, price, imageUrl, countInStock, followers} = req.body;
    const createdVacation = new Vacation({
        title,
        description,
        price,
        imageUrl,
        countInStock,
        followers: followers || []
    });
    try{
        await createdVacation.save();
    } catch (err) {
        const error = new HttpError('Creating vacation failed, please try again.', 500)
        return next(erroor);
    }
    

    res.status(201).json({ vacation: createdVacation });
};

const updateVacation = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data.', 422);
    }
    
    const { title, description, countInStock, price, imageUrl } = req.body;
    const vacationId = req.params.vid;

    let vacation;
    try{
        vacation = await Vacation.findById(vacationId);
    } catch(err) {
        const error = new HttpError("Something went wrong, could not update vacation.", 500);
        return next(error);
    }

    vacation.title = title;
    vacation.description = description;
    vacation.countInStock = countInStock;
    vacation.price = price;
    vacation.imageUrl = imageUrl;


    try {
        await vacation.save();
    } catch (err) {
        const error = new HttpError("Something went wrong, could not update vacation.", 500);
        return next(error);
    }

    res.status(200).json({ vacation: vacation.toObject({ getters: true }) });
};

const deleteVacation = async (req, res, next) => {
    const vacationId = req.params.vid;
    let vacation;
    try {
        vacation = await Vacation.findById(vacationId);
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete vacation.", 500);
        return next(error);
    }

    if(vacation.followers.length > 0){
        await vacation.populate('followers');
        for(const userId of vacation.followers){
            try{
                user = await User.findById(userId);
                user.removeVacation(vacation.id);

            } catch(err){
                console.log("Error::::::::::", err);
            }
        }
    }
    try {
        await vacation.remove();
    } catch (err) {
        const error = new HttpError("Something went wrong, could not delete vacation.", 500);
        return next(error);
    }

    res.status(200).json({ message: 'Deleted vacation.' })
};


exports.getAllVacations = getAllVacations;
exports.getVacationById = getVacationById;
exports.createVacation = createVacation;
exports.updateVacation = updateVacation;
exports.deleteVacation = deleteVacation;
