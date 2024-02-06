// Simple localhost

import express from 'express'
import compression from 'compression'

const app = express()
app.use(compression())

app.use("/", express.static("demo"))

app.listen(3333, () => console.log("http://localhost:3333"))