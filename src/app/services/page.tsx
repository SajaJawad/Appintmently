import Navbar from "@/components/Navbar";
import { Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-muted/30 pb-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-100 md:h-180 overflow-hidden">
        <img
          src="/services-hero.png"
          alt="Our Medical Services"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="inline-flex items-center bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            World-Class Healthcare
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
            Our Medical Services
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl font-medium drop-shadow">
            World-class healthcare tailored to your needs. Explore our range of
            specialized medical services.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services && services.length > 0 ? (
            services.map((service, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-[5px] rounded-tl-[20px] rounded-br-[20px] border border-border hover:border-primary transition-all hover:shadow-xl group flex flex-col"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden ${!service.image_url ? "bg-primary/10 text-primary" : ""}`}
                >
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Activity className="w-8 h-8" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-3">
                  {service.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                  {service.description}
                </p>

                <div className="flex items-center justify-between border-t border-border pt-6 mt-auto">
                  <div>
                    <div className="text-primary font-bold text-xl">
                      ${service.price}
                    </div>
                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      {service.duration_minutes} mins
                    </div>
                  </div>
                  <Link
                    href={`/booking?service=${service.name.toLowerCase()}`}
                    className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary transition-colors flex items-center"
                  >
                    Book Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No services available right now. Check back soon.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
