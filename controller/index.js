var postModel = require('../model/post')
var userModel = require('../model/user')


exports.index= function(req, res) {
     req.session.lastPage = req.originalUrl;
     req.session.error = null;
     userModel.find(function(err,user){
     	if(err){
     		console.log(err);
     	}else{
     		res.render('index', {
                        title: '首页',
                        userDetail:user
                    })
     	}
     });
     
}

exports.error=function(req,res){
    res.render('error');
}

