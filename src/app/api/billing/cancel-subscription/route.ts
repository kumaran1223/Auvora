import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRazorpayClient } from "@/lib/razorpay";
import { getAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST() {
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

    const { data: activeSub } = await supabase
      .from("subscriptions")
      .select("id, razorpay_subscription_id, plan")
      .eq("user_id", user.id)
      .in("status", ["active", "authenticated"])
      .maybeSingle();

    if (!activeSub) {
      return NextResponse.json(
        { error: "No active paid subscription found to cancel." },
        { status: 404 }
      );
    }

    const razorpay = getRazorpayClient();
    if (razorpay) {
      try {
        // Cancel subscription at period end (cancel_at_cycle_end: 1)
        await razorpay.subscriptions.cancel(
          activeSub.razorpay_subscription_id,
          1
        );
      } catch (err) {
        console.warn("Razorpay SDK cancel warning:", err);
      }
    }

    const adminClient = getAdminSupabaseClient();
    if (!adminClient) {
      return NextResponse.json(
        { error: "Server database configuration missing." },
        { status: 500 }
      );
    }

    // Update local database record
    await adminClient
      .from("subscriptions")
      .update({
        cancel_at_period_end: true,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", activeSub.id);

    return NextResponse.json(
      {
        success: true,
        message: "Your subscription will remain active until the end of the current billing cycle.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Cancel subscription error:", error);
    return NextResponse.json(
      { error: "Failed to process cancellation request." },
      { status: 500 }
    );
  }
}
