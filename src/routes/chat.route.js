
const express = require("express");
const { ChatModel } = require("../models/chat");
const { authUser } = require("../middleware/auth");


const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", authUser, async (req, res) => {
    const { targetUserId } = req.params;

    const userId = req.user._id;

    try {

        let chat = await ChatModel.findOne({
            participants: {
                $all: [userId, targetUserId]
            }
        }).populate({ path: "messages.senderId", select: "firstName lastName photoUrl age" });

        if (!chat) {
            chat = new ChatModel({
                participants: [userId, targetUserId],
                messages: []
            })
            await chat.save()
        }

        return res.status(200).json(chat)


    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message || "Something went wrong" })
    }
})

module.exports = { chatRouter }