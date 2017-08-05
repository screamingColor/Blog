var mongoose = require('mongoose');
var postSchema = require('../schema/post');
var postModel = mongoose.model('post',postSchema);//将Schema发布为Model

module.exports = postModel;