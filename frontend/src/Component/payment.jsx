import React from "react";

const Payment = () => {

  const handlePayment = async () => {
    const amount = 500; // ₹500 example

    // 1️⃣ Create Order on Backend
    const order = await fetch("https://two-airbnb-backend-wrgi.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    }).then(res => res.json());

    // 2️⃣ Open Razorpay Popup
    const options = {
      key: "rzp_test_RiNISf6gmoFraX",
      amount: order.amount,
      currency: "INR",
      name: "Pramod Sisodiya",
      description: "Rent for accomodation",
      order_id: order.id,
      handler: async function (response) {
        // 3️⃣ Verify Payment
        const verify = await fetch("https://two-airbnb-backend-wrgi.onrender.com",{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        }).then(res => res.json());

        if (verify.success) {
          alert("Payment Successful!");
        } else {
          alert("Payment Verification Failed!");
        }
      },
      theme: { color: "#3399cc" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <button onClick={handlePayment} style={{ padding: "10px 20px", background: "blue", color: "white" }}>
      Pay Now
    </button>
  );
};

export default Payment;
