import { ArrowRight, CheckCircle, ShieldCheck, Clock } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-image.png"
          alt="Modern Healthcare"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r lg:from-white/70 lg:via-white/5 lg:to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
        <div className="text-center md:text-left max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-secondary leading-[1.1] mb-8 animate-in fade-in slide-in-from-left-8 duration-700">
            Modern Healthcare <br />
            <span className="text-primary italic">Simplified</span> for You
          </h1>

          <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-left-10 duration-700">
            Experience seamless medical appointment booking with top
            specialists. Instant confirmation, zero waiting rooms, and
            personalized care journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Link
              href="/booking"
              className="w-full sm:w-auto bg-primary text-white px-10 py-5 rounded-3xl text-lg font-bold hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Book Appointment Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto bg-white border-2 border-primary/20 text-secondary px-10 py-5 rounded-3xl text-lg font-bold hover:bg-accent transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Explore Services
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center md:justify-start gap-x-12 gap-y-6 animate-in fade-in duration-1000 delay-300">
            {[
              { icon: Clock, text: "24/7 Online Booking" },
              { icon: CheckCircle, text: "Verified Specialists" },
              { icon: ShieldCheck, text: "Secure Records" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 text-secondary/80 font-bold"
              >
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="text-sm uppercase tracking-wide">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-muted/30 to-transparent pointer-events-none" />
    </section>
  );
}
