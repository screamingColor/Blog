var mongoose = require('mongoose');
var userSchema = require('../schema/user');
var userModel = mongoose.model('user',userSchema); //users是数据库集合的名称 ,将Schema发布为Model

userModel.find(function(err,user){
    if(user.length) return;
//用Model创建Entity(new)
    new userModel({
        username:"blue",
        password:"123",
    }).save();

    new userModel({
        username:"admin",
        password:"123",
        role:'admin',
        photo:"admin.jpeg"
    }).save();

})

module.exports = userModel;