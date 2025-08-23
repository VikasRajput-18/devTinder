const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");


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