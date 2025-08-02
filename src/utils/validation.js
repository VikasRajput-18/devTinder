const validator = require("validator")

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("First and last name are required.");
    }
    if (firstName.length < 2 || firstName.length > 50) {
        throw new Error("First name should be between 2 and 50 characters.");
    }
    if (!validator.isEmail(email)) {
        throw new Error("Invalid email format.");
    }
    if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol).");
    }

}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "bio", "age", "gender", "email", "photoUrl", "skills"]
    const fields = Object.keys(req.body);
    if (fields.length === 0) return false;

    return fields.every(field => allowedEditFields.includes(field));

}


module.exports = { validateSignUpData, validateEditProfileData }