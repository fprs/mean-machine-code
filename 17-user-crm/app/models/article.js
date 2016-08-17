// grab the packages that we need for the article model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
// article schema
var ArticleSchema = new Schema({
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
// hash the password before the article is saved
ArticleSchema.pre('save', function(next) {
    var article = this;
    next();
});
// return the model
module.exports = mongoose.model('Article', ArticleSchema);