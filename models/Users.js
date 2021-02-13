const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");


var CounterSchema = mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);


const UserSchema = mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      select: false,
      required: [true, "Pelase add a password"],
    }
  });

  UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  };

  UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
  };
  
  UserSchema.pre("save", async function (next) {
    let salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    let val = await counter.findByIdAndUpdate({_id: 'userId'}, {$inc: { seq: 1} });
    this.id = val.seq;
    next();
  });
  
  module.exports = mongoose.model("User", UserSchema);