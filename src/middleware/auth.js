const jwt = require("jsonwebtoken");
const { User } = require("../models/user");


const authUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(404).json({ message: "Token not found" })
        }

        const { userId } = await jwt.verify(token, process.env.JWT_SECRET_TOKEN);

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        req.user = user

        next()

    } catch (error) {
        res.status(401).json({ message: error?.message || "Unauthorized User" })
    }
}

module.exports = {
    authUser
}