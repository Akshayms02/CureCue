

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Home, LogOut, Users2, Briefcase, Medal, CalendarClock } from 'lucide-react'
import { toast } from 'sonner'
import myImage from '../../assets/Screenshot_2024-08-15_191834-removebg-preview.png'
import { adminLogout } from '../../services/adminServices'

import { Button } from '../../../components/ui/button'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '../../../components/ui/sheet'
// import { Separator } from '@/components/ui/separator' // Removed as per update 3

export function AdminSideBar() {
  const navigate = useNavigate()
  const [open, setOpen] = React.useState(false)

  const handleLogout = async () => {
    try {
      const response = await adminLogout()
      console.log(response)

      localStorage.removeItem('adminAccessToken')
      localStorage.removeItem('adminInfo')
      toast.success('You have been successfully logged out')
      navigate('/admin/login')
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-sm font-medium ${
          isActive
            ? 'bg-black text-white'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {children}
    </NavLink>
  )

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow">
        <div className="flex flex-col gap-2 p-4">
          <NavItem to="/admin/dashboard" icon={Home}>Dashboard</NavItem>
          <NavItem to="/admin/users" icon={Users2}>Users</NavItem>
          <NavItem to="/admin/departments" icon={Medal}>Departments</NavItem>
          <NavItem to="/admin/doctors" icon={Briefcase}>Doctors</NavItem>
          <NavItem to="/admin/applications" icon={CalendarClock}>Applications</NavItem>
        </div>
      </ScrollArea>
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Home className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <img src={myImage} alt="Logo" className="h-8" />
            </div>
            {SidebarContent}
          </div>
        </SheetContent>
      </Sheet>
      <div className="hidden border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block">
        <div className="flex h-full max-h-screen flex-col">
          <div className="border-b p-4">
            <img src={myImage} alt="Logo" className="h-16 object-cover" />
          </div>
          {SidebarContent}
        </div>
      </div>
    </>
  )
}