"use client";
import { Backdrop, Box, Typography } from "@mui/material";
import SideBar from "@/components/SideBar";
import PageTitle from "@/components/Dashboard/PageTitle";
import AccountTable from "@/components/Tables/AccountTable";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
const Account = () => {
  const { state } = useAuth();
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const docsRef = collection(db, "Payments");
        const q = query(docsRef, where("userId", "==", state.user.uid));
        const snapshot = await getDocs(q);
        if (snapshot.size === 0) {
          setPayments([]);
          setLoading(false);
          return;
        }
        let items = [];
        snapshot.docs.forEach((doc) => {
          const data = {
            key: doc.id,
            courseName: doc.data().courseName || "Chemistry Basics",
            amount: doc.data().amount,
            status: doc.data().status,
            paidAt: doc.data().paidAt,
            confirmedAt: doc.data().confirmedAt,
            receipt: doc.data().receiptUrl,
          };
          items.push(data);
        });
        setPayments(items);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Something went wrong");
        console.log(error);
      }
    };
    state && state.user && fetchContent();
  }, [state && state.user]);

  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <img src={"/loader.gif"} />
      </Backdrop>
      <Box width={"100%"}>
        <SideBar>
          <PageTitle eyebrow="Billing" title="Payments" body="Receipts you uploaded, and whether the desk has approved them." />
          {loading ? null : payments.length === 0 ? (
            <Box sx={{ bgcolor: "#fff", borderRadius: "22px", p: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0A192F" }}>No payments yet.</Typography>
              <Typography sx={{ color: "#5C6B7A", mt: 0.75 }}>
                A receipt shows up here after you submit one at checkout.
              </Typography>
            </Box>
          ) : (
            <AccountTable data={payments} />
          )}
        </SideBar>
      </Box>
    </Box>
  );
};

export default Account;
