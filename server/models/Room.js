const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'events' }
}, { collection: 'rooms' }, { timestamps: true });

const Room = mongoose.model('rooms', roomSchema);
module.exports = Room;