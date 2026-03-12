"use client";

import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase-browser";
import Navbar from "@/components/Navbar";
import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  Plus,
  MoreVertical,
  ChevronRight,
  Loader2,
  DollarSign,
  X,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { addStaff, deleteStaff, addService, deleteService } from "./actions";

type Stats = {
  totalAppointments: number;
  totalRevenue: number;
  activeStaff: number;
  upcomingToday: number;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "staff" | "services"
  >("dashboard");
  const [stats, setStats] = useState<Stats>({
    totalAppointments: 0,
    totalRevenue: 0,
    activeStaff: 0,
    upcomingToday: 0,
  });

  const [staffList, setStaffList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [appointmentsList, setAppointmentsList] = useState<any[]>([]);

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const supabase = createClient();

  const fetchData = async () => {
    const { count: aptCount, data: aptData } = await supabase
      .from("appointments")
      .select("*, profiles:user_id(full_name, email), services:service_id(name), staff:staff_id(full_name)", { count: "exact" })
      .order("created_at", { ascending: false });

    const { data: staffData } = await supabase
      .from("staff")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: servicesData } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    setStats({
      totalAppointments: aptCount || 0,
      totalRevenue: (aptCount || 0) * 150, // Placeholder
      activeStaff: staffData?.length || 0,
      upcomingToday: Math.floor((aptCount || 0) * 0.2), // Placeholder
    });

    setStaffList(staffData || []);
    setServicesList(servicesData || []);
    setAppointmentsList(aptData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await addStaff(formData);
        setIsStaffModalOpen(false);
        fetchData();
      } catch (err: any) {
        alert(err.message || "Failed to add doctor");
      }
    });
  };

  const handleDeleteStaff = (id: string) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;
    startTransition(async () => {
      try {
        await deleteStaff(id);
        fetchData();
      } catch (err: any) {
        alert(err.message || "Failed to delete doctor");
      }
    });
  };

  const handleAddService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await addService(formData);
        setIsServiceModalOpen(false);
        fetchData();
      } catch (err: any) {
        alert(err.message || "Failed to add service");
      }
    });
  };

  const handleDeleteService = (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    startTransition(async () => {
      try {
        await deleteService(id);
        fetchData();
      } catch (err: any) {
        alert(err.message || "Failed to delete service");
      }
    });
  };

  if (loading && staffList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28">
        {/* Header & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-secondary">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your clinic's operations easily.
            </p>
          </div>
          <div className="flex bg-white rounded-xl p-1 border border-border shadow-sm">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                activeTab === "dashboard"
                  ? "bg-primary text-white shadow-sm"
                  : "text-secondary hover:bg-muted"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                activeTab === "staff"
                  ? "bg-primary text-white shadow-sm"
                  : "text-secondary hover:bg-muted"
              }`}
            >
              Doctors
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                activeTab === "services"
                  ? "bg-primary text-white shadow-sm"
                  : "text-secondary hover:bg-muted"
              }`}
            >
              Services
            </button>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  label: "Total Bookings",
                  value: stats.totalAppointments,
                  icon: Calendar,
                  trend: "+12%",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Active Doctors",
                  value: stats.activeStaff,
                  icon: Users,
                  trend: "+1",
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  label: "Upcoming Today",
                  value: stats.upcomingToday,
                  icon: Activity,
                  trend: "0%",
                  color: "text-orange-600",
                  bg: "bg-orange-50",
                },
                {
                  label: "Est. Revenue",
                  value: `$${stats.totalRevenue}`,
                  icon: DollarSign,
                  trend: "+18%",
                  color: "text-green-600",
                  bg: "bg-green-50",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-[5px] rounded-tl-[20px] rounded-br-[20px] border border-border shadow-soft hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`${stat.bg} p-3 rounded-xl ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      {stat.trend}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-secondary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[5px] rounded-tl-[20px] rounded-br-[20px] border border-border overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h3 className="font-bold text-secondary text-lg">
                  Patient Bookings
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="p-4 font-bold text-secondary text-sm">Patient</th>
                      <th className="p-4 font-bold text-secondary text-sm">Service</th>
                      <th className="p-4 font-bold text-secondary text-sm">Doctor</th>
                      <th className="p-4 font-bold text-secondary text-sm">Date & Time</th>
                      <th className="p-4 font-bold text-secondary text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointmentsList.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-12 text-center text-muted-foreground">
                          <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                          <p>No bookings found yet.</p>
                        </td>
                      </tr>
                    ) : (
                      appointmentsList.map((apt) => (
                        <tr key={apt.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-secondary text-sm">{apt.profiles?.full_name || "Unknown Patient"}</p>
                            <p className="text-xs text-muted-foreground">{apt.profiles?.email}</p>
                          </td>
                          <td className="p-4 font-semibold text-primary text-sm">{apt.services?.name || "Deleted Service"}</td>
                          <td className="p-4 text-sm text-secondary">{apt.staff?.full_name || "Deleted Doctor"}</td>
                          <td className="p-4">
                            <p className="text-sm font-semibold text-secondary">{new Date(apt.start_time).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">{new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                              apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                              apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {apt.status || "pending"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Doctors Tab */}
        {activeTab === "staff" && (
          <div className="bg-white rounded-[5px] rounded-tl-[20px] rounded-br-[20px] border border-border overflow-hidden shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-secondary text-lg">
                Manage Doctors
              </h3>
              <button
                onClick={() => setIsStaffModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Doctor
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffList.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No doctors found. Add one to get started.
                </div>
              ) : (
                staffList.map((staff) => (
                  <div
                    key={staff.id}
                    className="border border-border rounded-2xl p-4 flex flex-col group relative"
                  >
                    <button
                      onClick={() => handleDeleteStaff(staff.id)}
                      className="absolute top-2 right-2 p-2 bg-red-50 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-full h-48 bg-muted rounded-xl mb-4 overflow-hidden border border-border">
                      {staff.image_url ? (
                        <img
                          src={staff.image_url}
                          alt={staff.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-10 h-10 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-secondary text-lg">
                      {staff.full_name}
                    </h4>
                    <p className="text-primary font-semibold text-sm mb-2">
                      {staff.specialty}
                    </p>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {staff.bio}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="bg-white rounded-[5px] rounded-tl-[20px] rounded-br-[20px] border border-border overflow-hidden shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-secondary text-lg">
                Manage Services
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesList.length === 0 ? (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No services found. Add one to get started.
                </div>
              ) : (
                servicesList.map((service) => (
                  <div
                    key={service.id}
                    className="border border-border rounded-2xl p-4 flex flex-col group relative"
                  >
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="absolute top-2 right-2 p-2 bg-red-50 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-full h-32 bg-muted rounded-xl mb-4 overflow-hidden border border-border">
                      {service.image_url ? (
                        <img
                          src={service.image_url}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10">
                          <Activity className="w-10 h-10 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-secondary text-lg">
                        {service.name}
                      </h4>
                      <span className="font-bold text-primary">
                        ${service.price}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase">
                      {service.duration_minutes} Minutes
                    </p>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {service.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-secondary">
                Add New Doctor
              </h2>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  name="fullName"
                  placeholder="e.g. Dr. Jane Rossi"
                  className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">
                  Specialty
                </label>
                <input
                  required
                  type="text"
                  name="specialty"
                  placeholder="e.g. Cardiologist"
                  className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">
                  Biography / Description
                </label>
                <textarea
                  required
                  name="bio"
                  rows={4}
                  placeholder="About the doctor..."
                  className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:border-primary resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">
                  Profile Photo (Image)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full border border-border rounded-xl px-4 py-2 outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-5 py-2 rounded-xl font-bold text-secondary bg-muted hover:bg-muted/80"
                >
                  Cancel
                </button>
                <button
                  disabled={isPending}
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 flex items-center"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Save Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-secondary">
                Add New Service
              </h2>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddService} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">
                  Service Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="e.g. General Checkup"
                  className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-secondary mb-1">
                    Price ($)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    name="price"
                    placeholder="150"
                    className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary mb-1">
                    Duration (Mins)
                  </label>
                  <input
                    required
                    type="number"
                    name="duration"
                    placeholder="45"
                    className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">
                  Description
                </label>
                <textarea
                  required
                  name="description"
                  rows={4}
                  placeholder="Service details..."
                  className="w-full border border-border rounded-xl px-4 py-3 outline-none focus:border-primary resize-none"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary mb-1">
                  Service Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full border border-border rounded-xl px-4 py-2 outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-5 py-2 rounded-xl font-bold text-secondary bg-muted hover:bg-muted/80"
                >
                  Cancel
                </button>
                <button
                  disabled={isPending}
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 flex items-center"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
