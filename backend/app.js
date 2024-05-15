require("dotenv").config();

const express = require("express");
const app = express();

const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/database");
const userRoute = require("./routes/userRoute");

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRoute);

sequelize
    //.sync({ force: true })
    .sync()
    .then((result) => {
        app.listen(3000);
        console.log("server is synced with database");
    })
    .catch((err) => {
        console.error("server is unable to unable to sync with database:", err);
    });