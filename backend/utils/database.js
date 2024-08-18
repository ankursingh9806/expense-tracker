// const Sequelize = require("sequelize");

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     dialect: "mysql",
//     host: process.env.DB_HOST
// });

// module.exports = sequelize;
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Node.js application is connected to MongoDB")
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });

module.exports = mongoose;