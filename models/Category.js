let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let categorySchema = new Schema(
{
title:
{
type:String
}

},{timestamps:true}); // Timestamps is helpful on tracking when user was created ,we get 2 fields for that



module.exports = mongoose.model('Category',categorySchema);
