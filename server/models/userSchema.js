const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // _id: { type: mongoose.Schema.Types.ObjectId },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    token: { type: String, expires: 3600 },
    otp: Number,
    isActive: { type: Boolean, default: false }

}, { collection: 'users', timestamps: true })

// userSchema.set('toObject', { virtuals: true })
// userSchema.set('toJSON', { virtuals: true })

// userSchema.virtual('organizers', {
//     ref: 'Organizer',
//     foreignField: 'userId',
//     localField: '_id',
//     justOne: false,
// });

// userSchema.virtual('viewers', {
//     ref: 'Viewer',
//     foreignField: 'userId',
//     localField: '_id',
//     justOne: false,
// });



const User = mongoose.model('users', userSchema);
module.exports = User;
