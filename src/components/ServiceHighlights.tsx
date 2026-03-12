import { Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export default async function ServiceHighlights() {
  const supabase = await createClient();
  const { data: services } = await supabase.from("services").select("*").eq("is_active", true).limit(6).order("created_at", { ascending: false });

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Our Medical Specialties
            </h2>
            <p className="text-muted-foreground text-lg">
              We provide wide range of medical services with the latest
              technology and top doctors.
            </p>
          </div>
          <Link
            href="/services"
            className="mt-4 md:mt-0 text-primary font-bold hover:underline flex items-center"
          >
            View All Services
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services && services.length > 0 ? services.map((service, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[5px] rounded-tl-[20px] rounded-br-[20px] border border-border hover:border-primary/50 hover:bg-accent/30 transition-all hover:shadow-xl group flex flex-col"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform overflow-hidden ${!service.image_url ? 'bg-primary/20 text-primary' : ''}`}
              >
                {service.image_url ? (
                  <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                ) : (
                  <Activity className="w-8 h-8" />
                )}
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">
                {service.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                {service.description}
              </p>
              <div className="mt-auto">
                <Link
                  href={`/booking?service=${service.name.toLowerCase()}`}
                  className="text-primary font-bold hover:text-secondary group-hover:underline flex items-center"
                >
                  Book Session <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          )) : (
             <div className="col-span-full py-10 text-center text-muted-foreground">
              Check back soon for our updated services list.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
