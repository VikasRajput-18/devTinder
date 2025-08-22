const { Server } = require("socket.io");


const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173/",
            credentials: true
        }
    })

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("joinChat", () => { })
        socket.on("sendMessage", () => { })

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

module.exports = { initializeSocket }