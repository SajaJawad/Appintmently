"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  Calendar,
  Clock,
  ChevronRight,
  Stethoscope,
  User,
  CheckCircle,
  Loader2,
} from "lucide-react";

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
};
type Staff = {
  id: string;
  full_name: string;
  specialty: string;
  image_url: string;
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: srv } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true);
      const { data: stf } = await supabase
        .from("staff")
        .select("*")
        .eq("is_active", true);
      setServices(srv || []);
      setStaffList(stf || []);
      setFetching(false);
    }
    fetchData();
  }, []);

  const handleBooking = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Ensure profile exists before booking using upsert (atomic operation)
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name || "User",
      email: user.email,
      // We don't set the role here, it's handled by the DB trigger or set manually
    }, { onConflict: 'id' });

    if (profileError && profileError.code !== 'PGRST116') {
      console.error("Profile upsert error:", profileError);
      // We only alert if it's not a generic error that might be ignored
      if (!profileError.message.includes("RLS")) {
         alert("Profile issue: " + profileError.message);
      }
    }

    const { error } = await supabase.from("appointments").insert({
      user_id: user.id,
      service_id: selectedService?.id,
      staff_id: selectedStaff?.id,
      start_time: `${selectedDate}T${selectedSlot}:00Z`,
      end_time: `${selectedDate}T${selectedSlot}:00Z`, // Simplified for now
      status: "pending",
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard?booked=true");
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 mt-12">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 -z-10" />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s
                  ? "bg-primary text-white scale-110 shadow-lg"
                  : "bg-white border-2 border-border text-muted-foreground"
              }`}
            >
              {step > s ? <CheckCircle className="w-6 h-6" /> : s}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[5px] rounded-tl-[20px] rounded-br-[20px] shadow-xl border border-border overflow-hidden">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-secondary mb-6">
                Select a Service
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service);
                      setStep(2);
                    }}
                    className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-md ${
                      selectedService?.id === service.id
                        ? "border-primary bg-accent/50"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-secondary">
                        {service.name}
                      </h3>
                      <span className="text-primary font-bold">
                        ${service.price}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration_minutes} mins
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Specialist */}
          {step === 2 && (
            <div className="p-8">
              <div
                className="flex items-center space-x-2 text-primary font-bold mb-4 cursor-pointer hover:underline"
                onClick={() => setStep(1)}
              >
                <span>← Back to services</span>
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-6">
                Choose a Specialist
              </h2>
              <div className="space-y-4">
                {staffList.map((staff) => (
                  <button
                    key={staff.id}
                    onClick={() => {
                      setSelectedStaff(staff);
                      setStep(3);
                    }}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center space-x-4 transition-all text-left ${
                      selectedStaff?.id === staff.id
                        ? "border-primary bg-accent/50"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden">
                      <img
                        src={
                          staff.image_url ||
                          `https://ui-avatars.com/api/?name=${staff.full_name}`
                        }
                        alt={staff.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-secondary">
                        {staff.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {staff.specialty}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="p-8">
              <div
                className="flex items-center space-x-2 text-primary font-bold mb-4 cursor-pointer hover:underline"
                onClick={() => setStep(2)}
              >
                <span>← Back to specialists</span>
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-6">
                Select Date & Time
              </h2>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-3">
                    Available Dates (Upcoming 7 Days)
                  </label>
                  <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                    {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                      const date = new Date();
                      date.setDate(date.getDate() + offset);
                      const dateStr = date.toISOString().split("T")[0];
                      return (
                        <div
                          key={dateStr}
                          onClick={() => !loading && setSelectedDate(dateStr)}
                          className={`flex flex-col items-center justify-center p-4 min-w-[100px] cursor-pointer transition-all ${
                            selectedDate === dateStr
                              ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105 rounded-xl"
                              : "bg-white border border-border hover:border-primary/50 text-secondary hover:bg-accent rounded-xl"
                          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <span className="text-xs uppercase opacity-80">
                            {date.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </span>
                          <span className="text-lg font-bold">
                            {date.getDate()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-semibold text-secondary mb-3">
                      Available Slots
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {[
                        "09:00",
                        "10:00",
                        "11:00",
                        "13:00",
                        "14:00",
                        "15:00",
                        "16:00",
                      ].map((time) => (
                        <div
                          key={time}
                          onClick={() => !loading && setSelectedSlot(time)}
                          className={`py-4 px-6 text-center cursor-pointer transition-all border font-bold ${
                            selectedSlot === time
                              ? "bg-primary text-white border-primary shadow-md scale-[1.02] rounded-xl"
                              : "bg-white border-border text-secondary hover:bg-accent hover:border-primary/30 rounded-xl"
                          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  disabled={!selectedSlot || loading}
                  onClick={handleBooking}
                  className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <span>Confirm Appointment</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar (Mobile) */}
        {selectedService && (
          <div className="mt-8 bg-secondary text-white p-6 rounded-2xl shadow-xl">
            <h3 className="font-bold border-b border-white/10 pb-3 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" /> Booking Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="opacity-70">Service:</span>
                <span className="font-semibold">{selectedService.name}</span>
              </div>
              {selectedStaff && (
                <div className="flex justify-between">
                  <span className="opacity-70">Specialist:</span>
                  <span className="font-semibold">
                    {selectedStaff.full_name}
                  </span>
                </div>
              )}
              {selectedDate && (
                <div className="flex justify-between">
                  <span className="opacity-70">Date:</span>
                  <span className="font-semibold">{selectedDate}</span>
                </div>
              )}
              {selectedSlot && (
                <div className="flex justify-between">
                  <span className="opacity-70">Time:</span>
                  <span className="font-semibold text-primary-light">
                    {selectedSlot}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-white/10 pt-3 mt-3 text-lg font-bold">
                <span>Total:</span>
                <span>${selectedService.price}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
