require("dotenv").config();

const express = require("express");
const app = express();

const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/database");
const userRoute = require("./routes/userRoute");
const expenseRoute = require("./routes/expenseRoute");

const User = require("./models/userModel")
const Expense = require("./models/expenseModel")

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRoute);
app.use("/expense", expenseRoute);

User.hasMany(Expense);
Expense.belongsTo(User);

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