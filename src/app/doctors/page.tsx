import Navbar from "@/components/Navbar";
import { Star, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";

export const revalidate = 0;

export default async function DoctorsPage() {
  const supabase = await createClient();
  const { data: doctors } = await supabase.from("staff").select("*").eq("is_active", true).order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <Navbar />
      <div className="bg-white border-b border-border py-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary mb-4">
            Meet Our Specialists
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Highly qualified medical professionals dedicated to providing the
            best care for you and your family.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {doctors && doctors.length > 0 ? doctors.map((doctor, i) => (
            <div
              key={i}
              className="bg-white rounded-[5px] rounded-tl-[20px] rounded-br-[20px] border border-border overflow-hidden flex flex-col sm:flex-row hover:shadow-2xl hover:border-primary/30 hover:bg-accent/20 transition-all duration-500 group"
            >
              <div className="sm:w-48 h-64 sm:h-auto bg-muted overflow-hidden">
                {doctor.image_url ? (
                  <img
                    src={doctor.image_url}
                    alt={doctor.full_name}
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20">
                    <Users className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-2xl font-bold text-secondary">
                      {doctor.full_name}
                    </h3>
                    <p className="text-primary font-bold uppercase text-xs tracking-widest">
                      {doctor.specialty}
                    </p>
                  </div>
                  <div className="flex items-center bg-accent px-2 py-1 rounded-lg text-primary text-sm font-bold">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    5.0
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed flex-1">
                  {doctor.bio}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-bold text-secondary">
                      120+
                    </span>{" "}
                    Patient reviews
                  </div>
                  <Link
                    href={`/booking?staff=${doctor.full_name.toLowerCase().replace("dr. ", "").replace(" ", "-")}`}
                    className="text-primary font-bold flex items-center hover:translate-x-1 transition-transform"
                  >
                    Set Appointment <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No specialists available right now. Please check back later.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
