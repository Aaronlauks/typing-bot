const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  someID: String,
  channelID: String,
  prefix: String,
  disable: Array,
  lb: Array,
  daily: Number,
  weekly: Number,
  streak: Number,
  balance: Number,
  items: Array,
  wpm: Array,
  names: Array,
  time: Number,
  words: String
});

module.exports = mongoose.model("data", messageSchema);