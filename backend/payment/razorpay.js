const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: "YOUR_RAZORPAY_KEY",
  key_secret: "YOUR_RAZORPAY_SECRET"
});

// Payment create API
exports.createPayment = async (req, res) => {
    const { userId, doctorId, amount } = req.body;

    const options = {
        amount: amount * 100, // Razorpay needs amount in paise
        currency: "INR",
        receipt: `consult_${userId}_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Payment initiation failed" });
    }
};

// Payment verification API
exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, doctorId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", "YOUR_RAZORPAY_SECRET")
        .update(body)
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // Payment successful - Update DB
        await Consult.updateOne(
            { userId, doctorId, paymentStatus: "pending" },
            { $set: { paymentStatus: "completed" } }
        );
        res.status(200).json({ message: "Payment successful" });
    } else {
        res.status(400).json({ message: "Payment verification failed" });
    }
};
