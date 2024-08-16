const { default: mongoose } = require("mongoose");

const schema = new mongoose.Schema({
  name: { type: "string", required: true },
  fileName: { type: "string", required: true },
  date_registered: { type: Date, default: Date.now },
  description: { type: "string", required: true },
  price: { type: "number", required: false, default: 0 },
  icon: {
    type: "string",
    required: true,
    default: "https://tooltip-backend.vercel.app/assets/profile.jpg",
  },
  images: [],
  tutorial_video: String,
  file_url: String,
  os: String,
  version: String,
  organization: String,
  org_url: String,
  published_by: String,
  published_status: String,
  dev_email: String,
  publisher_email: String,
  last_updated: String,
  downloads: Number,
  latest: Boolean,
  type: String,
  size: Number
});
const AppModel = mongoose.model("apps", schema);
module.exports = AppModel;
/**
 *  publisher_email: String,
 *  date_registered
 * 
*/