import { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";

import DoctorCard from "../../Components/UserComponents/DoctorCard";
import axiosUrl from "../../Utils/axios";

import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

function UserHome() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const doctorsPerPage = 4;

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data } = await axiosUrl.get("/api/user/getDoctors");
      setDoctors(data);
    };
    fetchDoctors();
  }, []);

  // Calculate the doctors to be shown on the current page
  const indexOfLastDoctor = (currentPage + 1) * doctorsPerPage;
  const indexOfFirstDoctor = currentPage * doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor);

  // Function to go to the next set of doctors
  const handleNextPage = () => {
    if (indexOfLastDoctor < doctors.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Function to go to the previous set of doctors
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <main>
      <section
        className="bg-blue-600 bg-opacity-70 text-white text-center py-20 bg-cover bg-center object-cover mt-20"
        id="hero"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        }}
      >
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-black">
            Welcome to CureCue
          </h1>
          <p className="text-lg mb-8 text-black font-semibold">
            Your trusted platform for booking doctor appointments seamlessly.
          </p>
          <NavLink
            to="/signup"
            className="bg-black text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-gray-800"
          >
            Get Started
          </NavLink>
          <NavLink to="/doctor/dashboard" className="block mt-10 text-3xl text-black hover:text-blue-700 text-pretty">Are you a Doctor?</NavLink>
        </div>
      </section>

      <section className="container mx-auto py-16 text-white" id="features">
        <h2 className="text-3xl font-bold text-center mb-8  text-black">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4 text-white">
              Easy Booking
            </h3>
            <p>
              Book your doctor appointments with just a few clicks. Choose your
              preferred time and date easily.
            </p>
          </div>
          <div className="bg-black p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
            <p>
              We prioritize your privacy and security. All your data is
              encrypted and handled with care.
            </p>
          </div>
          <div className="bg-black p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">24/7 Support</h3>
            <p>
              Our support team is available around the clock to assist you with
              any issues or queries.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-200 py-16" id="testimonials">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.doctorId}
                name={doctor.name}
                specialty={doctor.department}
                url={doctor.profileUrl}
              />
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded-lg shadow-lg ${currentPage === 0
                ? "bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              <FaArrowLeft />
            </button>

            <button
              onClick={handleNextPage}
              disabled={indexOfLastDoctor >= doctors.length}
              className={`px-4 py-2  rounded-lg shadow-lg ${indexOfLastDoctor >= doctors.length
                ? "bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-16" id="contact">
        <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
        <div className="flex justify-center">
          <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                type="text"
                id="name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                type="email"
                id="email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                className="w-full px-4 py-2 border border-zinc-300 rounded-lg caret-violet-400"
                id="message"
                rows={4}
              ></textarea>
            </div>
            <button
              className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700"
              type="submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default UserHome;
