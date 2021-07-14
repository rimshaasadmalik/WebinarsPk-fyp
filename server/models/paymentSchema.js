const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    // booking: { type: mongoose.Schema.Types.ObjectId, ref: 'bookings' },
    status: { type: String, required: true },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    isApproved: { type: Boolean },
    paidAt: { type: Date },
    receipt: { type: String },
    bname: { type: String },
    bcode: { type: String },
    accountno: { type: String },
    accounttitle: { type: String }

}, { collection: 'payments' }, { timestamps: true });

const Payment = mongoose.model('payments', paymentSchema);
module.exports = Payment;
