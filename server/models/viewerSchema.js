const mongoose = require('mongoose');

const viewerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    phoneno: { type: String },
    profession: { type: String },
    dob: { type: String, requires: true },
    role: { type: String, default:'viewer' },
    interests: [{ type: String }],
    bio: { type: String },
    bname: { type: String },
    bcode: { type: String },
    accountno: { type: String },
    accounttitle: { type: String },
    isActive: { type: Boolean, default:true }
})

const Viewer = mongoose.model('viewers', viewerSchema);
module.exports = Viewer;
