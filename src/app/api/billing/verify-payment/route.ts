import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyPaymentSignature, getRazorpayClient } from "@/lib/razorpay";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

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

    // 1. Verify HMAC SHA256 signature
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

    // 2. Verify ownership of subscription record in database
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

    // 3. Optional: fetch current period bounds from Razorpay SDK if available
    const razorpay = getRazorpayClient();
    let currentStartISO: string | null = null;
    let currentEndISO: string | null = null;

    if (razorpay) {
      try {
        const razorpaySub = await razorpay.subscriptions.fetch(
          razorpay_subscription_id
        );
        if (razorpaySub?.current_start) {
          currentStartISO = new Date(razorpaySub.current_start * 1000).toISOString();
        }
        if (razorpaySub?.current_end) {
          currentEndISO = new Date(razorpaySub.current_end * 1000).toISOString();
        }
      } catch (err) {
        console.warn("Razorpay SDK fetch warning during verification:", err);
      }
    }

    const updateData: Record<string, unknown> = {
      status: "active",
      updated_at: new Date().toISOString(),
    };
    if (currentStartISO) updateData["current_period_start"] = currentStartISO;
    if (currentEndISO) updateData["current_period_end"] = currentEndISO;

    const adminClient = getAdminSupabaseClient();
    if (!adminClient) {
      return NextResponse.json(
        { error: "Server database configuration missing." },
        { status: 500 }
      );
    }

    // 4. Update status to 'active' (database trigger & entitlement module sync plan)
    const { error: updateError } = await adminClient
      .from("subscriptions")
      .update(updateData)
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
        message: "Payment verified successfully. Plan activated.",
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
