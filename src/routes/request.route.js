const express = require("express");
const { authUser } = require("../middleware/auth");
const requestRouter = express.Router();


requestRouter.post("/send-connection", authUser, async (req, res) => {
    const user = req.user;
    res.send(user.firstName + " Sent the connection request")
})


module.exports = requestRouter