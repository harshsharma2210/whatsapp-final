const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const roomSchema = mongoose.Schema({
  name: String,
  messages: [
    {
      message: String,
      name: String,
      timestamp: String,
      received: Boolean,
    },
  ],
});

module.exports = mongoose.model("rooms", roomSchema);
