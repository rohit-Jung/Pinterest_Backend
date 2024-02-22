//Basic creation of post Schema, Model and exporting it
const mongoose = require("mongoose");


//Connection is established in the user's model itself so we don't do it here.
const postSchema = mongoose.Schema({
  users: {
    //Giving the objectId of the user from User model
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  image: String,
  description: String,
});


module.exports = mongoose.model("Posts", postSchema);
