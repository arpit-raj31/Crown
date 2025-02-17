const mongoose = require("mongoose");

const dashboardSchema=new mongoose.Schema({
  totaldeposit:{type: String , unique: true, required: true },
  totalwithdrawal:{type: String , unique: true, required: true },
  pendingwithdrawl:{type: String, unique: true, required: true },
  activeuser:{type: String, unique: true, required: true },
  verifieduser:{type: String, unique: true, required: true },
  totaluser:{type: String, unique: true, required: true },
  abookprofit:{type: String, unique: true, required: true },
  abookbrokerage:{type: String, unique: true, required: true },
  abookdeposit:{type: String, unique: true, required: true },
  abookwithdrawal:{type: String, unique: true, required: true },
  bbookprofit:{type: String, unique: true, required: true },
  bbookbrokerage:{type: String, unique: true, required: true },
  bbookdeposit:{type: String, unique: true, required: true },
  bbookbrokerage:{type: String, unique: true, required: true }

})
module.exports =mongoose.model("dashboard",dashboardSchema);