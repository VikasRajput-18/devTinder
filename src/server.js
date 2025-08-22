const app = require("./app")

const { createServer } = require("http");
const { initializeSocket } = require("./utils/socket");

const httpServer = createServer(app);

initializeSocket(httpServer)


const PORT = process.env.PORT || 8000


httpServer.listen(PORT, () => {
    console.log(`Server is listening on PORT: http://localhost:${PORT}`)
})
