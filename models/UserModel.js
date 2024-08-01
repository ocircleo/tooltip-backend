const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  email: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
    min: 6,
    max: 12,
  },
  role: {
    type: "string",
    required: true,
    default: "user",
  },
  profileImage: {
    type: "string",
    default: "https://tooltip-backend.vercel.app/assets/profile.jpg",
  },
  phone: String,
  country: String,
  city: String,
  address: String,
  wishlist: Array,
  comments: Array,
  history: Array,
  verified: Boolean,
  paymentHistory: Array,
});

const UserModel = mongoose.model("users", schema);
module.exports = UserModel;
