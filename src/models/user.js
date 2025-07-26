const { Schema, model } = require("mongoose");


const UserSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    age: {
        type: Number,
    },
    gender: {
        type: Sting,
    },
});

const User = model("User", UserSchema)

module.exports = { User }
