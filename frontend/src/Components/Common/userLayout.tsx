import React from "react";
import { FaUserCircle } from "react-icons/fa";

import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

import myImage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";

import { Outlet, useNavigate, NavLink } from "react-router-dom";

const UserLayout: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.userInfo);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md">
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600 rounded-xl shadow-xl">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img src={myImage} width={190} alt="CureCue Logo" />
            </a>

            {/* Mobile Menu Button */}
            <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
              {isLoggedIn ? (
                <button
                  onClick={handleProfileClick}
                  className="text-gray-700 hover:text-blue-500 px-4"
                >
                  <FaUserCircle size={35} />
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Login
                </button>
              )}

              {/* Hamburger Menu for Mobile */}
              <button
                data-collapse-toggle="navbar-sticky"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-sticky"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div
              className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              id="navbar-sticky"
            >
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <NavLink
                    to="/"
                    className="block py-2 text-lg font-bold px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/booking"
                    className="block py-2 px-3 text-lg font-bold text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Booking
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/contact"
                    className="block py-2 px-3 text-lg font-bold text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                  >
                    Contact
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <Outlet />

      <footer className="bg-gradient-to-r from-stone-500 to-stone-700 text-white py-4 text-center">
        <p>&copy; {new Date().getFullYear()} CureCue. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserLayout;
