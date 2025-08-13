const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    senderId: { // fromUserId
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    receiverId: { // toUserId
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
        required: true

    }
}, {
    timestamps: true,
})

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.receiverId.equals(connectionRequest.senderId)) {
        throw new Error("You cannot send a request to yourself")
    }
    next()
})

connectionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true })


const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel


