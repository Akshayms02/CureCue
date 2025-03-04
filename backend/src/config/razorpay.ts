import Razorpay from "razorpay";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string || "rzp_test_7PE24PnF4GNlR0",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "iv9QLiJw3LulPaAAdrpLkGtq",
});

export default razorpay;
 