// const Sequelize = require("sequelize");
// const sequelize = require("../utils/database");

// const ResetPassword = sequelize.define("resetpassword", {
//     id: {
//         type: Sequelize.UUID,
//         defaultValue: Sequelize.UUIDV4,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: {
//         type: Sequelize.BOOLEAN,
//     },
// });

// module.exports = ResetPassword;

const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});
const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);

module.exports = ResetPassword;