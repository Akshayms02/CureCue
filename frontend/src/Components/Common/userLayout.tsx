import React from "react"
import { FaUserCircle, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa"
import { useSelector } from "react-redux"
import { RootState } from "../../Redux/store"
import myImage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png"
import { Outlet, useNavigate, NavLink, Link } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../../components/ui/sheet"

const UserLayout: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.user.userInfo)
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate("/login")
  }

  const handleProfileClick = () => {
    navigate("/profile")
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-xl">
        <div className="container flex h-16 items-center">
          <div className="flex-1">
            <a href="/" className="flex items-center space-x-2">
              <img src={myImage} width={170} alt="CureCue Logo" />
            </a>
          </div>
          <nav className="flex-1 hidden md:flex justify-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              Booking
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              Contact
            </NavLink>
          </nav>
          <div className="flex-1 flex justify-end items-center space-x-4">
            <nav className="flex items-center space-x-1">
              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleProfileClick}
                  className="w-10 h-10 rounded-full"
                >
                  <FaUserCircle className="h-6 w-6" />
                  <span className="sr-only">Profile</span>
                </Button>
              ) : (
                <Button onClick={handleLogin}>Login</Button>
              )}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-base hover:bg-transparent focus:ring-0 md:hidden"
                  >
                    <span className="sr-only">Open menu</span>
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-4">
                    <NavLink
                      to="/"
                      className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                    >
                      Home
                    </NavLink>
                    <NavLink
                      to="/booking"
                      className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                    >
                      Booking
                    </NavLink>
                    <NavLink
                      to="/contact"
                      className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                    >
                      Contact
                    </NavLink>
                  </nav>
                </SheetContent>
              </Sheet>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-black/90 text-white border-t rounded-t-3xl">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About CureCue</h3>
              <p className="text-sm text-gray-600">
                CureCue is your trusted platform for booking doctor appointments seamlessly. We're committed to making healthcare accessible and convenient for everyone.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/find-doctor" className="text-sm text-gray-600 hover:text-primary">Find a Doctor</Link></li>
                <li><Link to="/specialties" className="text-sm text-gray-600 hover:text-primary">Medical Specialties</Link></li>
                <li><Link to="/health-blog" className="text-sm text-gray-600 hover:text-primary">Health Blog</Link></li>
                <li><Link to="/faq" className="text-sm text-gray-600 hover:text-primary">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Patients</h3>
              <ul className="space-y-2">
                <li><Link to="/how-it-works" className="text-sm text-gray-600 hover:text-primary">How It Works</Link></li>
                <li><Link to="/patient-resources" className="text-sm text-gray-600 hover:text-primary">Patient Resources</Link></li>
                <li><Link to="/insurance" className="text-sm text-gray-600 hover:text-primary">Insurance Information</Link></li>
                <li><Link to="/testimonials" className="text-sm text-gray-600 hover:text-primary">Patient Testimonials</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact & Support</h3>
              <p className="text-sm text-gray-600 mb-2">Email: support@curecue.com</p>
              <p className="text-sm text-gray-600 mb-4">Phone: (123) 456-7890</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary"><FaFacebookF /></a>
                <a href="#" className="text-gray-400 hover:text-primary"><FaTwitter /></a>
                <a href="#" className="text-gray-400 hover:text-primary"><FaLinkedinIn /></a>
                <a href="#" className="text-gray-400 hover:text-primary"><FaInstagram /></a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} CureCue. All rights reserved.
            </p>
            <div className="mt-2 space-x-4">
              <Link to="/privacy-policy" className="text-xs text-gray-500 hover:text-primary">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-xs text-gray-500 hover:text-primary">Terms of Service</Link>
              <Link to="/accessibility" className="text-xs text-gray-500 hover:text-primary">Accessibility</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default UserLayout