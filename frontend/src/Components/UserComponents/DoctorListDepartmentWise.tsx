import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { BadgeCheck } from "lucide-react"
import { getDepDoctors } from "../../services/userServices"
import { Card, CardFooter } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Skeleton } from "../../../components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert"

interface Doctor {
  doctorId: string
  _id: string
  name: string
  department: string
  profileUrl: string
}

const DoctorListDepartmentWise = () => {
  const { departmentId } = useParams<{ departmentId: string }>()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDepDoctors(departmentId as string)
        console.log(response)
        setDoctors(response)
        setLoading(false)
      } catch (err: any) {
        setError("Failed to load doctors")
        setLoading(false)
        toast.error(err.message)
      }
    }

    fetchDoctors()
  }, [departmentId])

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-12 w-[250px] mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-80 w-full" />
              <CardFooter className="p-4">
                <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {doctors.length > 0 ? (
        <>
          <h1 className="text-4xl font-bold text-center mb-12">
            Doctors in {doctors[0]?.department} Department
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card
                key={doctor.doctorId}
                className="overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => navigate(`/doctordetails/${doctor.doctorId}`)}
              >
                <div className="relative h-80 w-full aspect-[4/3] overflow-hidden bg-white">
                  <img
                    src={doctor.profileUrl || "/placeholder.svg?height=320&width=256"}
                    className="object-contain w-full h-full object-center"
                    alt={doctor.name}
                  />
                  <div className="absolute top-2 left-2 bg-white rounded-full p-1">
                    <BadgeCheck className="text-primary h-6 w-6" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                    <h2 className="font-bold text-xl truncate">{doctor.name}</h2>
                    <p className="text-sm opacity-90 truncate">{doctor.department}</p>
                  </div>
                </div>
                <CardFooter className="p-4">
                  <Button className="w-full hover:bg-gray-300" variant="outline">
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">No Doctors Available</h2>
          <p className="text-xl text-gray-600">
            There are currently no doctors available for this department.
          </p>
          <Button className="mt-8" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      )}
    </div>
  )
}

export default DoctorListDepartmentWise