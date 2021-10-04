const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchame = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    vacations: [{ type: mongoose.Types.ObjectId, required: false, ref: 'Vacation' }]
});

userSchame.methods.addVacation = function(vacation) {
    const updatedVacations = [...this.vacations];
    updatedVacations.push(vacation);
    this.vacations = updatedVacations;
    this.save();
}

userSchame.methods.removeVacation = function(vacationId) {
    const updatedVacations = this.vacations.filter(vacation => vacation._id.toString() !== vacationId);
    this.vacations = updatedVacations;
    this.save();
}

userSchame.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchame);