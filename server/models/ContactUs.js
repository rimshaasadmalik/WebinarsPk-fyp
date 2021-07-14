const mongoose = require('mongoose');
const ContactUsSchema = new mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  response: { type: String },
  city: { type: String, required: true },
  zip: { type: Number, required: true },
  isResponded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }

}, { collection: 'contactus' }, { timestamps: true });

const ContactUs = mongoose.model('contactus', ContactUsSchema);
module.exports = ContactUs
