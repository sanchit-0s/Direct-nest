

 const mongoose = require("mongoose"); //user ka model schema hai ki user kya kya contain karega i.e name,email,password

const UserSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
    bankName: String
  },
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    address: String
  }
}, { timestamps: true });


module.exports = mongoose.model("User", UserSchema);