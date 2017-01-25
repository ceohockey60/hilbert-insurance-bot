//This schema is created to test MongoDB connection

"use strict";

/* jshint node: true */

// grab the things we need
var mongoose = require('mongoose');

// create a schema
var testSchema = new mongoose.Schema({
  version: String,
  load_date_time: {type: Date, default: Date.now}
});

// the schema is useless so far
// we need to create a model using it
var TestSchema = mongoose.model('TestSchema', testSchema);

// make this available
module.exports = TestSchema;
