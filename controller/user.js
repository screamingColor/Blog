var userModel = require('../model/user');
var postModel = require('../model/post');
var fs = require('fs');
var path = require('path');

//数组删除某一项
function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      return arr;
    }
  }
}
//数组是否存在某一项
function hasItem(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      return 1;
    }
  }
}
//时间戳转换
function timeChange(ctime){
    ctime=Math.round(ctime/1000)
    var time=new Date(ctime*1000);
    var reslut=time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()
    return reslut;
}
//signup
exports.signup=function(req,res){
     req.session.info = null 
    var _user = req.body.user
    userModel.find({username:_user.username},function(err, user){

        if (err) {
            console.log(err)
        }
        if (user.length) {
            console.log('用户已存在')
            res.redirect('/')
        }else {
            var user = new userModel(_user)
            user.save(function (err,user){
                if (err) {
                    console.log(err)
                }
                res.redirect('/login')
            })
        }
    })

};
exports.showSignup=function(req,res){
    res.render('signup',{
        title:"注册页"
    });
};

//login
exports.showLogin=function(req,res){
  
    res.render('login',{
        title:"登陆页",
        err: req.session.info
    });

};

exports.login=function(req,res){
    req.session.info = null 
    var _user = req.body.user
    var username = _user.username
    var password = _user.password
    /*  console.log(_user)
     console.log(username)*/
    userModel.findOne({"username":username}, function (err, user){

        if (err) {
            console.log(err)
        }

        if (user) {
            user.comparePassword(password, function (err, isMatch) {
                if (err) {
                    console.log(err)
                }
                if (isMatch) {
                    req.session.user = user

                    console.log('密码正确')
                    if(req.session.user.role=="admin")
                        res.redirect('/userList')
                    else{
                        console.log(req.session.lastPage)
                        res.redirect(req.session.lastPage)
                    }
                } else {
                    console.log('密码错误')
                    req.session.info = "密码错误!!"  
                    console.log(req.session.info)

                    res.redirect('/login')
                }
            })
        } else {
            req.session.info = "该用户不存在!!!"  
            res.redirect('/login')
        }
    })

};

//logout
exports.logout=function(req, res){
    req.session.user = null;
    req.session.error = null;
    res.redirect('/');
};


//userMain
exports.userMain=function(req,res){
    req.session.lastPage = req.originalUrl;  
    var self=req.session.user;
    console.log(self);
    var _id = req.params.id;
    
    userModel.findById(_id,function(err,user){

        if(err){
            console.log(err)
        }
        if(!user){
            req.flash('error',err)
            res.redirect('/signup')
        }else{
            if(self&&hasItem(user.follower,self._id)){
                var ifStar = 1;
            }else{
                var ifStar = 0;
            }
            postModel
                .find({user:_id})
                .sort({"meta.updateAt":-1})
                .populate('user','username')
                .exec(function(err,post){
                    var name = user.username;
                    var id=user._id;
                    var photo = user.photo;
                    post.forEach(function(item){
                        item.meta.createAt=timeChange(item.meta.createAt);
                    });
                    res.render('userMain',{
                        title:"用户页",
                        name:name,
                        post:post,
                        photo:photo,
                        id:id,
                        ifStar:ifStar
                    })


                })

        }
    })
};


exports.savePhoto=function(req, res, next){
    var _user = req.session.user;
    var photoData = req.files.uploadPhoto;
    var filePath = photoData.path;
    var originalFilename = photoData.originalFilename;
/*    console.log(photoData)
    console.log(filePath)
    console.log(originalFilename)*/

    if (originalFilename) {
        fs.readFile(filePath, function (err, data) {
            var timestamp = Date.now();
            var type = photoData.type.split('/')[1];
            var photo = timestamp + '.' + type;
            var newPath = path.join(__dirname, '../', 'public/images/' + photo);

            fs.writeFile(newPath, data, function (err) {
                if(err){
                    console.log(err);
                }
                /*req.photo = photo*/
                userModel.update({_id:_user._id},{$set:{photo:photo}},function(err){
                    if(err){
                        console.log(err);
                    }

                    res.redirect('/userMain/'+_user._id);
                })
            })

        })

    } else {
        next();
    }
};

