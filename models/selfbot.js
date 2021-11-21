const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userID: String,
  channelID: String,
  daily: Number,
  weekly: Number,
  start: Boolean,
  beg: Boolean
});

module.exports = mongoose.model("selfbot", messageSchema);