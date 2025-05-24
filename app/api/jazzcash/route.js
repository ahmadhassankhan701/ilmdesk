import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  const body = await req.json();
  const { amount, email, phone } = body;

  const MERCHANT_ID = process.env.JAZZCASH_MERCHANT_ID;
  const PASSWORD = process.env.JAZZCASH_PASSWORD;
  const INTEGRITY_SALT = process.env.JAZZCASH_INTEGRITY_SALT;
  const RETURN_URL = process.env.JAZZCASH_RETURN_URL;

  const txnRef = "T" + Date.now();
  const txnDateTime = new Date()
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const expiryDateTime = new Date(Date.now() + 30 * 60 * 1000)
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);

  const payload = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: MERCHANT_ID,
    pp_Password: PASSWORD,
    pp_TxnRefNo: txnRef,
    pp_Amount: `${parseInt(amount) * 100}`, // JazzCash uses paisa
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: txnDateTime,
    pp_BillReference: "LMSCourse",
    pp_Description: "Course Purchase",
    pp_TxnExpiryDateTime: expiryDateTime,
    pp_ReturnURL: RETURN_URL,
    pp_SecureHash: "", // will be added later
    ppmpf_1: email || "",
    ppmpf_2: phone || "",
  };

  // Prepare hash string
  const sortedKeys = Object.keys(payload).sort();
  const hashString =
    INTEGRITY_SALT + "&" + sortedKeys.map((key) => payload[key]).join("&");
  const hash = crypto
    .createHash("sha256")
    .update(hashString)
    .digest("hex")
    .toUpperCase();

  payload.pp_SecureHash = hash;

  return NextResponse.json({
    paymentData: payload,
    paymentURL:
      "https://ecommerce.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform",
  });
}
