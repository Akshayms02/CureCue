import React from "react";

const DoctorDashboard: React.FC = () => {
  const upcomingAppointments = [
    { id: 1, patient: "John Doe", time: "10:00 AM", date: "2024-09-15" },
    { id: 2, patient: "Jane Smith", time: "11:30 AM", date: "2024-09-15" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-semibold">Doctor Dashboard</h2>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <a
                href="#appointments"
                className="block p-4 text-gray-700 hover:bg-gray-200"
              >
                Appointments
              </a>
            </li>
            <li>
              <a
                href="#patients"
                className="block p-4 text-gray-700 hover:bg-gray-200"
              >
                Patients
              </a>
            </li>
            <li>
              <a
                href="#settings"
                className="block p-4 text-gray-700 hover:bg-gray-200"
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Welcome to Your Dashboard</h1>
          <div>
            <button
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700"
              onClick={() => alert("Add Appointment")}
            >
              Add Appointment
            </button>
          </div>
        </header>

        {/* Upcoming Appointments */}
        <section id="appointments" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            {upcomingAppointments.length > 0 ? (
              <ul className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <li
                    key={appointment.id}
                    className="flex justify-between items-center border-b border-gray-200 pb-4"
                  >
                    <div>
                      <h3 className="text-xl font-semibold">
                        {appointment.patient}
                      </h3>
                      <p>
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <button
                      className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg hover:bg-blue-700"
                      onClick={() =>
                        alert(`View details for ${appointment.patient}`)
                      }
                    >
                      View Details
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming appointments.</p>
            )}
          </div>
        </section>

        {/* Patient Management */}
        <section id="patients" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Manage Patients</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p>Manage patient records and information here.</p>
          </div>
        </section>

        {/* Account Settings */}
        <section id="settings">
          <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p>Update your account settings here.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;
