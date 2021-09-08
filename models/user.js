const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: email => validator.isEmail(email),
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});

function toJSON() {
    const object = this.toObject();
    delete object.password;
    return object;
}

userSchema.methods.toJSON = toJSON;

module.exports = mongoose.model('user', userSchema);
