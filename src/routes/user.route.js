
const express = require("express");
const { authUser } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const { User } = require("../models/user");
const router = express.Router();


router.get("/user/connections", authUser, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connections = await ConnectionRequestModel.find({
            status: "accepted",
            $or: [{
                receiverId: loggedInUser._id,
            }, {
                senderId: loggedInUser._id,
            }
            ]
        }).populate({ path: "senderId receiverId", select: "-password -createdAt -updatedAt -__v -email" }).exec()

        const data = connections.map((user) => {
            if (user.senderId._id.toString() === loggedInUser._id.toString()) {
                return user.receiverId
            } else {
                return user.senderId

            }
        })


        return res.status(200).json({ data })

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
        }).populate({ path: "senderId", select: "-password -createdAt -updatedAt -__v -email" }).exec()

        return res.status(200).json({ data: connectionsRequests })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong" })
    }
})


router.get("/user/feed", authUser, async (req, res) => {
    try {
        // TODO :
        // 1.) User should see all the user card
        //     - he should not see his own card 
        //     - he should not see his connections 
        //     - he should not see ignored people 
        //     - he should not see already sent the connection request 
        const loggedInUser = req.user

        const connectionRequest = await ConnectionRequestModel.find({
            $or: [
                { senderId: loggedInUser._id },
                { receiverId: loggedInUser._id },
            ]
        }).select("senderId receiverId");

        const hideUserFromFeed = new Set();

        connectionRequest.forEach(request => {
            hideUserFromFeed.add(request.senderId.toString())
            hideUserFromFeed.add(request.receiverId.toString())
        })

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ]
        }).select("-password -email")

        return res.status(200).json({ data: users })


    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong" })
    }
})


module.exports = router