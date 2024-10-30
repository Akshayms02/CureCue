import React, { useState, useEffect } from "react"
import { Camera, Mail, Phone, User, Calendar } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { defaultImg } from "../../assets/profile"
import { updateUserProfile } from "../../Redux/Actions/userActions"
import { useDispatch } from "react-redux"


interface UserInfo {
  name: string;
  email: string;
  userId: string;
  phone: string;
  gender: string;
  DOB: string;
  profileImage: string;
  bio: string;
}

export default function ProfileOverview() {
  const [userData, setUserData] = useState<UserInfo | null>(null)
  const dispatch: any = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [newImage, setNewImage] = useState<File | null>(null)
  const [editData, setEditData] = useState<UserInfo>({
    name: "",
    email: "",
    userId: "",
    phone: "",
    gender: "",
    DOB: "",
    profileImage: "",
    bio: "",
  })

  useEffect(() => {
    const storedData = localStorage.getItem("userInfo")
    if (storedData) {
      const parsedData = JSON.parse(storedData) as UserInfo
      setUserData(parsedData)
      setEditData(parsedData)
    }
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
    if (userData) {
      const updatedUserData = { ...userData, ...editData }
      try {
        const updatedValues = {
          userId: userData.userId,
          gender: updatedUserData.gender,
          DOB: updatedUserData.DOB,
          email: updatedUserData.email,
          phone: updatedUserData.phone,
          name: userData.name
        }

        await dispatch(updateUserProfile(updatedValues))

        console.log("Saving updated user data:", updatedUserData)
        setUserData(updatedUserData)
        localStorage.setItem("userInfo", JSON.stringify(updatedUserData))
        setIsEditing(false)
      } catch (error) {
        console.error("Error updating user data:", error)
      }
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof UserInfo
  ) => {
    setEditData({ ...editData, [field]: e.target.value })
  }

  if (!userData) {
    return <p>Loading...</p>
  }

  return (
    <div className="container mx-auto p-20 w-full ">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pb-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Avatar className="h-28 w-28">
                <AvatarImage src={userData.profileImage || defaultImg} alt={defaultImg} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
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
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl">{userData.name}</CardTitle>
              {/* <p className="text-sm text-muted-foreground">
                User ID: {userData.userId}
              </p> */}
            </div>
          </div>
          <Button onClick={isEditing ? handleSave : toggleEditMode}>
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>

                  <p className="text-sm">{userData.bio || `Hi, I am ${userData.name}.`}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Additional Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    Feel free to reach out to me for inquiries and connections.
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        value={editData.email}
                        onChange={(e) => handleInputChange(e, "email")}
                      />
                    ) : (
                      <p className="text-sm">{userData.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Phone
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => handleInputChange(e, "phone")}
                      />
                    ) : (
                      <p className="text-sm">{userData.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Gender
                    </Label>
                    {isEditing ? (
                      <Input
                        id="gender"
                        value={editData.gender}
                        onChange={(e) => handleInputChange(e, "gender")}
                      />
                    ) : (
                      <p className="text-sm">{userData.gender || "Not Provided"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Date of Birth
                    </Label>
                    {isEditing ? (
                      <Input
                        id="dob"
                        type="date"
                        value={editData.DOB ? new Date(editData.DOB).toISOString().split('T')[0] : ''}
                        onChange={(e) => handleInputChange(e, "DOB")}
                      />
                    ) : (
                      <p className="text-sm">{userData.DOB
                        ? new Date(userData.DOB).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                        : "Not Provided"}</p>
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