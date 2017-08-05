
var Comment = require('../model/comment')


//post comment
exports.save = function (req, res){
    var _comment = req.body.comment
    var postId = _comment.post

    if (_comment.cid) {
        Comment.findById(_comment.cid, function (err, comment) {
            var newReply = {
                from: _comment.from,
                to: _comment.tid,
                content: _comment.content
            }
            comment.reply.push(newReply)
            comment.save(function (err, comment) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/article/'+comment.to+'/'+postId)
            })
        })
    } else {
        comment = new Comment(_comment)

        comment.save(function (err, comment){
            if (err) {
                console.log(err)
            }
            res.redirect('/article/'+comment.to+'/'+postId)
        })
    }
}
