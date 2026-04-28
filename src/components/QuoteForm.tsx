import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone").max(30),
  email: z.string().trim().email("Invalid email").max(255),
  eventType: z.string().max(80).optional(),
  notes: z.string().max(1000).optional(),
});

type Captcha = { question: string; token: string };

export function QuoteForm({ variant = "dark" }: { variant?: "dark" | "card" }) {
  const [submitting, setSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [eventType, setEventType] = useState("");
  const [otherEventType, setOtherEventType] = useState("");

  const eventTypes = [
    "Wedding",
    "Corporate",
    "Birthday",
    "Anniversary",
    "Quinceañera",
    "Holiday Party",
    "Other",
  ];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot — bots fill this hidden field; humans don't.
    if ((fd.get("company") as string)?.length) {
      toast.success("Thanks! We'll be in touch within 24 hours.");
      form.reset();
      return;
    }

    const parsed = schema.safeParse({
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      eventType: eventType === "Other" ? otherEventType.trim() : eventType,
      notes: fd.get("notes") ?? "",
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please review the form");
      return;
    }

    if (captcha && !captchaAnswer.trim()) {
      toast.error("Please answer the verification question.");
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, unknown> = { ...parsed.data, company: "" };
      if (captcha) {
        body.captchaToken = captcha.token;
        body.captchaAnswer = captchaAnswer.trim();
      }

      const res = await fetch("/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        captchaRequired?: boolean;
        captcha?: Captcha;
      };

      if (json.captchaRequired && json.captcha) {
        setCaptcha(json.captcha);
        setCaptchaAnswer("");
        toast.error(json.error || "Please solve the verification question.");
        return;
      }

      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      toast.success("Thanks! We'll be in touch within 24 hours.");
      form.reset();
      setCaptcha(null);
      setCaptchaAnswer("");
      setEventType("");
      setOtherEventType("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const wrap =
    variant === "card"
      ? "bg-card border border-border rounded-2xl p-8 shadow-soft"
      : "bg-black/80 backdrop-blur-xl border border-primary/40 rounded-2xl p-8 shadow-gold";

  return (
    <form onSubmit={onSubmit} className={wrap}>
      <h3 className="font-display text-2xl mb-1">Request a Quote</h3>
      <p className="text-muted-foreground text-sm mb-6">
        Tell us about your event — we'll respond within 24 hours.
      </p>
      <div className="grid gap-4">
        {/* Honeypot — hidden from real users */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />
        <Input name="name" placeholder="Full Name" required />
        <Input name="phone" placeholder="Phone Number" type="tel" required />
        <Input name="email" placeholder="Email Address" type="email" required />
        <select
          name="eventType"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full bg-secondary/40 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        >
          <option value="" disabled>Event Type</option>
          {eventTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {eventType === "Other" && (
          <Input
            name="eventTypeOther"
            placeholder="Tell us about your event type"
            value={otherEventType}
            onChange={(e) => setOtherEventType(e.target.value)}
          />
        )}
        <textarea
          name="notes"
          rows={4}
          placeholder="Event details: location, date, hours, prints..."
          maxLength={1000}
          className="w-full bg-secondary/40 border border-border rounded-lg px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        />

        {captcha && (
          <div className="rounded-lg border border-primary/40 bg-secondary/40 p-4">
            <label className="block text-xs uppercase tracking-[0.2em] text-primary mb-2">
              Quick verification
            </label>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{captcha.question}</span>
              <Input
                name="captchaAnswer"
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                placeholder="Answer"
                inputMode="numeric"
                autoComplete="off"
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-gold text-primary-foreground font-semibold py-3 rounded-full hover:opacity-90 transition disabled:opacity-60 shadow-gold"
        >
          {submitting ? "Sending..." : "Request a Quote"}
        </button>
      </div>
    </form>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-secondary/40 border border-border rounded-lg px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
    />
  );
}
