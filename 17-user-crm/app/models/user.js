// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
// user schema
var UserSchema = new Schema({
    name: String,
    surname: String,
    username: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    }],
    email: String
});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
    var user = this;

    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();
    // generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);
        // change the password to the hashed version
        user.password = hash;
        next();
    });
});

/**
 * Create session object for logged in user
 */
UserSchema.methods.createUserSession = function(req, res, user, next) {
    // var isAdmin = isUserAdmin(user);
    // Create session
    if (!req.session) req.session = {
        user: {}
    };
    req.session.user = {
        username: user.username,
        id: user._id
    };
    // req.session.save(function (err) {
    //   next(err);
    // });
}

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
    var user = this;
    return bcrypt.compareSync(password, user.password);
};
// return the model
module.exports = mongoose.model('User', UserSchema);