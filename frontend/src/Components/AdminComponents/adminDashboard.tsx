
import { useState, useEffect } from "react"
import { DollarSign, Users, UserIcon as UserMd } from 'lucide-react'

import DoctorRevenueChart from "./DoctorRevenueChart"
import UserDoctorChart from "./UserDoctorChart"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import adminAxiosUrl from "../../Utils/adminAxios"

export  function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalDoctors: 0,
    activeUsers: 0,
    adminRevenue: 0,
    doctorRevenue: 0,
    activeDoctors: 0,
    userDoctorChartData: [],
  })

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await adminAxiosUrl.get("/api/admin/dashboardData")
        setDashboardData({
          totalRevenue: response.data.response.totalRevenue,
          totalUsers: response.data.response.totalUsers,
          totalDoctors: response.data.response.totalDoctors,
          activeUsers: response.data.response.activeUsers,
          activeDoctors: response.data.response.activeDoctors,
          userDoctorChartData: response.data.response.userDoctorChartData,
          adminRevenue: response.data.response.adminRevenue,
          doctorRevenue: response.data.response.doctorRevenue,
        })
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-8 min-h-screen ">
      
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rs {dashboardData.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.activeUsers} active users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctors</CardTitle>
            <UserMd className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalDoctors}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.activeDoctors} active doctors
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users-doctors">Users & Doctors</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <DoctorRevenueChart data={dashboardData.userDoctorChartData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users-doctors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users & Doctors Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <UserDoctorChart data={dashboardData.userDoctorChartData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}