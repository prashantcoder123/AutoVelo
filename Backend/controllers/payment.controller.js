const razorpay = require('../config/razorpay');
const crypto = require("crypto");

// ✅ Create Order
exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        });

        res.json(order);
    } catch (err) {
        res.status(500).send(err);
    }
};

// ✅ Verify Payment
exports.verifyPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        rideId
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {

        // 👉 TODO: mark ride paid
        // await Ride.findByIdAndUpdate(rideId, { status: "paid" });

        res.json({ success: true });

    } else {
        res.status(400).json({ success: false });
    }
};