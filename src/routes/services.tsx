import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { Camera, Heart, Briefcase, Gift, Sparkles, PartyPopper, Cake, Baby } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Frame It LA Photo Booths" },
      {
        name: "description",
        content:
          "Photo booth services for weddings, corporate events, brand activations, birthdays, baby showers and more in Los Angeles.",
      },
      { property: "og:title", content: "Services — Frame It LA" },
      { property: "og:description", content: "Photo booth packages for every occasion." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Heart,
    title: "Weddings",
    description: "Elegant booths designed to complement your big day with custom backdrops and printed keepsakes.",
  },
  {
    icon: Briefcase,
    title: "Corporate Events",
    description: "Branded photo experiences that elevate galas, conferences, and team celebrations.",
  },
  {
    icon: Sparkles,
    title: "Brand Activations",
    description: "Turn-key booths with logo overlays and custom data capture for marketing events.",
  },
  {
    icon: PartyPopper,
    title: "Holiday Parties",
    description: "Festive setups, themed props, and seasonal backdrops that bring the holiday spirit.",
  },
  {
    icon: Gift,
    title: "Birthdays & Sweet 16s",
    description: "High-energy booths with luxe lighting designed for unforgettable celebrations.",
  },
  {
    icon: Baby,
    title: "Baby Showers & Reveals",
    description: "Soft-styled booths perfect for showers, gender reveals, and milestone moments.",
  },
  {
    icon: Cake,
    title: "School & Public Events",
    description: "Crowd-friendly setups, fast prints, and an attendant who keeps the line moving.",
  },
  {
    icon: Camera,
    title: "Product Launches",
    description: "Editorial-grade booths and digital sharing tools to amplify launch-day buzz.",
  },
];

const packages = [
  {
    name: "Essentials",
    price: "$695",
    duration: "2 hours",
    features: ["Open-air booth", "Premium prop kit", "Unlimited prints", "On-site attendant", "Digital gallery"],
  },
  {
    name: "Signature",
    price: "$1,095",
    duration: "4 hours",
    featured: true,
    features: [
      "Everything in Essentials",
      "Custom-branded prints",
      "Designer backdrop selection",
      "Instant social sharing",
      "USB of all photos",
    ],
  },
  {
    name: "Luxe",
    price: "$1,895",
    duration: "6 hours",
    features: [
      "Everything in Signature",
      "GIF & boomerang capture",
      "Premium sequin backdrop",
      "Scrapbook with guest signatures",
      "Two attendants",
    ],
  },
];

function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="pt-20 pb-16 px-6">
        <SectionHeading
          eyebrow="Our Services"
          title={<>Photo booth experiences for <span className="text-gradient-gold italic">every</span> event</>}
          subtitle="Every booking includes premium equipment, an experienced attendant, and on-brand design."
        />
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map(({ icon: Icon, title, description }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition shadow-soft">
              <Icon className="text-primary mb-4" size={26} />
              <h3 className="font-display text-xl mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24 bg-card/30">
        <SectionHeading
          eyebrow="Packages"
          title={<>Transparent <span className="text-gradient-gold italic">pricing</span></>}
          subtitle="Choose a package that fits your event — every option can be customized further."
        />
        <div className="mt-14 max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {packages.map((p) => (
            <div
              key={p.name}
              className={
                p.featured
                  ? "relative bg-gradient-gold text-primary-foreground rounded-3xl p-8 shadow-gold"
                  : "bg-card border border-border rounded-3xl p-8 shadow-soft"
              }
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-primary text-xs uppercase tracking-[0.25em] px-4 py-1 rounded-full border border-primary/40">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-2xl">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-5xl">{p.price}</span>
                <span className={p.featured ? "opacity-80" : "text-muted-foreground"}>/ {p.duration}</span>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span>◆</span>
                    <span className={p.featured ? "" : "text-muted-foreground"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={
                  p.featured
                    ? "mt-8 inline-flex w-full justify-center bg-background text-foreground px-6 py-3 rounded-full font-semibold hover:opacity-90"
                    : "mt-8 inline-flex w-full justify-center bg-gradient-gold text-primary-foreground px-6 py-3 rounded-full font-semibold shadow-gold"
                }
              >
                Book {p.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
