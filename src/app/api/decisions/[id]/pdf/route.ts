import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDecisionById, getDecisionReport, parseDecisionReportData } from "@/lib/db/decisions";
import { getUserUsageSummary } from "@/lib/entitlements";
import PDFDocument from "pdfkit";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: decisionId } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

    const decision = await getDecisionById(decisionId);
    if (!decision || decision.user_id !== user.id) {
      return NextResponse.json({ error: "Decision not found." }, { status: 404 });
    }

    const usage = await getUserUsageSummary(user.id);
    if (usage.plan === "free" && !usage.isUnlimited) {
      return NextResponse.json({ error: "PDF reports are available on Pro and Business plans." }, { status: 403 });
    }

    const rawReport = await getDecisionReport(decisionId);
    if (!rawReport) return NextResponse.json({ error: "Decision report not found." }, { status: 404 });

    const report = parseDecisionReportData(rawReport);
    if (!report) return NextResponse.json({ error: "Failed to parse report data." }, { status: 500 });

    const pdfBuffer = await generatePdf(decision, report);
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"auvora-decision-report.pdf\"",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("[PDF Generation Error]", error);
    return NextResponse.json({ error: "Unable to generate the PDF. Please try again later." }, { status: 500 });
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
async function generatePdf(decision: any, report: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      doc.fontSize(24).font("Helvetica-Bold").text("Auvora Decision Stress-Test", { align: "center" });
      doc.moveDown(0.5);
      doc.fontSize(12).font("Helvetica").fillColor("gray").text("Think it through. Before reality does.", { align: "center" });
      doc.moveDown(2);

      doc.fontSize(18).font("Helvetica-Bold").fillColor("black").text("Decision Details");
      doc.moveDown(0.5);
      doc.fontSize(12).font("Helvetica-Bold").text("Title: ", { continued: true }).font("Helvetica").text(decision.title || "Not provided.");
      doc.font("Helvetica-Bold").text("Created: ", { continued: true }).font("Helvetica").text(new Date(decision.created_at).toLocaleDateString());
      if (decision.description) {
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").text("Description:");
        doc.font("Helvetica").text(decision.description);
      }
      doc.moveDown(2);

      const addSection = (title: string, content: string | undefined | null) => {
        doc.fontSize(14).font("Helvetica-Bold").text(title);
        doc.moveDown(0.5);
        doc.fontSize(11).font("Helvetica").text(content || "Not provided.");
        doc.moveDown(1.5);
      };

      addSection("1. Decision Overview", report.summary?.overview);
      
      doc.fontSize(14).font("Helvetica-Bold").text("2. Assumption Risk Map"); doc.moveDown(0.5);
      if (Array.isArray(report.assumptions) && report.assumptions.length > 0) {
        report.assumptions.forEach((a: any, _i: number) => {
          doc.fontSize(11).font("Helvetica-Bold").text(`${_i + 1}. ${a.statement || "Not provided."}`);
          doc.font("Helvetica").text(`Impact: ${a.impact || "N/A"} | Classification: ${a.classification || "N/A"}`);
          if (a.why_it_matters) doc.font("Helvetica").text(`Why it matters: ${a.why_it_matters}`);
          if (a.verification_action) doc.font("Helvetica").text(`Action: ${a.verification_action}`);
          doc.moveDown(0.5);
        });
      } else { doc.fontSize(11).font("Helvetica").text("Not provided."); }
      doc.moveDown(1.5);

      doc.fontSize(14).font("Helvetica-Bold").text("3. Evidence Gaps"); doc.moveDown(0.5);
      if (Array.isArray(report.evidence_gaps) && report.evidence_gaps.length > 0) {
        report.evidence_gaps.forEach((eg: any, _i: number) => {
          doc.fontSize(11).font("Helvetica-Bold").text(`${_i + 1}. ${eg.question || "Not provided."}`);
          doc.font("Helvetica").text(`Impact: ${eg.decision_impact || "N/A"}`);
          if (eg.why_it_matters) doc.font("Helvetica").text(`Why it matters: ${eg.why_it_matters}`);
          if (eg.recommended_verification) doc.font("Helvetica").text(`Action: ${eg.recommended_verification}`);
          doc.moveDown(0.5);
        });
      } else { doc.fontSize(11).font("Helvetica").text("Not provided."); }
      doc.moveDown(1.5);

      doc.fontSize(14).font("Helvetica-Bold").text("4. Blind Spots"); doc.moveDown(0.5);
      if (Array.isArray(report.blind_spots) && report.blind_spots.length > 0) {
        report.blind_spots.forEach((bs: any, _i: number) => {
          doc.fontSize(11).font("Helvetica-Bold").text(`${_i + 1}. ${bs.title || "Not provided."}`);
          doc.font("Helvetica").text(`Severity: ${bs.severity || "N/A"}`);
          if (bs.explanation) doc.font("Helvetica").text(`Explanation: ${bs.explanation}`);
          if (bs.why_it_may_be_overlooked) doc.font("Helvetica").text(`Why it's overlooked: ${bs.why_it_may_be_overlooked}`);
          if (bs.what_to_check) doc.font("Helvetica").text(`What to check: ${bs.what_to_check}`);
          doc.moveDown(0.5);
        });
      } else { doc.fontSize(11).font("Helvetica").text("Not provided."); }
      doc.moveDown(1.5);

      doc.fontSize(14).font("Helvetica-Bold").text("5. Stakeholder Analysis"); doc.moveDown(0.5);
      if (Array.isArray(report.stakeholders) && report.stakeholders.length > 0) {
        report.stakeholders.forEach((s: any, _i: number) => {
          doc.fontSize(11).font("Helvetica-Bold").text(`${_i + 1}. ${s.name || "Not provided."} (${s.role || "N/A"})`);
          doc.font("Helvetica").text(`Influence: ${s.influence || "N/A"} | Concern: ${s.concern || "N/A"}`);
          if (s.likely_reaction) doc.font("Helvetica").text(`Reaction: ${s.likely_reaction}`);
          if (s.mitigation) doc.font("Helvetica").text(`Mitigation: ${s.mitigation}`);
          doc.moveDown(0.5);
        });
      } else { doc.fontSize(11).font("Helvetica").text("Not provided."); }
      doc.moveDown(1.5);

      doc.addPage();
      doc.fontSize(14).font("Helvetica-Bold").text("6. Risk Analysis"); doc.moveDown(0.5);
      if (Array.isArray(report.risks) && report.risks.length > 0) {
        report.risks.forEach((r: any, _i: number) => {
          doc.fontSize(11).font("Helvetica-Bold").text(`${_i + 1}. ${r.title || "Not provided."}`);
          doc.font("Helvetica").text(`Severity: ${r.severity || "N/A"} | Likelihood: ${r.likelihood || "N/A"} | Impact: ${r.impact || "N/A"}`);
          if (r.description) doc.font("Helvetica").text(`Description: ${r.description}`);
          if (r.mitigation) doc.font("Helvetica").text(`Mitigation: ${r.mitigation}`);
          doc.moveDown(0.5);
        });
      } else { doc.fontSize(11).font("Helvetica").text("Not provided."); }
      doc.moveDown(1.5);

      doc.fontSize(14).font("Helvetica-Bold").text("7. Second-Order Consequences"); doc.moveDown(0.5);
      if (Array.isArray(report.consequences) && report.consequences.length > 0) {
        report.consequences.forEach((c: any, _i: number) => {
          doc.fontSize(11).font("Helvetica-Bold").text(`${_i + 1}. Trigger: ${c.trigger || "Not provided."}`);
          if (c.immediate_effect) doc.font("Helvetica").text(`-> 1st Order: ${c.immediate_effect}`);
          if (c.second_order_effect) doc.font("Helvetica").text(`-> 2nd Order: ${c.second_order_effect}`);
          if (c.potential_third_order_effect) doc.font("Helvetica").text(`-> 3rd Order: ${c.potential_third_order_effect}`);
          if (c.strategic_implication) doc.font("Helvetica").text(`Strategic Implication: ${c.strategic_implication}`);
          doc.moveDown(0.5);
        });
      } else { doc.fontSize(11).font("Helvetica").text("Not provided."); }
      doc.moveDown(1.5);

      doc.fontSize(14).font("Helvetica-Bold").text("8. Scenarios"); doc.moveDown(0.5);
      if (Array.isArray(report.scenarios) && report.scenarios.length > 0) {
        report.scenarios.forEach((sc: any, _i: number) => {
          doc.fontSize(11).font("Helvetica-Bold").text(`${sc.type ? sc.type.toUpperCase() : "SCENARIO"}: ${sc.title || "Not provided."}`);
          doc.font("Helvetica").text(`Probability: ${sc.probability ?? "N/A"}%`);
          if (sc.description) doc.font("Helvetica").text(sc.description);
          if (sc.impact) doc.font("Helvetica").text(`Impact: ${sc.impact}`);
          if (Array.isArray(sc.triggers) && sc.triggers.length > 0) doc.font("Helvetica").text(`Triggers: ${sc.triggers.join(", ")}`);
          if (Array.isArray(sc.early_signals) && sc.early_signals.length > 0) doc.font("Helvetica").text(`Early Signals: ${sc.early_signals.join(", ")}`);
          if (sc.response) doc.font("Helvetica").text(`Response: ${sc.response}`);
          doc.moveDown(0.5);
        });
      } else { doc.fontSize(11).font("Helvetica").text("Not provided."); }
      doc.moveDown(1.5);

      doc.fontSize(14).font("Helvetica-Bold").text("9. Alternative Paths"); doc.moveDown(0.5);
      if (Array.isArray(report.alternatives) && report.alternatives.length > 0) {
        report.alternatives.forEach((alt: any, _i: number) => {
          doc.fontSize(11).font("Helvetica-Bold").text(`${_i + 1}. ${alt.title || "Not provided."}`);
          doc.font("Helvetica").text(`Risk Level: ${alt.risk_level || "N/A"}`);
          if (alt.description) doc.font("Helvetica").text(alt.description);
          if (alt.advantages && alt.advantages.length > 0) doc.font("Helvetica").text(`Pros: ${alt.advantages.join(", ")}`);
          if (alt.disadvantages && alt.disadvantages.length > 0) doc.font("Helvetica").text(`Cons: ${alt.disadvantages.join(", ")}`);
          if (alt.when_to_choose) doc.font("Helvetica").text(`When to choose: ${alt.when_to_choose}`);
          doc.moveDown(0.5);
        });
      } else { doc.fontSize(11).font("Helvetica").text("Not provided."); }
      doc.moveDown(1.5);

      doc.addPage();
      doc.fontSize(14).font("Helvetica-Bold").text("10. Kill Questions"); doc.moveDown(0.5);
      if (Array.isArray(report.kill_questions) && report.kill_questions.length > 0) {
        report.kill_questions.forEach((kq: any, _i: number) => {
          doc.fontSize(11).font("Helvetica").text(`${_i + 1}. ${kq}`);
          doc.moveDown(0.5);
        });
      } else { doc.fontSize(11).font("Helvetica").text("Not provided."); }
      doc.moveDown(1.5);

      doc.fontSize(14).font("Helvetica-Bold").text("11. Final Stress Test"); doc.moveDown(0.5);
      const fst = report.final_stress_test;
      if (fst) {
        doc.fontSize(11).font("Helvetica-Bold").text(`Recommendation: ${fst.recommendation || "N/A"}`);
        doc.font("Helvetica").text(`Overall Risk: ${fst.overall_risk || "N/A"} | Decision Strength: ${fst.decision_strength || "N/A"} | Confidence: ${fst.confidence ?? "N/A"}%`);
        doc.moveDown(0.5);
        doc.font("Helvetica-Bold").text("Reasoning:");
        doc.font("Helvetica").text(fst.reasoning || "Not provided.");
        doc.moveDown(1);
        doc.font("Helvetica-Bold").text("Key Highlights:");
        doc.font("Helvetica").text(`Biggest Assumption: ${fst.biggest_assumption || "N/A"}`);
        doc.font("Helvetica").text(`Biggest Evidence Gap: ${fst.biggest_evidence_gap || "N/A"}`);
        doc.font("Helvetica").text(`Biggest Blind Spot: ${fst.biggest_blind_spot || "N/A"}`);
        doc.font("Helvetica").text(`Decision Trigger: ${fst.decision_trigger || "N/A"}`);
        doc.moveDown(1);
        if (Array.isArray(fst.top_3_actions_before_commitment) && fst.top_3_actions_before_commitment.length > 0) {
          doc.font("Helvetica-Bold").text("Top 3 Actions Before Commitment:");
          fst.top_3_actions_before_commitment.forEach((act: string, _i: number) => {
            doc.font("Helvetica").text(`${_i + 1}. ${act}`);
          });
        }
      } else { doc.fontSize(11).font("Helvetica").text("Not provided."); }

      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(9).font("Helvetica").fillColor("gray").text(
          `Page ${i + 1} of ${range.count}`,
          50,
          doc.page.height - 50,
          { align: "center" }
        );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}








