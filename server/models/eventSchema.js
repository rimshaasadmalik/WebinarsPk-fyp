const mongoose = require('mongoose');
const EventsSchema = new mongoose.Schema({

    eventImage: { type: String, required: true }, // { data: Buffer, contentType: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    hostName: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventTime: { type: String, required: true },
    duration: { type: Number, required: true },
    amount: { type: Number, default: 0 },
    seats: { type: Number, default: 50 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date },
    isStarted: { type: Boolean, default: false },
    isClosed: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }

}, { collection: 'events' }, { timestamps: true });

const Event = mongoose.model('events', EventsSchema);
module.exports = Event
