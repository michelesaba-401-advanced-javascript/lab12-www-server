"use strict";

const mongoose = require("mongoose");
//define the role schema for mongoose database
const roleSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  capabilities: { type: Array, required: true }
});
//new role equals constructor???
const Role = mongoose.model("roles", roleSchema);
//export to be used elsewhere
module.exports = Role;
