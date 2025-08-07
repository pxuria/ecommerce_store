"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import Failed from "@/components/payment/Failed";
import Success from "@/components/payment/Success";

const Payment = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  useEffect(() => {
    if (!authority || !status) return;

    const verifyPayment = async () => {
      try {
        const { data } = await axiosInstance.post(`payment/verify`, {
          authority,
          status,
          orderId,
        });

        console.log("Payment verification response:", data);

        // if (data.success) {
        //   alert("Payment successful! Order created.");
        //   router.push("/orders"); // Redirect to orders page
        // } else {
        //   alert("Payment failed: " + data.message);
        //   router.push("/cart"); // Redirect back to cart
        // }
      } catch (error) {
        console.error("Payment verification failed:", error);
      }
    };

    verifyPayment();
  }, [authority, status, orderId]);

  return status === "OK" ? <Success /> : <Failed />;
};

export default Payment;
