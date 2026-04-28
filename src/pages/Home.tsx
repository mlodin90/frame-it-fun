import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QuoteForm } from "@/components/QuoteForm";
import { SectionHeading } from "@/components/SectionHeading";
import { Camera, Sparkles, Heart, Gift, Briefcase, PartyPopper, Star } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import boothImg from "@/assets/booth.jpg";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const occasions = [
  { icon: Heart, label: "Weddings" },
  { icon: Briefcase, label: "Corporate Events" },
  { icon: Sparkles, label: "Brand Activations" },
  { icon: Gift, label: "Birthday Parties" },
  { icon: PartyPopper, label: "Holiday Parties" },
  { icon: Camera, label: "Product Launches" },
];

export default function HomePage() {
  useDocumentMeta({
    title: "Frame It LA — Luxury Photo Booth Rentals in Los Angeles",
    description:
      "Capture every moment with Frame It LA's premium photo booths. Weddings, corporate events, birthdays & more. Book today for 20% off.",
    ogImage: heroImg,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="relative min-h-[92vh] flex items-center">
        <img
          src={heroImg}
          alt="Glamorous group enjoying a photo booth at a luxury event"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="text-center lg:text-left">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">
              Ventura · Los Angeles · Orange County — Premium Photo Booths
            </div>
            <h1 className="font-display text-5xl md:text-7xl leading-[1.05]">
              Capture Your <span className="text-gradient-gold italic">Moments</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed mx-auto lg:mx-0">
              Professional photo booth experiences crafted for unforgettable events —
              from intimate weddings to large-scale brand activations.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                to="/contact"
                className="bg-gradient-gold text-primary-foreground px-7 py-3.5 rounded-full font-semibold shadow-gold hover:opacity-90 transition"
              >
                Request a Quote
              </Link>
              <Link
                to="/gallery"
                className="border border-primary/40 text-primary px-7 py-3.5 rounded-full font-semibold hover:bg-primary/10 transition"
              >
                View Gallery
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground justify-center lg:justify-start">
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span>500+ events captured · 5-star rated</span>
            </div>
          </div>
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:justify-self-end">
            <QuoteForm />
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <SectionHeading
          eyebrow="Every Occasion"
          title={<>Built for <span className="text-gradient-gold italic">moments</span> that matter</>}
          subtitle="From elegant weddings to corporate galas, our booths blend seamlessly into any setting."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {occasions.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="group bg-card border border-border rounded-2xl p-8 hover:border-primary/60 transition-all hover:-translate-y-1 shadow-soft"
            >
              <Icon className="text-primary mb-4" size={28} />
              <div className="font-display text-xl">{label}</div>
              <div className="hairline mt-4 w-12 group-hover:w-20 transition-all" />
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 bg-card/30">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img
              src={boothImg}
              alt="Modern open-air photo booth setup with gold sequin backdrop"
              className="rounded-2xl shadow-gold w-full"
              loading="lazy"
              width={1200}
              height={900}
            />
            <div className="absolute -bottom-6 -right-6 bg-gradient-gold text-primary-foreground px-6 py-4 rounded-xl font-display text-2xl shadow-gold">
              500+ Events
            </div>
          </div>
          <div className="text-center lg:text-left">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
              Why Frame It LA
            </div>
            <h2 className="font-display text-4xl md:text-5xl">
              Where <span className="text-gradient-gold italic">elegance</span> meets entertainment
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              We design every photo booth experience to feel custom — premium props,
              designer backdrops, instant prints, and a friendly attendant who keeps
              the energy high all night long.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Open-air & enclosed booth options",
                "Custom-branded prints & overlays",
                "Instant social sharing & digital gallery",
                "Designer backdrops + premium prop kits",
                "On-site attendant included",
              ].map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="text-primary mt-1">◆</span>
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 text-primary mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={20} fill="currentColor" />
            ))}
          </div>
          <blockquote className="font-display text-3xl md:text-4xl leading-snug">
            "Frame It LA made our wedding <span className="text-gradient-gold italic">unforgettable</span>.
            The booth was beautiful and our guests couldn't stop talking about it."
          </blockquote>
          <div className="mt-6 text-sm uppercase tracking-[0.25em] text-muted-foreground">
            — Sarah J., Bride
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-gold rounded-3xl p-12 md:p-16 text-center text-primary-foreground shadow-gold">
          <h2 className="font-display text-4xl md:text-5xl">Ready to make it unforgettable?</h2>
          <p className="mt-4 opacity-90 max-w-xl mx-auto">
            Book today and enjoy 20% off your next event. Limited dates available.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-8 bg-background text-foreground px-8 py-3.5 rounded-full font-semibold hover:opacity-90 transition"
          >
            Request a Quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
