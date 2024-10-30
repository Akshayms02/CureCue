

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, ArrowRight, BadgeCheck, Calendar, Lock, PhoneCall } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"

import { getDoctors } from "../../services/userServices"

interface Doctor {
  doctorId: string
  name: string
  department: string
  profileUrl: string
}

function DoctorCard({ name, specialty, url }: { name: string; specialty: string; url: string }) {
  return (
    <div className="w-64 h-80 text-white shadow-lg rounded-md relative overflow-hidden cursor-pointer font-sans">
      {/* Certified badge */}
      <div className="absolute top-2 left-2 z-10">
        <BadgeCheck className="text-primary h-10 w-10" />
      </div>

      {/* Doctor Image */}
      <img
        src={url || "/placeholder.svg?height=320&width=256"}
        className="rounded-md object-cover w-full h-full"
        alt={name}
      />

      {/* Doctor Details */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4">
        <p className="font-bold text-2xl truncate">{name}</p>
        <p className="text-sm truncate">{specialty}</p>
      </div>
    </div>
  )
}

export default function UserHome() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const doctorsPerPage = 4

  useEffect(() => {
    const fetchDoctors = async () => {
      const data = await getDoctors()
      setDoctors(data)
    }
    fetchDoctors()
  }, [])

  const indexOfLastDoctor = (currentPage + 1) * doctorsPerPage
  const indexOfFirstDoctor = currentPage * doctorsPerPage
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor)

  const handleNextPage = () => {
    if (indexOfLastDoctor < doctors.length) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <section
        className="relative bg-cover bg-center py-32 text-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 mx-auto px-4">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">Welcome to CureCue</h1>
          <p className="mb-8 text-lg text-white md:text-xl">
            Your trusted platform for booking doctor appointments seamlessly.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/doctor/dashboard">Are you a Doctor?</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-16" id="features">
        <h2 className="mb-8 text-center text-3xl font-bold">Features</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Easy Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              Book your doctor appointments with just a few clicks. Choose your preferred time and date easily.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Secure & Private
              </CardTitle>
            </CardHeader>
            <CardContent>
              We prioritize your privacy and security. All your data is encrypted and handled with care.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PhoneCall className="mr-2 h-5 w-5" />
                24/7 Support
              </CardTitle>
            </CardHeader>
            <CardContent>
              Our support team is available around the clock to assist you with any issues or queries.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted py-16" id="doctors">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Our Doctors</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
            {currentDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.doctorId}
                name={doctor.name}
                specialty={doctor.department}
                url={doctor.profileUrl}
              />
            ))}
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <Button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              variant={currentPage === 0 ? "outline" : "default"}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={indexOfLastDoctor >= doctors.length}
              variant={indexOfLastDoctor >= doctors.length ? "outline" : "default"}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-16" id="contact">
        <h2 className="mb-8 text-center text-3xl font-bold">Contact Us</h2>
        <Card className="mx-auto max-w-md">
          <CardContent className="p-6">
            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="name">
                  Name
                </label>
                <Input id="name" type="text" placeholder="Your name" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input id="email" type="email" placeholder="Your email" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Your message"
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                ></textarea>
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}