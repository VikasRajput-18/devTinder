const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const { ChatModel } = require("../models/chat");
const { User } = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");


const getSecretRoomId = (userId, targetUserId) => {
    const roomId = [userId, targetUserId].sort().join("_")
    return crypto.createHash("sha256").update(roomId).digest("hex")
}


const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.NODE_DEV === "development" ? "http://localhost:5173" : "vikasrajput18.com",
            credentials: true
        }
    });

    io.use((socket, next) => {
        try {

            const rawCookie = socket.handshake.headers.cookie || "";
            const cookies = cookieParser.JSONCookies(
                Object.fromEntries(
                    rawCookie.split(";").map((c) => {
                        const [k, v] = c.trim().split("=");
                        return [k, decodeURIComponent(v)];
                    })
                )
            )

            const token = cookies["token"]; // match your cookie name
            if (!token) {
                return next(new Error("Authentication error: Token missing"));
            }

            // Verify JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

            // Attach user info to socket
            socket.user = decoded;
            next();
        } catch (error) {
            console.error("Socket auth error:", error.message);
            next(new Error("Authentication failed"));
        }
    })

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const hashedRoomId = getSecretRoomId(userId, targetUserId)
            socket.join(hashedRoomId)
        })
        socket.on("sendMessage", async ({ lastName, firstName, userId, targetUserId, text }) => {
            const hashedRoomId = getSecretRoomId(userId, targetUserId)

            try {

                // 🔹 Fetch the connection status (adjust this query according to your schema)
                const connection = await ConnectionRequestModel.findOne({
                    $or: [
                        { senderId: userId, receiverId: targetUserId },
                        { senderId: targetUserId, receiverId: userId },
                    ],
                });

                if (!connection || connection.status !== "accepted") {
                    console.log("❌ Message blocked: connection not accepted");
                    socket.emit("errorMessage", {
                        message: "You cannot send a message until the request is accepted.",
                    });
                    return; // ⬅ stop here
                }
                let chat = await ChatModel.findOne({
                    participants: {
                        $all: [userId, targetUserId]
                    }
                })

                if (!chat) {
                    chat = await new ChatModel({
                        participants: [userId, targetUserId],
                        messages: []
                    });
                }

                chat.messages.push({
                    senderId: userId,
                    text
                })

                await chat.save()
            } catch (error) {
                console.log(error)
            }

            io.to(hashedRoomId).emit("messageReceived", {
                firstName, newMessage: text, userId, targetUserId, lastName
            })
        })

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

module.exports = { initializeSocket }