const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'events' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'payments' },
  isClosed: { type: Boolean, default: false }

}, { collection: 'bookings' }, { timestamps: true });

const Booking = mongoose.model('bookings', bookingSchema);
module.exports = Booking;
