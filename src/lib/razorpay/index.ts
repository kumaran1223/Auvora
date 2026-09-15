import crypto from "crypto";
import Razorpay from "razorpay";

export function getRazorpayClient(): Razorpay | null {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];

  if (!keyId || !keySecret) {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export function getRazorpayPlanId(plan: "pro" | "business"): string | null {
  if (plan === "pro") {
    return process.env["RAZORPAY_PRO_PLAN_ID"] || null;
  }
  if (plan === "business") {
    return process.env["RAZORPAY_BUSINESS_PLAN_ID"] || null;
  }
  return null;
}

export function getAuvoraPlanFromRazorpayId(
  razorpayPlanId: string
): "pro" | "business" | null {
  const proId = process.env["RAZORPAY_PRO_PLAN_ID"];
  const bizId = process.env["RAZORPAY_BUSINESS_PLAN_ID"];

  if (proId && razorpayPlanId === proId) {
    return "pro";
  }
  if (bizId && razorpayPlanId === bizId) {
    return "business";
  }

  return null;
}

export function verifyPaymentSignature(params: {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}): boolean {
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keySecret) return false;

  const payload = `${params.razorpay_payment_id}|${params.razorpay_subscription_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(params.razorpay_signature, "utf-8")
    );
  } catch {
    return false;
  }
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string
): boolean {
  const webhookSecret = process.env["RAZORPAY_WEBHOOK_SECRET"];
  if (!webhookSecret || !signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signature, "utf-8")
    );
  } catch {
    return false;
  }
}

