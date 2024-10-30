import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { getDepartments } from "../../services/userServices"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Skeleton } from "../../../components/ui/skeleton"
import { AlertCircle, Stethoscope } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert"

interface Department {
  _id: string
  name: string
  description: string
}

const UserBookingPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments()
        console.log(response)
        setDepartments(response)
        setLoading(false)
      } catch (err: unknown) {
        setError("Failed to load departments")
        setLoading(false)

        if (err instanceof Error) {
          toast.error(err.message)
        } else {
          toast.error("An unknown error occurred")
        }
      }
    }

    fetchDepartments()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-4">
        <Skeleton className="h-12 w-[250px] mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-4 w-[200px] mx-auto mt-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
              </CardContent>
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
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-12">Choose a Department</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Link to={`/${dept._id}`} key={dept._id} className="group">
            <Card className="h-full transition-all duration-300 group-hover:shadow-lg">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full transition-colors duration-300 group-hover:bg-primary/20">
                  <Stethoscope className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-center mt-4">{dept.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">{dept.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default UserBookingPage