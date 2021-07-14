const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    image: { type: String },
    email: { type: String, required: true },
    bio: { type: String },
    phoneno: { type: String },
    profession: { type: String },
    dob: { type: String, requires: true },
    role: { type: String, default:'organizer' },
    bname: { type: String },
    bcode: { type: String },
    accountno: { type: String },
    accounttitle: { type: String },
    isActive: { type: Boolean, default: true }

}, { collection: 'organizers', timestamps: true })

// organizerSchema.set('toObject', { virtuals: true })
// organizerSchema.set('toJSON', { virtuals: true })
// organizerSchema.virtual('users', {
//     ref: 'User',
//     foreignField: '_id',
//     localField: 'userId',
//     justOne: false,
// });

const Organizer = mongoose.model('organizers', organizerSchema);
module.exports = Organizer;
