var express = require('express');
var router = express.Router();


var Index = require('../controller/index')
var User = require('../controller/user')
var Post = require('../controller/post')
var Comment= require('../controller/comment')
var Search= require('../controller/search')




router.get('/', Index.index)
router.get('/error',Index.error)
//signup
router.post('/signup',User.signup)
router.get('/signup',User.showSignup)
//login
router.get('/login',User.showLogin)
router.post('/login',User.login)
//logout
router.get('/logout',User.logout)
//用户主页
router.get('/userMain/:id',User.userMain)
//关注接口
router.get('/star',User.star)
//userList
router.get('/userList',User.loginRequired, User.adminRequired,Post.userList)
//我的关注页面
router.get('/myStar/:id',User.myStar)
//关注我的人
router.get('/myFollower/:id',User.myFollower)
//收藏接口
router.get('/saveArticle',User.saveArticle)
//我的收藏
router.get('/mySave/:id',User.mySave)
//头像上传
router.post('/uploadPhoto',User.loginRequired,User.savePhoto)

//post
router.get('/post',User.loginRequired,Post.showPost)
router.post('/post',User.loginRequired,Post.posts)
router.get('/article/:id/:postId',Post.article)
router.get('/edit/:postId',User.loginRequired,Post.edit)
router.post('/update',User.loginRequired,Post.update)
router.get('/delete/:postId',User.loginRequired,Post.delete)
router.get('/adminDelete',User.loginRequired,Post.adminDelete)

//查询文章
router.get('/seq',Post.getArticle)

//comment
router.post('/user/comment', User.loginRequired, Comment.save)

//search
router.get('/search',Search.search)


//测试页面
router.get('/test',function(req,res){
    res.render('test')
})

module.exports = router;
