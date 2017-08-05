var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR =10;
var Schema = mongoose.Schema

var userSchema = new Schema ({
    username:{
        unique:true,
        type:String
    },
    password:String,
    role:{
        type:String,
        default:'user'
    },
    photo:{
        type:String,
        default:"default.jpg"
    },
    star:{
        type: Array,
        default: []
    },
    follower:{
        type: Array,
        default: []
    },
    savePost:{
        type: Array,
        default: []
    }
});

userSchema.pre('save', function(next) {
    var user = this

    bcrypt.hash(user.password, null, null, function (err, hash){
        if (err) {
            return next(err)
        }
        user.password = hash
        next()
    })
})

userSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrypt.compare(_password, this.password, function (err, isMatch) {
            if (err) {
                cb(err)
            }
            cb(null, isMatch)
        })
    }
}

//¾²Ì¬·½·¨
userSchema.statics = {

    findById: function(id, cb) {
        return this.findOne({
            _id: id
        }).exec(cb)
    }
}




module.exports = userSchema;