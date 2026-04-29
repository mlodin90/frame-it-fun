// Public edge function: receives quote form submissions and emails them to the business owner.
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TO_EMAIL = "info@frameitla.com";
// NOTE: Switch this to "Frame It LA <quotes@notify.frameitla.com>" once
// frameitla.com (or notify.frameitla.com) is verified at https://resend.com/domains
const FROM_EMAIL = "Frame It LA Quotes <onboarding@resend.dev>";

interface QuotePayload {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  eventType?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  company?: string; // honeypot
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function row(label: string, value?: string) {
  if (!value) return "";
  return `<tr><td style="padding:8px 12px;background:#f7f7f7;font-weight:600;width:160px;">${label}</td><td style="padding:8px 12px;">${escapeHtml(value)}</td></tr>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY not set");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as QuotePayload;

    // Honeypot — silently accept and drop bot submissions
    if (body.company && body.company.length > 0) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!body.name || !body.email || !body.phone) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;">
        <h2 style="color:#b8860b;">New Quote Request</h2>
        <table style="border-collapse:collapse;width:100%;border:1px solid #eee;">
          ${row("Name", body.name)}
          ${row("Phone", body.phone)}
          ${row("Email", body.email)}
          ${row("Event Type", body.eventType)}
          ${row("Event Date", body.eventDate)}
          ${row("Start Time", body.startTime)}
          ${row("End Time", body.endTime)}
          ${row("Location", body.location)}
          ${row("Notes", body.notes)}
        </table>
        <p style="margin-top:20px;color:#666;font-size:12px;">Sent from frameitla.com quote form</p>
      </div>
    `;

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      replyTo: body.email,
      subject: `New Quote Request — ${body.name}${body.eventType ? ` (${body.eventType})` : ""}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-quote error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
