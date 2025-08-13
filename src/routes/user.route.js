
const express = require("express");
const { authUser } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const router = express.Router();


router.get("/user/connections", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequestModel.find({
            status: "accepted",
            receiverId: loggedInUser._id
        }).populate({ path: "senderId receiverId", select: "-password" }).exec()

        if (connections.length === 0) {
            return res.status(200).json({ message: "No Connections Found", data: connections })
        }

        return res.status(200).json({ data: connections })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong" })
    }
})
router.get("/user/requests/received", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionsRequests = await ConnectionRequestModel.find({
            status: "interested",
            receiverId: loggedInUser._id
        }).populate({ path: "senderId receiverId", select: "-password" }).exec()

        return res.status(200).json({ data: connectionsRequests })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong" })
    }
})

module.exports = router