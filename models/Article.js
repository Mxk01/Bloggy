let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let articleSchema = new Schema(
{
  // Here I've set up a customerId  I use it to link the Article Model with the User model
  customerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // with this we can link our models,meaning we can access our User model via this id
                required: true
                },
title:
{
  type:String
},
description:
{
  type:String
},
markdown:
{
  type:String
},
image:
{
  type:String
},
createdAt:
{
  type:Date,
  default:Date.now
},
likes:[{type: mongoose.Schema.Types.ObjectId,ref: 'User' }],
dislikes:[{type: mongoose.Schema.Types.ObjectId,ref: 'User'}],
category:{type:String}

},{timestamps:true}); // Timestamps is helpful on tracking when user was created ,we get 2 fields for that



module.exports = mongoose.model('Article',articleSchema);
