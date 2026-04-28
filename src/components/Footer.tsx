import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24 bg-card/40">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-display text-2xl text-gradient-gold mb-3">Frame It LA</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Professional photo booth services for weddings, corporate events, and
            celebrations across Ventura, Los Angeles, and Orange County.
          </p>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Connect</h4>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/frameitla" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-primary mb-4">Contact</h4>
          <a href="mailto:info@frameitla.com" className="text-muted-foreground hover:text-primary transition text-sm">
            info@frameitla.com
          </a>
          <div className="mt-4">
            <Link to="/contact" className="inline-flex bg-gradient-gold text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold">
              Request a Quote
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Frame It LA. All rights reserved.
      </div>
    </footer>
  );
}
