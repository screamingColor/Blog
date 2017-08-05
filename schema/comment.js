var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
var date = new Date()

var CommentSchema = new Schema({
    post: {type: ObjectId, ref: 'post'},
    from: {type: ObjectId, ref: 'user'},
    reply: [{
        from: {type: ObjectId, ref: 'user'},
        to: {type: ObjectId, ref: 'user'},
        content: String
    }],
    to: {type: ObjectId, ref: 'user'},
    content: String,
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
})



CommentSchema.statics = {

    findById: function(id, cb) {
        return this
            .findOne({_id: id})
            .sort({"meta.updateAt":-1})
            .exec(cb)
    }
}

module.exports = CommentSchema