const express = require("express");
const { authUser } = require("../middleware/auth");
const { User } = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");
const mongoose = require("mongoose");
const requestRouter = express.Router();

const { run: sendEmail } = require("../utils/sendEmail")

const allowedStatuses = ["interested", "ignored"];

requestRouter.post("/request/send/:status/:receiverId", authUser, async (req, res) => {
    try {
        const { receiverId, status } = req.params;
        const senderId = req.user._id;


        if (!receiverId) {
            return res.status(400).json({ message: "Receiver ID is required" })
        }

        if (!mongoose.isValidObjectId(receiverId)) {
            return res.status(400).json({ message: "Invalid receiver ID format" });
        }

        // if (receiverId.toString() === senderId.toString()) {
        //     return res.status(400).json({ message: "You cannot send a request to yourself" });
        // }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: `${status} is not a valid status. Allowed values: ${allowedStatuses.join(", ")}`,
            });
        }


        const receiverUser = await User.findById(receiverId);

        if (!receiverUser) {
            return res.status(404).json({ message: "Receiver not found" })
        }

        // const existingRequest = await ConnectionRequestModel.findOne({ receiverId, senderId })

        const existingRequest = await ConnectionRequestModel.findOne({
            $or: [
                {
                    receiverId,
                    senderId
                },
                {
                    receiverId: senderId, senderId: receiverId
                }
            ]
        })

        if (existingRequest) {
            const isSender = existingRequest.senderId.toString() === senderId.toString();
            return res.status(409).json({
                message: isSender
                    ? `You have already sent a request to ${receiverUser.firstName}`
                    : `${receiverUser.firstName} has already sent you a connection request`,
                status: existingRequest.status,
            });
        }


        const sendConnection = new ConnectionRequestModel({
            receiverId: receiverId,
            senderId: senderId,
            status: status
        })

        await sendConnection.save();



        const messages = {
            interested: `You have shown interest in ${receiverUser.firstName}'s profile.`,
            ignored: `You have ignored ${receiverUser.firstName}'s profile.`
        };

        const emailMessages = {
            interested: `Hi ${receiverUser.firstName},  
Someone has shown interest in your profile on LinkUp. 🎉  
Check it out and decide if you’d like to connect!`,

            ignored: `Hi ${receiverUser.firstName},  
Someone has chosen not to connect at this time.  
Don’t worry, keep exploring and you’ll find awesome developers to connect with!`
        };

        await sendEmail(
            receiverUser?.email,
            "LinkUp – Connection Update",
            emailMessages[status] || "There was an update to your profile."
        );
        return res.status(201).json({
            message: messages[status] || "Invalid Status",
            request: sendConnection,
        })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong" })

    }
})


requestRouter.post("/request/review/:status/:requestId", authUser, async (req, res) => {
    try {
        const { status, requestId } = req.params
        const loggedInUser = req.user;

        if (!requestId) {
            return res.status(400).json({ message: "Request ID is required" })
        }

        if (!mongoose.isValidObjectId(requestId)) {
            return res.status(400).json({ message: "Invalid receiver ID format" });
        }

        const allowedStatuses = ["accepted", "rejected"]

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: `${status} is not a valid status. Allowed values: ${allowedStatuses.join(", ")}`,

            })
        }

        const connectionRequest = await ConnectionRequestModel.findOne({
            _id: requestId,
            receiverId: loggedInUser._id,
            status: "interested"
        })

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" })
        }

        connectionRequest.status = status;

        const data = await connectionRequest.save()

        res.status(200).json({
            message: `Connection Request is ${status}`,
            data
        })


    } catch (error) {
        return res.status(500).json({ message: error.message || "Something went wrong" })
    }
})


module.exports = requestRouter