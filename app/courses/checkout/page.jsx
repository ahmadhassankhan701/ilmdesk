"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { CloudUploadOutlined } from "@mui/icons-material";
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import { db, storage } from "@/firebase";
import { useAuth } from "@/context/AuthContext";
import { accent, accentHover, ink, muted, primary, primaryHover } from "@/lib/brand";
import { pageBackground, pageColumnSx } from "@/lib/pageColumn";
import { prepareReceipt, UploadPrepError } from "@/lib/prepareUpload";
import { authSearch, isBrandAdminUid, isOwnerEmail, ROLES } from "@/lib/roles";
import PageTrail from "@/components/PageTrail";

const ACCOUNTS = [
  ["JazzCash", "+92 308 6403836"],
  ["Easypaisa", "+92 308 6403836"],
  ["Allied Bank", "02370010087574630015"],
];

function priceLabel(value) {
  const amount = Number(value);
  if (value === undefined || value === null || value === "" || amount === 0) return "Free";
  return `Rs ${value}`;
}

function isDeskAdmin(user) {
  if (!user) return false;
  return user.role === ROLES.owner || isOwnerEmail(user.email) || isBrandAdminUid(user.uid);
}

function CheckoutPage() {
  const { state, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("id");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const redirected = useRef(false);
  const user = state?.user;
  const userId = user?.uid;
  const userName = user?.name;

  const leave = (message, href) => {
    if (redirected.current) return;
    redirected.current = true;
    toast.info(message);
    router.replace(href);
  };

  useEffect(() => {
    if (!ready) return undefined;
    if (!user) {
      if (redirected.current) return undefined;
      redirected.current = true;
      router.replace(`/auth${authSearch({ redirectTo: "/courses/checkout", courseId: courseId || "" })}`);
      return undefined;
    }
    if (isDeskAdmin(user)) {
      leave("Checkout is for students. Opening the dashboard.", "/dashboard");
      return undefined;
    }
    if (!courseId) {
      setLoading(false);
      setCourse(null);
      return undefined;
    }

    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setFailed(false);
        const [courseSnap, payments] = await Promise.all([
          getDoc(doc(db, "courses", courseId)),
          getDocs(query(collection(db, "Payments"), where("courseId", "==", courseId), where("userId", "==", userId))),
        ]);
        if (ignore || redirected.current) return;
        const courseData = courseSnap.exists() ? courseSnap.data() : null;
        const students = Array.isArray(courseData?.students) ? courseData.students : [];
        const enrolled = students.includes(userId) || payments.docs.some((item) => item.data().status === "approved");
        if (enrolled) {
          leave("You are already enrolled in this course.", "/dashboard/courses");
          return;
        }
        if (payments.docs.some((item) => item.data().status === "pending")) {
          leave("Your receipt is with the desk. The dashboard is open. This course opens after the receipt is confirmed.", "/dashboard");
          return;
        }
        setCourse(courseSnap.exists() ? { id: courseSnap.id, ...courseData } : null);
      } catch (error) {
        console.error(error);
        if (!ignore && !redirected.current) {
          setFailed(true);
          toast.error("Could not open checkout.");
        }
      } finally {
        if (!ignore && !redirected.current) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [ready, user, userId, courseId, router]);

  const uploadReceipt = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !course) return;
    try {
      setSending(true);
      const ready = await prepareReceipt(file);
      const storageRef = ref(storage, `Payments/${courseId}/${userId}`);
      await uploadBytes(storageRef, ready, { contentType: ready.type });
      const receiptUrl = await getDownloadURL(storageRef);
      await addDoc(collection(db, "Payments"), {
        userId,
        userName: userName || "",
        courseId,
        courseName: course.title || "",
        amount: course.price || 0,
        status: "pending",
        receiptUrl,
        paidAt: new Date(),
        confirmedAt: new Date(),
      });
      setSent(true);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof UploadPrepError ? error.message : "The receipt could not be sent.");
    } finally {
      setSending(false);
    }
  };

  const title = course?.title || "Checkout";

  return (
    <Box sx={{ bgcolor: pageBackground, color: ink, pt: { xs: "96px", md: "112px" }, pb: { xs: 8, md: 12 } }}>
      <Box sx={pageColumnSx}>
        <Box
          sx={{
            borderRadius: { xs: "24px", md: "32px" },
            background: "linear-gradient(145deg, #0A192F 0%, #071322 55%, #123044 100%)",
            px: { xs: 3, sm: 4.5, md: 6 },
            py: { xs: 5, md: 7 },
          }}
        >
          <Typography
            component="p"
            sx={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.16)",
              borderRadius: 999,
              px: 1.5,
              py: 0.4,
              fontSize: 12,
              letterSpacing: 0.6,
              mb: 2.5,
              width: "fit-content",
            }}
          >
            Checkout
          </Typography>
          <Typography component="h1" sx={{ color: "#fff", fontWeight: 700, letterSpacing: -1.2, lineHeight: 1.05, fontSize: { xs: 36, sm: 48, md: 60 }, maxWidth: 760 }}>
            {loading ? "Checkout" : title}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: 17, lineHeight: 1.65, maxWidth: 560, mt: 2.5 }}>
            {course ? `Pay ${priceLabel(course.price)}, then upload the receipt. The desk confirms the enrolment.` : "Pay the account below, then upload the receipt."}
          </Typography>
          <PageTrail onDark items={[{ label: "Home", href: "/" }, { label: "Courses", href: "/courses" }, { label: loading ? "Checkout" : title }]} />
        </Box>

        {!ready || loading ? (
          <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" }, gap: 1.5 }}>
            <Skeleton variant="rounded" height={320} sx={{ borderRadius: "22px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
            <Skeleton variant="rounded" height={320} sx={{ borderRadius: "22px", bgcolor: "rgba(10, 25, 47, 0.08)" }} />
          </Box>
        ) : failed ? (
          <Notice title="Checkout could not be opened" body="Refresh the page and try again." />
        ) : !course ? (
          <Notice title="This course is not listed" body="Go back to the course list and choose another." />
        ) : sent ? (
          <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 }, maxWidth: 720 }}>
            <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>Receipt received</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 28, letterSpacing: -0.5, mt: 0.6 }}>The desk will confirm this payment.</Typography>
            <Typography sx={{ color: muted, mt: 1.5, lineHeight: 1.65, maxWidth: 560 }}>
              Once {title} is confirmed, its lessons open for you. The dashboard is available now. This course stays closed until then.
            </Typography>
            <Typography component={Link} href="/dashboard" sx={{ display: "inline-block", color: primary, fontWeight: 600, mt: 2, textDecoration: "none", "&:hover": { color: primaryHover } }}>
              Go to dashboard
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 3, display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.2fr) minmax(260px, 0.8fr)" }, gap: 1.5, alignItems: "start" }}>
            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2.5, md: 3 } }}>
              <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>Pay to</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 28, letterSpacing: -0.5, mt: 0.6 }}>Muhammad Qasim</Typography>
              <Typography sx={{ color: muted, mt: 1, lineHeight: 1.6 }}>
                Send {priceLabel(course.price)} from JazzCash, Easypaisa, or Allied Bank, then upload a photo or PDF of the receipt.
              </Typography>
              <Box sx={{ display: "grid", mt: 2 }}>
                {ACCOUNTS.map(([name, value]) => (
                  <Box key={name} sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 1.25, borderTop: "1px solid #E2E8EC" }}>
                    <Typography sx={{ fontWeight: 700 }}>{name}</Typography>
                    <Typography sx={{ color: muted, textAlign: "right" }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "22px", p: { xs: 2.5, md: 3 } }}>
              <Typography sx={{ color: primary, fontSize: 13, fontWeight: 700, letterSpacing: 1.1, textTransform: "uppercase" }}>Amount</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 36, letterSpacing: -0.8, lineHeight: 1.1, mt: 0.5 }}>{priceLabel(course.price)}</Typography>
              <Button
                component="label"
                variant="contained"
                disabled={sending}
                startIcon={<CloudUploadOutlined />}
                sx={{
                  mt: 2.5,
                  width: "100%",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 999,
                  py: 1.15,
                  bgcolor: accent,
                  boxShadow: "none",
                  "&:hover": { bgcolor: accentHover, boxShadow: "none" },
                }}
              >
                {sending ? "Uploading" : "Upload receipt"}
                <input hidden type="file" accept="image/png,image/jpeg,image/jpg,image/avif,application/pdf" onChange={uploadReceipt} />
              </Button>
              <Typography sx={{ color: muted, fontSize: 13, mt: 1.25, lineHeight: 1.5 }}>Photos are resized and compressed. A PDF receipt must be under 2MB.</Typography>
              <Box sx={{ display: "grid", gap: 1, mt: 2.5 }}>
                {["Pay with JazzCash", "Pay with Easypaisa", "Bank transfer"].map((label) => (
                  <Button
                    key={label}
                    disabled
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 999,
                      py: 1,
                      borderColor: "#E2E8EC",
                      color: muted,
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </Box>
              <Typography sx={{ color: muted, fontSize: 13, mt: 1.25 }}>These payments are not open yet.</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function Notice({ title, body }) {
  return (
    <Box sx={{ mt: 3, bgcolor: "#fff", border: "1px solid #E2E8EC", borderRadius: "24px", p: { xs: 3, md: 4 } }}>
      <Typography sx={{ fontWeight: 700, fontSize: 22 }}>{title}</Typography>
      <Typography sx={{ color: muted, mt: 1 }}>{body}</Typography>
      <Typography component={Link} href="/courses" sx={{ display: "inline-block", color: primary, fontWeight: 600, mt: 1.5, textDecoration: "none", "&:hover": { color: primaryHover } }}>
        Back to courses
      </Typography>
    </Box>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Box sx={{ bgcolor: pageBackground, minHeight: "50vh" }} />}>
      <CheckoutPage />
    </Suspense>
  );
}
