const { Schema, model } = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


const userSchema = new Schema({
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
        enum: {
            values: ["male", "female", "others"],
            message: `{VALUE} is not valid gender type`
        }
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


userSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: "7d"
    })

    return token
}


userSchema.methods.validatePassword = async function (password) {
    const user = this
    return await bcrypt.compare(password, user.password);
}

const User = model("User", userSchema)

module.exports = { User }
