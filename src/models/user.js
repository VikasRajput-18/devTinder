const { Schema, model } = require("mongoose");
const validator = require("validator")


const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"]
    },

    photoUrl: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu5GX1lkI6T4INseXlhyZhaGMtq07LNid9Tw&s"
    },
    bio: {
        type: String
    },
    skills: [{
        type: String
    }]
}, {
    timestamps: true
});

const User = model("User", UserSchema)

module.exports = { User }
