const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  users: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  image: String,
  description: String,
});


module.exports = mongoose.model("Posts", postSchema);
