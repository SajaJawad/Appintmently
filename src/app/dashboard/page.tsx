"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  User,
  Plus,
  AlertCircle,
  Loader2,
} from "lucide-react";

type Appointment = {
  id: string;
  start_time: string;
  status: string;
  services: { name: string; duration_minutes: number };
  staff: { full_name: string; specialty: string };
};

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata.full_name || "Patient");
        const { data } = await supabase
          .from("appointments")
          .select(
            `
            id, start_time, status,
            services(name, duration_minutes),
            staff(full_name, specialty)
          `,
          )
          .eq("user_id", user.id)
          .order("start_time", { ascending: true });

        setAppointments((data as any) || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-30">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-secondary">
              Hello, {userName}
            </h1>
            <p className="text-muted-foreground">
              Manage your health and upcoming visits.
            </p>
          </div>
          <Link
            href="/booking"
            className="mt-4 md:mt-0 bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-primary-dark transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>New Appointment</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-secondary flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Upcoming Appointments
            </h2>

            {appointments.length === 0 ? (
              <div className="bg-white p-12 rounded-[5px] rounded-tl-[20px] rounded-br-[20px] border-2 border-dashed border-border text-center">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-secondary mb-2">
                  No Appointments Yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Schedule your first visit with one of our specialists.
                </p>
                <Link
                  href="/booking"
                  className="text-primary font-bold hover:underline"
                >
                  Book Your First Visit →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white p-6 rounded-[5px] rounded-tl-[20px] rounded-br-[20px] border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <div className="bg-accent p-3 rounded-xl text-primary font-bold text-center min-w-[64px]">
                        <div className="text-xs uppercase">
                          {new Date(apt.start_time).toLocaleDateString(
                            "en-US",
                            { month: "short" },
                          )}
                        </div>
                        <div className="text-xl">
                          {new Date(apt.start_time).getDate()}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-secondary text-lg">
                          {apt.services?.name || "Service"}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <User className="w-3.5 h-3.5 mr-1" />{" "}
                          {apt.staff?.full_name || "Specialist"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center text-secondary font-semibold mb-2">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        {new Date(apt.start_time).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          apt.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Health Tips/Stats */}
          <div className="space-y-6">
            <div className="bg-primary text-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-6">Patient Overview</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="opacity-70">Total Visits</span>
                  <span className="text-2xl font-bold">
                    {appointments.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-70">Specialists Seen</span>
                  <span className="text-2xl font-bold">
                    {
                      new Set(
                        appointments
                          .map((a) => a.staff?.full_name)
                          .filter(Boolean),
                      ).size
                    }
                  </span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-white/10 rounded-[5px] rounded-tl-[20px] rounded-br-[20px] border border-white/20">
                <div className="flex items-center space-x-3 mb-2 text-primary-light">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-bold">Health Tip</span>
                </div>
                <p className="text-sm opacity-80 leading-relaxed">
                  Stay hydrated and maintain a regular exercise routine for
                  optimal heart health.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[5px] rounded-tl-[20px] rounded-br-[20px] border border-border">
              <h3 className="font-bold text-secondary mb-4">Quick Shortcuts</h3>
              <div className="grid grid-cols-2 gap-3 pb-4">
                <Link
                  href="/profile"
                  className="p-3 bg-muted rounded-xl text-center text-sm font-semibold hover:bg-muted/80 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/services"
                  className="p-3 bg-muted rounded-xl text-center text-sm font-semibold hover:bg-muted/80 transition-colors"
                >
                  Services
                </Link>
                <Link
                  href="/history"
                  className="p-3 bg-muted rounded-xl text-center text-sm font-semibold hover:bg-muted/80 transition-colors"
                >
                  History
                </Link>
                <Link
                  href="/support"
                  className="p-3 bg-muted rounded-xl text-center text-sm font-semibold hover:bg-muted/80 transition-colors"
                >
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
