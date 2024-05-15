const Razorpay = require("razorpay");
const Order = require("../models/orderModel");
const userController = require("./userController");

const purchasePremium = async (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        const options = {
            amount: 200,
            currency: "INR",
        };
        rzp.orders.create(options, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            req.user
                .createOrder({ orderId: order.id, status: "PENDING" })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch((err) => {
                    throw new Error(err);
                });
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "something went wrong", error: err.message });
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        const UserId = req.user.id;
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderId: order_id } });
        const promise1 = order.update({ paymentId: payment_id, status: "SUCCESSFUL" });
        const promise2 = req.user.update({ isPremiumUser: true });
        Promise.all([promise1, promise2]).then(() => {
            return res.status(202).json({
                success: true,
                message: "transaction successful",
                token: userController.generateAccessToken(UserId, undefined, true)
            });
        }).catch((error) => {
            throw new Error(error);
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err.message, message: "something went wrong" });
    }
};

module.exports = {
    purchasePremium,
    updateTransactionStatus
}