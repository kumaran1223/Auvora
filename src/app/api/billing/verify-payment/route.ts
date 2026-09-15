import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthenticated. Please log in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = body;

    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification fields." },
        { status: 400 }
      );
    }

    // Verify HMAC SHA256 signature
    const isValid = verifyPaymentSignature({
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // Verify ownership of subscription record
    const { data: subRecord, error: subError } = await supabase
      .from("subscriptions")
      .select("id, user_id, plan")
      .eq("razorpay_subscription_id", razorpay_subscription_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (subError || !subRecord) {
      return NextResponse.json(
        { error: "Subscription record not found or unauthorized." },
        { status: 404 }
      );
    }

    // Update status to 'active' (database trigger handles profile.plan sync)
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", subRecord.id);

    if (updateError) {
      console.error("Failed to update subscription status to active:", updateError);
      return NextResponse.json(
        { error: "Failed to activate subscription in database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully. Plan updated.",
        plan: subRecord.plan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify payment error:", error);
    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 500 }
    );
  }
}

