require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { file: "a" })
app.use(morgan("combined", { stream: accessLogStream }));

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "https://checkout.razorpay.com"],
            styleSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
            frameSrc: ["'self'", "https://api.razorpay.com"],
            connectSrc: ["'self'", "https://lumberjack-cx.razorpay.com"]
        }
    }
}));

app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

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
    // .sync({ force: true })
    .sync()
    .then(() => {
        app.listen(3000, () => {
            console.log("Node.js application is connected to MySQL");
            console.log("Server is running on port 3000");
        });
    })
    .catch((err) => {
        console.error("Error connecting to MySQL:", err);
    });