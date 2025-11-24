import axios from 'axios'
import React, { createContext, useContext, useState } from 'react'
import { authDataContext } from './AuthContext'
import { userDataContext } from './UserContext'
import { listingDataContext } from './ListingContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
export const bookingDataContext= createContext()
function BookingContext({children}) {
    let [checkIn,setCheckIn]=useState("")
    let [checkOut,setCheckOut]=useState("")
    let [total,setTotal]=useState(0)
    let [night,setNight]=useState(0)
    let {serverUrl} = useContext(authDataContext)
    let {getCurrentUser} = useContext(userDataContext)
    let {getListing} = useContext(listingDataContext)
    let [bookingData,setBookingData]= useState([])
    let [booking,setbooking]= useState(false)
    let navigate = useNavigate()

const handleBooking = async (id) => {
  setbooking(true);
  try {
    // 1️⃣ Create booking in your backend
    let result = await axios.post(
      serverUrl + `/api/booking/create/${id}`,
      {
        checkIn,
        checkOut,
        totalRent: total
      },
      { withCredentials: true }
    );

    await getCurrentUser();
    await getListing();
    setBookingData(result.data);

    // 2️⃣ Create Razorpay order (update port to your backend port)
    const order = await axios.post(
     "https://two-airbnb-backend-wrgi.onrender.com" ,
      { amount: total },
      { withCredentials: false }
    );

    // 3️⃣ Razorpay payment popup
    const options = {
      key: "rzp_test_RiNISf6gmoFraX", // 🔴 use your test key here
      amount: order.data.amount,
      currency: "INR",
      name: "Your Airbnb App",
      description: "Booking Payment",
      order_id: order.data.id,

      handler: async function (response) {
        // 4️⃣ Verify payment
        const verify = await axios.post(
         "https://two-airbnb-backend-wrgi.onrender.com" ,
          {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,

          }
        );

        if (verify.data.success) {
          toast.success("Payment Successful!");
          navigate("/booked");
        } else {
          toast.error("Payment Verification Failed!");
        }
      },

      theme: { color: "#3399cc" }
    };

    const razor = new window.Razorpay(options);
    razor.open();

    setbooking(false);
  } catch (error) {
    console.log(error);
    setBookingData(null);
    toast.error(error.response?.data?.message);
    setbooking(false);
  }
};

    const cancelBooking = async (id) => {
        try {
            let result = await axios.delete( serverUrl + `/api/booking/cancel/${id}`,{withCredentials:true})
        await getCurrentUser()
        await getListing()
        console.log(result.data)
        toast.success("CancelBooking Successfully")

            
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
        
    }

    let value={
        checkIn,setCheckIn,
        checkOut,setCheckOut,
        total,setTotal,
        night,setNight,
        bookingData,setBookingData,
        handleBooking,cancelBooking,booking,setbooking

    }
  return (
    <div>
      <bookingDataContext.Provider value={value}>
        {children}
      </bookingDataContext.Provider>
    </div>
  )
}

export default BookingContext
