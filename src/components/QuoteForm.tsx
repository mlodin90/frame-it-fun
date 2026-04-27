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

export function QuoteForm({ variant = "dark" }: { variant?: "dark" | "card" }) {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      eventType: fd.get("eventType") ?? "",
      notes: fd.get("notes") ?? "",
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please review the form");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success("Thanks! We'll be in touch within 24 hours.");
    (e.target as HTMLFormElement).reset();
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
        <Input name="name" placeholder="Full Name" required />
        <Input name="phone" placeholder="Phone Number" type="tel" required />
        <Input name="email" placeholder="Email Address" type="email" required />
        <Input name="eventType" placeholder="Event Type (Wedding, Corporate, etc.)" />
        <textarea
          name="notes"
          rows={4}
          placeholder="Event details: location, date, hours, prints..."
          maxLength={1000}
          className="w-full bg-secondary/40 border border-border rounded-lg px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
        />
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
