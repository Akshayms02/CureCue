import { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosUrl from "../../Utils/axios";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

interface UserDetails {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  isBlocked: boolean;
}

function UserManagement() {
  const navigate = useNavigate();
  useEffect(() => {
    const adminAccessToken = localStorage.getItem("adminAccessToken");
    if (!adminAccessToken) {
      navigate("/admin/login");
    }
  }, [navigate]);
  const [users, setUsers] = useState<UserDetails[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await axiosUrl.get("/api/admin/getUsers");
      setUsers(response.data.response);
    } catch (error: any) {
      toast.error(`Failed to fetch users${error}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleListState = async (id: string) => {
    console.log("hello toggled");
    const response = await axiosUrl.put(`/api/admin/listUnlistUser/${id}`);
    if (response) {
      toast.success("The Action was successful");
    }
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Users List</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage your users and their statuses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="p-4">Name</TableHead>
                  <TableHead className="p-4">Email</TableHead>
                  <TableHead className="p-4">Status</TableHead>
                  <TableHead className="p-4">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="p-4 font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell className="p-4">{user.email}</TableCell>
                    <TableCell className="p-4">
                      <Badge
                        className="h-8"
                        variant={user.isBlocked ? "danger" : "success"}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => toggleListState(user._id)}
                          >
                            {user.isBlocked ? "List" : "Unlist"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>{/* Add footer content if needed */}</CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default UserManagement;
