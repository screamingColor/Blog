var postModel = require('../model/post');
var userModel = require('../model/user');
var Comment = require('../model/comment');
var marked = require('marked');
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

exports.showPost=function(req,res){
    res.render('post',{
        title:"编辑页"
    })
};

exports.posts=function(req,res){
    var _user = req.session.user;
    var _post = req.body.post;
    var post = new postModel(_post);
    post
    .save(function (err,post) {
        if (err) {
            console.log(err);
        }
        res.redirect('/article/'+_user._id+'/'+post._id);
        /*res.redirect('/userMain/'+_user._id)*/
    });

};


exports.edit=function(req,res){
   var _postId =req.params.postId;

      postModel.findOne({_id:_postId},function(err,post){
        if(err){
            console.log(err);
        }

        res.render('edit',{
            title:"修改编辑页",
            post:post
        })
    })
};

exports.update=function(req,res){
    var _user = req.session.user;
    var _post = req.body.post;
    postModel.updateMarked(_post,function(err){
        if(err){
            console.log(err);
        }

        res.redirect('/article/'+_user._id+'/'+_post.id);
    });
};


exports.delete=function(req,res){
    var _user = req.session.user;
    var _postId =req.params.postId;

    postModel.remove({_id:_postId},function(err){
        if(err){
            console.log(err);
        }
        Comment.remove({post:_postId})
            .populate('post')
            .exec(function(err){
            if(err){
                console.log(err);
            }

            res.redirect('/userMain/'+_user._id);
        })


    });

};

exports.adminDelete=function(req,res){
    var _user = req.session.user;
    var _postId =req.query.postId;

    postModel.remove({_id:_postId},function(err){
        if(err){
            console.log(err);
        }
        Comment.remove({post:_postId})
            .populate('post')
            .exec(function(err){
            if(err){
                console.log(err);
            }

            res.send({
                code:1
            });
        })


    });

};


exports.article=function(req,res){
    req.session.lastPage = req.originalUrl;
    var self=req.session.user;
    var _id = req.params.id;
    var _postId = req.params.postId;
    userModel.findById(_id,function(err,user){
        if(user){
            postModel.update({_id: _postId}, {$inc: {pv: 1}}, function (err) {
                if(err) {
                    console.log(err);
                }
            })
            postModel.find({user:_id}).sort({"pv":-1}).populate('user').exec(function(err,info){

                postModel
                    .findOne({_id:_postId})
                    .populate('user')
                    .exec(function(err,post){
                        if(err){
                            console.log(err)
                        }

                        Comment.find({post: _postId})
                            .populate('from')
                            .populate('reply.from reply.to', 'username')
                            .sort({"meta.updateAt":1})
                            .exec(function(err,comments){
                                var replyc=0;
                            comments.forEach(function(c){
                                replyc+= c.reply.length;
                                var allc=comments.length+replyc;
                                if(post.commentL!=allc){
                                    postModel.update({_id: _postId}, {$set:{ commentL:allc}}, function (err){
                                        if(err) {
                                        console.log(err);
                                        }
                                     })

                                }

                            });
                                post.meta.createAt=timeChange(post.meta.createAt);

                                comments.forEach(function(item){
                                    item.meta.createAt=timeChange(item.meta.createAt);
                                });
                                if(self){
                                    userModel.findById(self._id,function(err,me){
                                        if(err){
                                            console.log(err);
                                        }else{
                                            if(hasItem(me.savePost, post._id)){
                                                ifSave=1;
                                            }else{
                                                ifSave=0;
                                            }
                                             res.render('article',{ 
                                                title:"文章页",
                                                info:info,
                                                comments:comments,
                                                post:post,
                                                ifSave:ifSave
                                            });
                                        }
                                    });
                                }else{
                                    res.render('article',{ 
                                        title:"文章页",
                                        info:info,
                                        comments:comments,
                                        post:post,
                                        ifSave:" "
                                    });
                                }
                            });

                    });
            });

        }
    });

};
exports.getArticle=function(req,res){
    var start=req.query.start;
    var data={};
    postModel.find().count().exec(function(err,count){
            if(err){
                console.log(err)
            }else{
                data.count=count;
            }
    });
    postModel.find().sort({"meta.updateAt":-1}).skip(parseInt(start)*10).limit(10)
            .populate('user')   
            .exec(function(err,result){
                if(err){
                    console.log(err)
                }else{
                    data.list=result;
                    res.send(data);
                }
        });
};

//userList
exports.userList=function(req,res){
    var _user=req.session.user
    postModel.find().sort({"meta.updateAt":1})
            .populate('user')   
            .exec(function(err,result){
                if(err){
                    console.log(err)
                }else{
                    result.forEach(function(item){
                        item.meta.createAt=timeChange(item.meta.createAt);
                    });
                    res.render('userList',{
                        result:result  
                    });
                }
        });
    
};




