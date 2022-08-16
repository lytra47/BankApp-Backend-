// Server - database integration

// imprt mongoose
const mongoose = require("mongoose");

// Connect server with mongodb via mongoose
mongoose.connect("mongodb://localhost:27017/bank", {
  useNewUrlParser: true, //to avoid warnings
});

// create model(collection)
const User = mongoose.model("User", {
  acno: Number,
  userName: String,
  passWord: String,
  balance: Number,
  transaction: [],
});

module.exports = {
  User,
};
