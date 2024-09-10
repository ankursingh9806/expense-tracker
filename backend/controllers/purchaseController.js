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
        // rzp.orders.create(options, (err, order) => {
        //     if (err) {
        //         throw new Error(JSON.stringify(err));
        //     }
        //     req.user
        //         .createOrder({ orderId: order.id, status: "PENDING" })
        //         .then(() => {
        //             return res.status(201).json({ order, key_id: rzp.key_id });
        //         })
        //         .catch((err) => {
        //             throw new Error(err);
        //         });
        // });
        rzp.orders.create(options, async (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            try {
                const newOrder = new Order({
                    userId: req.user._id,
                    orderId: order.id,
                    status: "PENDING",
                });
                await newOrder.save();
                return res.status(201).json({ order, key_id: rzp.key_id });
            } catch (saveErr) {
                console.log(saveErr);
                return res.status(500).json({ error: saveErr.message, message: "failed to save order" });
            }
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: "something went wrong", error: err.message });
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        // const userId = req.user.id;
        userId = req.user._id;
        const { payment_id, order_id } = req.body;
        // const order = await Order.findOne({ where: { orderId: order_id } });
        const order = await Order.findOne({ orderId: order_id });
        // const promise1 = order.update({ paymentId: payment_id, status: "SUCCESSFUL" });
        order.paymentId = payment_id;
        order.status = "SUCCESSFUL";
        await order.save();
        // const promise2 = req.user.update({ isPremiumUser: true });
        user.isPremiumUser = true;
        await user.save();
        // Promise.all([promise1, promise2]).then(() => {
        //     return res.status(202).json({
        //         success: true,
        //         message: "transaction successful",
        //         token: userController.generateAccessToken(userId, undefined, true)
        //     });
        // }).catch((error) => {
        //     throw new Error(error);
        // });
    } catch (err) {
        console.log(err);
        res.status(403).json({ error: err.message, error: "something went wrong" });
    }
};

module.exports = {
    purchasePremium,
    updateTransactionStatus
}