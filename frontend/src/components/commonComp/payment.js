import axiosInstance from "../../axiosInstance";

const handlePayment = async (userId, doctorId, amount) => {
  const { data } = await axiosInstance.post("/payments/create", { userId, doctorId, amount });

  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: data.amount,
    currency: "INR",
    name: "InnerGlow Consultation",
    order_id: data.id,
    handler: async function (response) {
      await axiosInstance.post("/payments/verify", { ...response, userId, doctorId });
      alert("Payment Successful! Consultation Started.");
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};