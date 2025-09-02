const express = require('express');
const path = require("node:path");


const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


const router = require('./routes/userRouter');
app.use('/', router);
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`You are running on port ${PORT}`));