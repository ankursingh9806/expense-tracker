// const Sequelize = require("sequelize");
// const sequelize = require("../utils/database");

// const Order = sequelize.define("Order", {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true,
//     },
//     paymentId: {
//         type: Sequelize.STRING,
//     },
//     orderId: {
//         type: Sequelize.STRING,
//     },
//     status: {
//         type: Sequelize.STRING,
//     },
// });

// module.exports = Order;
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    paymentId: {
        type: String,
        required: false,
    },
    orderId: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;