let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let userSchema = new Schema(
{

username:
{
  type:String,
  required:true
},
password:
{
  type:String,
  required:true
},
email:
{
  type:String,
  required:true
}

},{timestamps:true}); // Timestamps is helpful on tracking when user was created ,we get 2 fields for that


module.exports = mongoose.model('User',userSchema);
