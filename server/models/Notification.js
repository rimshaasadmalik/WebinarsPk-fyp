const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({

    title: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

}, { collection: 'notifications' }, { timestamps: {createdAt: true, updatedAt: true} });

const Notification = mongoose.model('notifications', notificationSchema);
module.exports = Notification;
