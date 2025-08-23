const { Server } = require("socket.io");
const crypto = require("crypto")


const getSecretRoomId = (userId, targetUserId) => {
    const roomId = [userId, targetUserId].sort().join("_")
    return crypto.createHash("sha256").update(roomId).digest("hex")
}


const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const hashedRoomId = getSecretRoomId(userId, targetUserId)
            socket.join(hashedRoomId)
        })
        socket.on("sendMessage", ({ firstName, userId, targetUserId, text }) => {
            const hashedRoomId = getSecretRoomId(userId, targetUserId)
            io.to(hashedRoomId).emit("messageReceived", {
                firstName, newMessage: text, userId
            })
        })

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

module.exports = { initializeSocket }