const app = require("./app")

const PORT = process.env.PORT || 8000


app.listen(PORT, () => {
    console.log(`Server is listening on PORT: http://localhost:${PORT}`)
})
