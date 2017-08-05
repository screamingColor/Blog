var mongoose = require('mongoose');
var CommentSchema = require('../schema/comment');
var Comment = mongoose.model('comment', CommentSchema);//将Schema发布为Model

module.exports = Comment;