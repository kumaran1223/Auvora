import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRazorpayClient, getRazorpayPlanId } from "@/lib/razorpay";

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
    const { plan } = body;

    if (plan !== "pro" && plan !== "business") {
      return NextResponse.json(
        { error: "Invalid subscription plan requested." },
        { status: 400 }
      );
    }

    const razorpay = getRazorpayClient();
    const razorpayPlanId = getRazorpayPlanId(plan);

    if (!razorpay || !razorpayPlanId) {
      return NextResponse.json(
        {
          error:
            "Razorpay Test Mode configuration is incomplete. Please configure RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and Plan IDs.",
        },
        { status: 500 }
      );
    }

    // Check if user already has an active or created subscription
    const { data: existingSub } = await supabase
      .from("subscriptions")
      .select("id, status, plan, razorpay_subscription_id")
      .eq("user_id", user.id)
      .in("status", ["active", "authenticated", "created"])
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (existingSub) {
      if (existingSub.status === "active" || existingSub.status === "authenticated") {
        return NextResponse.json(
          {
            error: `You already have an active ${existingSub.plan.toUpperCase()} subscription.`,
            existingSubscription: true,
          },
          { status: 409 }
        );
      }

      // If existing subscription is in 'created' state for the same requested plan, reuse it
      if (existingSub.status === "created" && existingSub.plan === plan) {
        return NextResponse.json(
          {
            success: true,
            subscriptionId: existingSub.razorpay_subscription_id,
            keyId:
              process.env["NEXT_PUBLIC_RAZORPAY_KEY_ID"] ||
              process.env["RAZORPAY_KEY_ID"] ||
              "",
            plan: existingSub.plan,
            reused: true,
          },
          { status: 200 }
        );
      }
    }

    // Create subscription on Razorpay (Test Mode)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = await (razorpay.subscriptions as any).create({
      plan_id: razorpayPlanId,
      total_count: 12,
      quantity: 1,
      customer_notify: 1,
      notes: {
        user_id: user.id,
        auvora_plan: plan,
      },
    });

    // Save initial subscription record in public.subscriptions
    const { error: dbError } = await supabase.from("subscriptions").insert({
      user_id: user.id,
      plan,
      razorpay_subscription_id: subscription.id,
      razorpay_plan_id: razorpayPlanId,
      status: "created",
    });

    if (dbError) {
      console.error("Failed to insert subscription record:", dbError);
      return NextResponse.json(
        { error: "Failed to persist subscription initialization." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        subscriptionId: subscription.id,
        keyId:
          process.env["NEXT_PUBLIC_RAZORPAY_KEY_ID"] ||
          process.env["RAZORPAY_KEY_ID"] ||
          "",
        plan,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Create subscription error:", error);
    return NextResponse.json(
      { error: "Unable to create subscription. Please try again." },
      { status: 500 }
    );
  }
}
