// grab the packages that we need for the task model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
// task schema
var TaskSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    finished: {
        type: Boolean
    },
    users: [{
        body: String,
        user: String
    }],
    group: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    _creator: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});
// hash the password before the task is saved
TaskSchema.pre('save', function(next) {
    var task = this;
    next();
});
// return the model
module.exports = mongoose.model('Task', TaskSchema);