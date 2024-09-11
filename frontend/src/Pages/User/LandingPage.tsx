import myImage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";
import { FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

import { RootState } from "../../Redux/store";
import { useSelector } from "react-redux";

const LandingPage: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.userInfo);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
    console.log("Login button clicked");
  };

  const handleProfileClick = () => {
    console.log("Profile icon clicked");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto flex justify-between items-center p-5">
          <img src={myImage} width={250} alt="CureCue Logo" />
          <div>
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-500 px-4"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-blue-500 px-4 "
            >
              Testimonials
            </a>

            <a
              href="#contact"
              className="text-gray-700 hover:text-blue-500 px-4"
            >
              Contact
            </a>
          </div>

          <div>
            {isLoggedIn ? (
              <button
                onClick={handleProfileClick}
                className="text-gray-700 hover:text-blue-500 px-4 "
              >
                <FaUserCircle size={24} />
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </header>

      <main>
        <section className="bg-blue-600 text-white text-center py-20" id="hero">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-4">Welcome to CureCue</h1>
            <p className="text-lg mb-8">
              Your trusted platform for booking doctor appointments seamlessly.
            </p>
            <NavLink
              to="/signup"
              className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg shadow-lg hover:bg-gray-100"
            >
              Get Started
            </NavLink>
          </div>
        </section>

        <section className="container mx-auto py-16" id="features">
          <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Easy Booking</h3>
              <p>
                Book your doctor appointments with just a few clicks. Choose
                your preferred time and date easily.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Secure & Private</h3>
              <p>
                We prioritize your privacy and security. All your data is
                encrypted and handled with care.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold mb-4">24/7 Support</h3>
              <p>
                Our support team is available around the clock to assist you
                with any issues or queries.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gray-200 py-16" id="testimonials">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
            <div className="flex flex-wrap justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs mx-4 mb-6">
                <p className="text-lg mb-4">
                  "CureCue made booking my appointments so easy! The interface
                  is intuitive and hassle-free."
                </p>
                <p className="font-semibold">Alex J.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs mx-4 mb-6">
                <p className="text-lg mb-4">
                  "The best part is the 24/7 support. Whenever I had an issue, I
                  got quick and helpful responses."
                </p>
                <p className="font-semibold">Jamie L.</p>
              </div>
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
                  className="w-full px-4 py-2 border border-zinc-300 rounded-lg caret-violet-400 "
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

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} CureCue. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
