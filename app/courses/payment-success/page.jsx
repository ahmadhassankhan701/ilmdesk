"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const storePayment = async () => {
      const responseCode = searchParams.get("pp_ResponseCode");
      const txnRef = searchParams.get("pp_TxnRefNo");
      const amount = searchParams.get("pp_Amount");
      const txnDateTime = searchParams.get("pp_TxnDateTime");
      const message = searchParams.get("pp_ResponseMessage");

      if (responseCode === "000") {
        setStatus("Storing payment and redirecting...");

        // const res = await fetch("/api/payment/save", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     txnRef,
        //     amount: parseInt(amount) / 100,
        //     txnDateTime,
        //     message,
        //   }),
        // });

        // if (res.ok) {
        //   router.push("/dashboard");
        // } else {
        //   setStatus("Payment saved failed. Contact support.");
        // }
      } else {
        setStatus("Payment failed or cancelled.");
      }
    };

    storePayment();
  }, [searchParams]);

  return (
    <Box textAlign="center" mt={10}>
      <CircularProgress />
      <Typography variant="h6" mt={2}>
        {status}
      </Typography>
    </Box>
  );
}
