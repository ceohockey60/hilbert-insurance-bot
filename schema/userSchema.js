/**
 * This schema is for a single User
 */

"use strict";

var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  id: String,     // Unique ID identifying this user
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  state_of_res: String,
  insurance_plan_name: String,
  insurance_group_number: String,
  insurance_plan_object: mongoose.Schema.Types.ObjectId, // Insurance Object that's matched to the insurance plan User has
  num_issues_resolved: Number,
  common_questions: [String]
});

var User = mongoose.model('User', userSchema);

module.exports = User;
