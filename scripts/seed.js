const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("Seeding services...");

  const services = [
    {
      name: "General Consultation",
      description: "Standard health check-up and medical advice.",
      duration_minutes: 30,
      price: 50,
      is_active: true,
    },
    {
      name: "Specialist Appointment",
      description: "Consultation with a medical specialist.",
      duration_minutes: 45,
      price: 120,
      is_active: true,
    },
    {
      name: "Vaccination",
      description: "Routine vaccinations and immunizations.",
      duration_minutes: 15,
      price: 30,
      is_active: true,
    },
    {
      name: "Dental Check-up",
      description: "Basic dental cleaning and examination.",
      duration_minutes: 60,
      price: 80,
      is_active: true,
    },
  ];

  // Try to insert services. If they fail due to unique constraint, it's fine.
  // Since there is no unique constraint on 'name', we just insert.
  const { data: insertedServices, error: serviceError } = await supabase
    .from("services")
    .insert(services)
    .select();

  if (serviceError) {
    console.error("Error seeding services:", serviceError);
  } else {
    console.log(`Successfully seeded ${insertedServices.length} services.`);
  }

  console.log("Seeding staff...");

  const staff = [
    {
      full_name: "Dr. Michael Chen",
      specialty: "General Practitioner",
      bio: "Expert in family medicine with 15 years of experience.",
      is_active: true,
    },
    {
      full_name: "Dr. Sarah Johnson",
      specialty: "Pediatrician",
      bio: "Dedicated to providing the best care for children of all ages.",
      is_active: true,
    },
    {
      full_name: "Dr. Emily Brown",
      specialty: "Cardiologist",
      bio: "Specializes in heart health and cardiovascular diseases.",
      is_active: true,
    },
  ];

  const { data: insertedStaff, error: staffError } = await supabase
    .from("staff")
    .insert(staff)
    .select();

  if (staffError) {
    console.error("Error seeding staff:", staffError);
  } else {
    console.log(`Successfully seeded ${insertedStaff.length} staff members.`);

    // Link staff to some services
    if (insertedServices && insertedServices.length > 0) {
      console.log("Linking staff to services...");
      const staffServices = [];

      insertedStaff.forEach((s) => {
        insertedServices.forEach((ser) => {
          staffServices.push({
            staff_id: s.id,
            service_id: ser.id,
          });
        });
      });

      const { error: linkError } = await supabase
        .from("staff_services")
        .insert(staffServices);

      if (linkError) {
        console.error("Error linking staff to services:", linkError);
      } else {
        console.log("Successfully linked staff to services.");
      }
    }
  }
}

seed().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
