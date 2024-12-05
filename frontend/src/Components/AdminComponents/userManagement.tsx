import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import adminAxiosUrl from "../../Utils/adminAxios";

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
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Track total number of pages
  const usersPerPage = 10; // Set items per page

  useEffect(() => {
    const adminAccessToken = localStorage.getItem("adminAccessToken");
    if (!adminAccessToken) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchUsers = async (page: number) => {
    try {
      const response = await adminAxiosUrl.get("/api/admin/getUsers", {
        params: { page, limit: usersPerPage },
      });
      console.log(response)
      setUsers(response.data.response);
      setTotalPages(Math.ceil(response.data.totalPages / usersPerPage)); // Calculate total pages
    } catch (error: any) {
      toast.error(`Failed to fetch users: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage); // Fetch users for the current page
  }, [currentPage]);

  const toggleListState = async (id: string) => {
    console.log("hello toggled");
    const response = await adminAxiosUrl.put(`/api/admin/listUnlistUser/${id}`);
    if (response) {
      toast.success("The Action was successful");
    }
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
                    <TableCell className="p-4 font-medium">{user.name}</TableCell>
                    <TableCell className="p-4">{user.email}</TableCell>
                    <TableCell className="p-4">
                      <Badge className="h-8" variant={user.isBlocked ? "danger" : "success"}>
                        {user.isBlocked ? "Blocked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => toggleListState(user._id)}>
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
          <CardFooter className=" flex justify-center ">

            <div className="flex justify-between items-center w-full">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {'<'}
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                {'>'}
              </Button>
            </div>


          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default UserManagement;
