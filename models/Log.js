const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  userName: String,
  accessTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', LogSchema, 'logs');