exports.updateP = function(req,res){

    /*console.log(req.photo)*/
    var _user = req.session.user;
    if(req.photo){
        userModel.update({_id:_user._id},{$set:{photo:photo}},function(err){
            if(err){
                console.log(err);
            }
            res.redirect('/userMain/'+_user._id);
        })
    }
    else{
        res.redirect('/');
    }
};

exports.star=function(req,res){
    var star=req.query;
    var self=req.session.user;
    console.log(star);
    userModel.findById(self._id,function(err,me){
        userModel.findById(star.id,function(err,other){
            if(star.state==1){
                me.star=removeByValue(me.star, star.id);
                other.follower=removeByValue(other.follower, self._id);
            }else{
                me.star.push(star.id);
                other.follower.push(self._id);
            }
            userModel.update( {'_id':star.id},{ $set : { "follower" : other.follower} },function(err){
                if(err){
                    console.log(err);
                }
            });
            userModel.update({'_id':self._id},{ $set : { "star" : me.star} },function(err){
                if(err){
                    console.log(err);
                }else{
                    var data={
                        code:'1'
                    };
                    res.send(data);
                }
            });
        })
    });
};
exports.saveArticle =  function (req,res){
    var mySave=req.query;
    var self=req.session.user;
    userModel.findById(self._id,function(err,user){
        if(err){
            console.log(err);
        }else{
            if(mySave.state==1){
               user.savePost=removeByValue(user.savePost, mySave.id); 
            }else{
                user.savePost.push(mySave.id);
            }
            userModel.update({'_id':self._id},{ $set : { "savePost" : user.savePost} },function(err){
                if(err){
                    console.log(err);
                }else{
                    var data={
                        code:'1'
                    };
                    res.send(data);
                }
            });
        }
    });
};
exports.myStar=function(req,res){
    var _id = req.params.id;
    userModel.findById(_id,function(err,user){
        if(err){
            console.log(err);
        }else{
            if(user.star.length!=0){
                var data=[];
                user.star.forEach(function(item,i){
                    userModel.findById(item,function(err,detail){
                        if(err){
                            console.log(err);
                        }else{
                            data.push(detail);
                            if(i==user.star.length-1){
                                res.render('myStar',{
                                    title:'我的关注',
                                    data:data
                                });
                            }
                        }
                    });
                });
                
                
            }else{
                res.render('myStar',{
                                title:'我的关注',
                            });
            }
            
        }
    });
};

exports.myFollower=function(req,res){
    var _id = req.params.id;
    userModel.findById(_id,function(err,user){
        if(err){
            console.log(err);
        }else{
            if(user.follower.length!=0){
                var data=[];
                user.follower.forEach(function(item,i){
                    userModel.findById(item,function(err,detail){
                        if(err){
                            console.log(err);
                        }else{
                            data.push(detail);
                            if(i==user.follower.length-1){
                                res.render('myFollower',{
                                    title:'关注我的人',
                                    data:data
                                });
                            }
                        }
                    });
                });
                
            }else{
                res.render('myFollower',{
                                title:'关注我的人',
                            });
            }
            
        }
    });
};
exports.mySave=function(req,res){
    var _id = req.params.id;
    userModel.findById(_id,function(err,user){
        if(err){
            console.log(err);
        }else{
            if(user.savePost.length!=0){
                var data=[];
                user.savePost.forEach(function(item,i){
                     postModel.find({'_id':item})
                        .populate('user')   
                        .exec(function(err,detail){
                            if(err){
                                console.log(err)
                            }else{
                                data.push(detail)
                                if(i==user.savePost.length-1){
                                    res.render('mySave',{
                                        title:'我的收藏',
                                        data:data
                                    });
                                }
                                 
                            }
                    });
                });
                
            }else{
                res.render('mySave',{
                                title:'我的收藏',
                            });
            }
            
        }
    });
};

exports.loginRequired = function (req, res, next) {
    var user = req.session.user;
    if (!user) {
        return res.redirect('/login');
    }
    next();
};

exports.adminRequired = function (req, res, next) {
    var user = req.session.user;
    if (user.role !=="admin" || !user.role) {
        return res.redirect('/login');
    }
    next();
};