"use client";
import { Backdrop, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import SideBar from "@/components/SideBar";
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
          setLoading(false);
          toast.error("No data found");
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
          <Grid container spacing={1} mb={2}>
            <Grid>
              <Typography
                sx={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: "#A6A6A6",
                }}
              >
                Account
              </Typography>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: "800",
                  color: "#A0AAB4",
                }}
              >
                Your Statistics
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={1}>
            <AccountTable data={payments} />
          </Grid>
        </SideBar>
      </Box>
    </Box>
  );
};

export default Account;
