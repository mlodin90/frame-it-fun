import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Frame It LA Photo Booth Events" },
      {
        name: "description",
        content:
          "Browse photos from Frame It LA's recent weddings, corporate events, birthdays and brand activations.",
      },
      { property: "og:title", content: "Gallery — Frame It LA" },
      { property: "og:description", content: "Recent photo booth events from Frame It LA." },
      { property: "og:image", content: g1 },
    ],
  }),
  component: GalleryPage,
});

const photos = [
  { src: g1, alt: "Wedding couple posing in photo booth" },
  { src: g2, alt: "Corporate event group photo" },
  { src: g3, alt: "Birthday party with sparklers" },
  { src: g4, alt: "Glamorous birthday celebration" },
  { src: g5, alt: "Baby shower booth setup" },
  { src: g6, alt: "Holiday photo booth fun" },
];

function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="pt-20 pb-12 px-6">
        <SectionHeading
          eyebrow="Recent Events"
          title={<>The <span className="text-gradient-gold italic">moments</span> we've captured</>}
          subtitle="A glimpse into the events we've helped make unforgettable."
        />
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {photos.map((p, i) => (
            <div
              key={i}
              className="mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-border shadow-soft group"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                width={1024}
                height={1024}
                className="w-full h-auto group-hover:scale-105 transition duration-700"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl">Want to be next?</h2>
          <p className="mt-4 text-muted-foreground">
            Lock in your date and let's create something unforgettable.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-8 bg-gradient-gold text-primary-foreground px-8 py-3.5 rounded-full font-semibold shadow-gold hover:opacity-90"
          >
            Request a Quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
