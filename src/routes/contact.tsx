import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuoteForm } from "@/components/QuoteForm";
import { SectionHeading } from "@/components/SectionHeading";
import { Mail, Instagram, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Frame It LA Photo Booths" },
      {
        name: "description",
        content:
          "Get in touch with Frame It LA to book a premium photo booth for your wedding, corporate event, or celebration in Los Angeles.",
      },
      { property: "og:title", content: "Contact — Frame It LA" },
      { property: "og:description", content: "Reach out to book your photo booth experience." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="pt-20 pb-16 px-6">
        <SectionHeading
          eyebrow="Get In Touch"
          title={<>Let's plan your <span className="text-gradient-gold italic">moment</span></>}
          subtitle="Tell us a little about your event and we'll be in touch within 24 hours."
        />
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <InfoRow
              icon={<Mail size={20} />}
              label="Email"
              value="info@frameitla.com"
              href="mailto:info@frameitla.com"
            />
            <InfoRow
              icon={<Instagram size={20} />}
              label="Instagram"
              value="@frameitla"
              href="https://www.instagram.com/frameitla"
            />
            <InfoRow
              icon={<MapPin size={20} />}
              label="Service Area"
              value="Los Angeles & Greater LA County"
            />
            <InfoRow
              icon={<Clock size={20} />}
              label="Response Time"
              value="Within 24 hours"
            />

            <div className="mt-10 p-6 rounded-2xl border border-primary/30 bg-card/40">
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">
                Limited Offer
              </div>
              <div className="font-display text-2xl">20% off your next event</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Mention this when you reach out — applies to bookings made this month.
              </p>
            </div>
          </div>

          <div className="lg:col-span-3">
            <QuoteForm variant="card" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="text-xs uppercase tracking-[0.25em] text-primary">{label}</div>
      <div className="mt-1 font-display text-lg">{value}</div>
    </>
  );
  return (
    <div className="flex gap-4 items-start p-5 rounded-2xl bg-card border border-border">
      <div className="text-primary mt-1">{icon}</div>
      <div>{href ? <a href={href} className="hover:text-primary transition">{content}</a> : content}</div>
    </div>
  );
}
