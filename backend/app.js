require("dotenv").config();

const express = require("express");
const app = express();

const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./utils/database");
const userRoute = require("./routes/userRoute");
const expenseRoute = require("./routes/expenseRoute");
const purchaseRoute = require("./routes/purchaseRoute");
const leaderboardRoute = require("./routes/leaderboardRoute");
const resetPasswordRoute = require("./routes/resetPasswordRoute");
const reportRoute = require("./routes/reportRoute");

const User = require("./models/userModel")
const Expense = require("./models/expenseModel")
const Order = require("./models/orderModel");
const ResetPassword = require("./models/resetPasswordModel");

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user", userRoute);
app.use("/expense", expenseRoute);
app.use("/purchase", purchaseRoute);
app.use("/premium", leaderboardRoute);
app.use("/premium", reportRoute);
app.use("/password", resetPasswordRoute);
 
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "html", "login.html"));
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ResetPassword);
ResetPassword.belongsTo(User);

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