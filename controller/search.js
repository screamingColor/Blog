var postModel = require('../model/post')
var userModel = require('../model/user')

exports.search=function(req,res){
    var option = req.query.option
    var q = req.query.q
    var pattern = new RegExp('['+q+']', "i");
    if(option=="标题"){
        postModel
            .find({title:pattern})
            .populate('user')
            .exec(function(err,title){
                if(err){
                    console.log(err)
                }
                console.log(title)
                res.render('result',{
                    title:"搜索标题页",
                    text:title,
                    option:option,
                    q:q
                })
            })

    }else{
        userModel.find({username:pattern},function(err,name){
            console.log(name)
            if(err){
                console.log(err)
            }
            res.render('result',{
                title:"搜索作者页",
                man:name,
                option:option,
                q:q
            })
        })
    }

}