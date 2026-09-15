import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyWebhookSignature, getAuvoraPlanFromRazorpayId } from "@/lib/razorpay";

// Use service role client for webhooks to bypass RLS restrictions safely on server
function getAdminSupabaseClient() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey);
}

export async function POST(request: Request) {
  try {
    // 1. Read RAW request body as string for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header." },
        { status: 400 }
      );
    }

    // 2. Verify webhook signature
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    // 3. Parse JSON payload AFTER signature verification
    const payload = JSON.parse(rawBody);
    const eventType = payload.event;
    const eventId = payload.account_id ? `${payload.event}_${payload.created_at}_${payload.payload?.subscription?.entity?.id}` : `evt_${payload.created_at}_${Math.random()}`;
    const actualEventId = payload.event_id || eventId;

    const supabase = getAdminSupabaseClient();
    if (!supabase) {
      console.error("Webhook processing failed: SUPABASE_SERVICE_ROLE_KEY not configured.");
      return NextResponse.json(
        { error: "Server database configuration missing." },
        { status: 500 }
      );
    }

    // 4. Idempotency Check: check if event has already been processed
    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id")
      .eq("event_id", actualEventId)
      .maybeSingle();

    if (existingEvent) {
      return NextResponse.json(
        { success: true, message: "Webhook event already processed." },
        { status: 200 }
      );
    }

    // 5. Process Razorpay Subscription Events
    const subscriptionEntity = payload.payload?.subscription?.entity;

    if (subscriptionEntity && subscriptionEntity.id) {
      const razorpaySubId = subscriptionEntity.id;
      const razorpayPlanId = subscriptionEntity.plan_id;
      const currentStart = subscriptionEntity.current_start
        ? new Date(subscriptionEntity.current_start * 1000).toISOString()
        : null;
      const currentEnd = subscriptionEntity.current_end
        ? new Date(subscriptionEntity.current_end * 1000).toISOString()
        : null;

      // Match Auvora plan from Razorpay plan ID
      const auvoraPlan = getAuvoraPlanFromRazorpayId(razorpayPlanId);

      if (
        eventType === "subscription.authenticated" ||
        eventType === "subscription.activated" ||
        eventType === "subscription.charged"
      ) {
        // Update subscription status to active
        const updatePayload: Record<string, unknown> = {
          status: "active",
          updated_at: new Date().toISOString(),
        };
        if (currentStart) updatePayload["current_period_start"] = currentStart;
        if (currentEnd) updatePayload["current_period_end"] = currentEnd;
        if (auvoraPlan) updatePayload["plan"] = auvoraPlan;

        await supabase
          .from("subscriptions")
          .update(updatePayload)
          .eq("razorpay_subscription_id", razorpaySubId);
      } else if (
        eventType === "subscription.cancelled" ||
        eventType === "subscription.completed" ||
        eventType === "subscription.halted"
      ) {
        const newStatus =
          eventType === "subscription.cancelled"
            ? "cancelled"
            : eventType === "subscription.completed"
            ? "completed"
            : "halted";

        await supabase
          .from("subscriptions")
          .update({
            status: newStatus,
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_subscription_id", razorpaySubId);
      }
    }

    // 6. Record processed webhook event for idempotency
    await supabase.from("webhook_events").insert({
      event_id: actualEventId,
      event_type: eventType || "unknown",
      payload,
    });

    return NextResponse.json(
      { success: true, message: `Webhook ${eventType} processed.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook handling error:", error);
    return NextResponse.json(
      { error: "Webhook handling failed." },
      { status: 500 }
    );
  }
}

