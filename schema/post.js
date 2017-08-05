var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var marked = require('marked');
var date = new Date();


var postSchema = new Schema({
    user:{
        type: ObjectId,
        ref: 'user'
    },
    title:String,
    content:String,
    pv:{
        type:Number,
        default:0
    },
    commentL:{
        type:Number,
        default:0
    },
    meta:{
        createAt: {
            type: String,
            default: date.getTime()
        },
        updateAt: {
            type: String,
            default:date.getTime()
        }
    }

});

//pre预处理函数
postSchema.pre('save', function(next) {
    this.content = marked(this.content);
    next();
});


//静态方法：fetch查找所有的用户，findById通过id查找用户,通过模型就可以调用
postSchema.statics = {

    findById: function(id, cb) {
        return this.findOne({
            _id: id
        }).exec(cb);
    },
    findByName: function (_name, cb) {
        return this.findOne({
            username: _name
        }).exec(cb);
    },
    updateMarked:function(_post,cb){
       _post.content = marked(_post.content);
       console.log(_post.content);
       this.update({_id:_post.id},{$set:{title:_post.title,content:_post.content}}).exec(cb);
    }
}


module.exports = postSchema;