import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ServiceHighlights from "../components/ServiceHighlights";
import Link from "next/link";
import { Calendar, Users, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ServiceHighlights />

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="bg-primary-light aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                  alt="Medical professional with patient"
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary/30 to-transparent" />
              </div>

              {/* Floating stats card */}
              <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-[5px] rounded-tl-[20px] rounded-br-[20px] shadow-xl border border-border hidden sm:block">
                <div className="flex items-center space-x-4">
                  <div className="bg-secondary p-3 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">
                      4.9/5.0
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Patient Satisfaction
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
                Why Patients Trust Appointmently
              </h2>
              <div className="space-y-8">
                {[
                  {
                    icon: Calendar,
                    title: "Easy Scheduling",
                    desc: "Book your medical appointments in under 60 seconds with our intuitive interface.",
                  },
                  {
                    icon: Users,
                    title: "Expert Specialists",
                    desc: "Accessible network of pre-vetted, highly qualified doctors across all specialties.",
                  },
                  {
                    icon: Star,
                    title: "Personalized Care",
                    desc: "Digital health records and personalized follow-ups for a continuous care experience.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-secondary mb-2">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link
                  href="/doctors"
                  className="inline-flex items-center space-x-2 text-primary font-bold hover:translate-x-1 transition-transform"
                >
                  <span>Meet our specialists</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 flex flex-wrap pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <Calendar key={i} className="w-32 h-32 m-8" />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              Ready to Book Your Next Visit?
            </h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Join thousands of patients who have simplified their healthcare
              journey with Appointmently.
            </p>
            <Link
              href="/signup"
              className="bg-white text-primary px-10 py-4 rounded-full text-lg font-bold hover:bg-gray-100 transition-all shadow-lg inline-block"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:flex md:justify-between md:text-left">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <Link
                href="/"
                className="relative w-12 h-12 overflow-hidden rounded-xl border border-primary/10 shadow-sm hover:scale-105 transition-transform"
              >
                <img
                  src="/brand-logo.png"
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </Link>
            </div>
            <p className="text-muted-foreground max-w-xs mx-auto md:mx-0">
              Modern healthcare appointment booking platform for patients and
              specialists.
            </p>
          </div>

          <div className="flex justify-center space-x-12">
            <div>
              <h4 className="font-bold text-secondary mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/services">Services</Link>
                </li>
                <li>
                  <Link href="/doctors">Doctors</Link>
                </li>
                <li>
                  <Link href="/booking">Booking</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-secondary mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/privacy">Privacy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border text-center text-muted-foreground">
          © {new Date().getFullYear()} Appointmently Group. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
