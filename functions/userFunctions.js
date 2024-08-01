const AppModel = require("../models/AppModel");
const { ReturnMessage } = require("./Utls");

async function NameAvailability(req, res) {
  let result, message;
  let { name } = req.params;
  result = await AppModel.findOne({ name: name });
  if (result) message = ReturnMessage(true, "App name already registered");
  else message = ReturnMessage(false, "App name is available");
  res.send(message);
}
// async function (req,res,next){

// }

module.exports = { NameAvailability };
