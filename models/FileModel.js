const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publisher_email: {
    type: String,
    required: true,
  },
  publish_date: {
    type: Date,
    default: Date.now,
  },
  size: {
    required: true,
    type: Number,
  },
  type: String,
  state: {
    type: String,
    default: "pending",
  },
  name: {
    type: String,
    required: true,
  },
});
const FileModel = mongoose.model("files", schema);
module.exports = FileModel;
