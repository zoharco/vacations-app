const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const vacationSchema = Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    imageUrl: { type: String, require: false },
    countInStock: { type: Number, require: true },
    followers: [{ type: mongoose.Types.ObjectId, require: false, ref: 'User' }]
});

vacationSchema.methods.addFollower = function(user) {
    const updatedFollowers = [...this.followers];
    updatedFollowers.push(user);
    this.followers = updatedFollowers;
    this.save();
}

vacationSchema.methods.removeFollower = function(userId) {
    const updatedFollowers = this.followers.filter(u => u.id !== userId);
    this.followers = updatedFollowers;
    this.save();
}

module.exports = mongoose.model('Vacation', vacationSchema);