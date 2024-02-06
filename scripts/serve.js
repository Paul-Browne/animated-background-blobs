// Simple localhost

import express from 'express'
import compression from 'compression'

const app = express()
app.use(compression())

app.use("/", express.static("docs", {
    maxAge: 1000 * 1,
    extensions: ["html"]
}))

app.listen(3333, () => console.log("http://localhost:3333"))