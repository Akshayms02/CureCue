import React, { useState, useEffect } from "react"
import { Camera } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { getDoctorData } from "../../services/doctorServices"
import { defaultImg } from "../../assets/profile"
import { useDispatch } from "react-redux"
import { updateDoctorProfile } from "../../Redux/Actions/doctorActions"

interface Department {
  _id: string
  name: string
  description: string
  isListed: boolean
  createdAt: string
  __v: number
}

interface DoctorInfo {
  name: string
  email: string
  doctorId: string
  phone: string
  isBlocked: boolean
  docStatus: string
  DOB: string
  fees: number
  gender: string
  department: Department
  image: any
  imageUrl: string
}

export default function DoctorProfileCard() {
  const [doctorData, setDoctorData] = useState<DoctorInfo | null>(null)
  const dispatch: any = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [newImage, setNewImage] = useState<File | null>(null)
  const [editData, setEditData] = useState({
    email: "",
    phone: "",
    fees: 0,
    gender: "",
  })

  useEffect(() => {
    const fetchDoctorData = async () => {
      const storedData = localStorage.getItem("doctorInfo")
      const parsedData = JSON.parse(storedData || "{}")
      const doctorId = parsedData?.doctorId

      if (doctorId) {
        const response = await getDoctorData(doctorId)
        const doctorInfo = response?.data as DoctorInfo
        setDoctorData(doctorInfo)
        setEditData({
          email: doctorInfo.email,
          phone: doctorInfo.phone,
          fees: doctorInfo.fees,
          gender: doctorInfo.gender,
        })
      }
    }

    fetchDoctorData()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0])
    }
  }

  const handleImageSave = () => {
    console.log("Image uploaded:", newImage)
    // Implement actual image upload logic here
  }

  const toggleEditMode = () => setIsEditing((prev) => !prev)

  const handleSave = async () => {
    if (doctorData) {
      const updatedDoctorData = { ...doctorData, ...editData }
      try {

        const updatedValues = {
          doctorId: doctorData.doctorId, // Assuming you have doctorId in the data
          gender: editData.gender,
          fees: Number(editData.fees), // Convert fees to a number before sending
          phone: editData.phone,
        };
        console.log(updatedValues)
        await dispatch(updateDoctorProfile(updatedValues))

        console.log("Saving updated doctor data:", updatedDoctorData)
        setDoctorData(updatedDoctorData)
        setIsEditing(false)
      } catch (error) {
        console.error("Error updating doctor data:", error)
      }
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof editData
  ) => {
    setEditData({ ...editData, [field]: e.target.value })
  }

  if (!doctorData) {
    return <p>Loading...</p>
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={doctorData.imageUrl || defaultImg}
                alt={doctorData.name}
                className="h-28 w-28 rounded-full object-cover"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                  </DialogHeader>
                  <Input type="file" onChange={handleImageUpload} />
                  <Button onClick={handleImageSave}>Save Image</Button>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <CardTitle>{doctorData.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Department: {doctorData.department?.name}
              </p>
            </div>
          </div>
          <Button onClick={isEditing ? handleSave : toggleEditMode}>
            {isEditing ? "Save" : "Edit Profile"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Specialist in{" "}
                    <span className="font-medium">
                      {doctorData.department?.description}
                    </span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>About me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Hi, I am Dr. {doctorData.name}, a specialist in{" "}
                    {doctorData.department?.name} with a focus on{" "}
                    {doctorData.department?.description}.
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        value={editData.email}
                        onChange={(e) => handleInputChange(e, "email")}
                      />
                    ) : (
                      <p>{doctorData.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => handleInputChange(e, "phone")}
                      />
                    ) : (
                      <p>{doctorData.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fees">Fees</Label>
                    {isEditing ? (
                      <Input
                        id="fees"
                        type="number"
                        value={editData.fees}
                        onChange={(e) => handleInputChange(e, "fees")}
                      />
                    ) : (
                      <p>Rs.{doctorData.fees}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    {isEditing ? (
                      <Input
                        id="gender"
                        value={editData.gender}
                        onChange={(e) => handleInputChange(e, "gender")}
                      />
                    ) : (
                      <p>{doctorData.gender}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}