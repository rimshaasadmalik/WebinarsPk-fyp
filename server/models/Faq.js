const mongoose = require('mongoose');
const FaqSchema = new mongoose.Schema({

  title: { type: String, required: true },
  message: { type: String, required: true },
  isActive: { type: Boolean, default: true }

}, { collection: 'faqs' }, { timestamps: true });

const Faq = mongoose.model('faqs', FaqSchema);
module.exports = Faq
