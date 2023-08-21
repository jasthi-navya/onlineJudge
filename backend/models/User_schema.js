const mongoose = require('mongoose');

const userschema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: function (value) {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              return emailRegex.test(value);
            },
            message: 'Invalid email format',
        },
    },
    password: {
        type: String,
        required: [true,'Password is required'],
        minlength: [6, 'Password should be at least 6 characters long'],
    },
    role: {
        type: String,
        required: [true,'role is required'],
    },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
});

const User_schema = mongoose.model('User', userschema);

module.exports = User_schema;