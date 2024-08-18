// const Sequelize = require("sequelize");
// const sequelize = require("../utils/database");

// const User = sequelize.define("User", {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     },
//     name: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull: false
//     },
//     isPremiumUser: {
//         type: Sequelize.BOOLEAN,
//         defaultValue: false
//     },
//     totalExpenses: {
//         type: Sequelize.INTEGER,
//         defaultValue: 0
//     },
// });

// module.exports = User;
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isPremiumUser: {
        type: Boolean,
        default: false,
    },
    totalExpenses: {
        type: Number,
        default: 0,
    },
});
const User = mongoose.model("User", userSchema);

module.exports = User;