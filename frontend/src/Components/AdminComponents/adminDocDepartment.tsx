import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../Redux/store";
import {
  listUnlistSpecialization,
  addSpecialization,
  updateSpecialization,
} from "../../Redux/Actions/adminActions";


import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Badge } from "../../../components/ui/badge";
import { MoreHorizontal } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { getSpecializations } from "../../services/adminServices";

// Define the schema for validation
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

type FormValues = z.infer<typeof schema>;

interface Specializations {
  _id: number;
  name: string;
  description: string;
  isListed: boolean;
}

const AdminDocDepartment: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminAccessToken = localStorage.getItem("adminAccessToken");
    if (!adminAccessToken) {
      navigate("/admin/login");
    }
  }, [navigate]);
  const dispatch: AppDispatch = useDispatch();
  const [categories, setCategories] = useState<Specializations[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<Specializations | null>(
    null
  );

  const fetchSpecializations = async () => {
    try {
      const response = await getSpecializations()
      setCategories(response);
    } catch (error: any) {
      toast.error(`Failed to fetch specializations: ${error}`);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleAdding = async (data: FormValues) => {
    try {
      const response = await dispatch(addSpecialization(data));
      setCategories((prevCategories) => [
        ...prevCategories,
        response.data.response,
      ]);
      setIsAddModalOpen(false);
      form.reset(); // Reset the form after adding
      toast.success("Specialization added successfully");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleEditing = async (data: FormValues) => {
    try {
      if (editCategory) {
        await dispatch(
          updateSpecialization({
            id: editCategory._id!,
            name: data.name,
            description: data.description,
          })
        );
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === editCategory._id
              ? { ...category, name: data.name, description: data.description }
              : category
          )
        );
        setIsEditModalOpen(false);
        form.reset();
        toast.success("Specialization updated successfully");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  const toggleEditCancel = async () => {
    try {
      form.reset();
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const toggleCreateCancel = async () => {
    try {
      form.reset();
      setIsAddModalOpen(false);
    } catch (error: any) {
      toast.error(error);
    }
  };

  // Toggle List/Unlist State
  const toggleListState = async (id: number) => {
    try {
      const response = await dispatch(listUnlistSpecialization({ id }));
      if (response) {
        toast.success("The Action was successful");
      }
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === id
            ? { ...category, isListed: !category.isListed }
            : category
        )
      );
    } catch (error: any) {
      toast.error(`Failed to change state: ${error}`);
    }
  };

  const openEditingModal = (category: Specializations) => {
    setEditCategory(category);
    form.setValue("name", category.name);
    form.setValue("description", category.description);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Specializations List</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Specializations</CardTitle>
            <CardDescription>
              Add, Edit, List and Unlist Specializations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Button onClick={() => setIsAddModalOpen(true)}>
                Add Category
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>
                      <Badge
                        className="h-8"
                        variant={category.isListed ? "success" : "danger"}
                      >
                        {category.isListed ? "Listed" : "Unlisted"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => openEditingModal(category)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleListState(category._id)}
                          >
                            {category.isListed ? "Unlist" : "List"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Category Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Add New Category</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAdding)}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter category name"
                            {...field}
                            className="mt-1 block w-full px-3 py-2 border rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-black">
                          Description
                        </FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Enter description"
                            {...field}
                            className="mt-1 block w-full px-3 py-2 border rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={toggleCreateCancel}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}

        {/* Edit Category Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-4">Edit Category</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEditing)}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter category name"
                            {...field}
                            className="mt-1 block w-full px-3 py-2 border rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Enter description"
                            {...field}
                            className="mt-1 block w-full px-3 py-2 border rounded"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={toggleEditCancel}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Update</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add New Category</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAdding)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter category name"
                          {...field}
                          className="mt-1 block w-full px-3 py-2 border rounded"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Description</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Enter description"
                          {...field}
                          className="mt-1 block w-full px-3 py-2 border rounded"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={toggleCreateCancel}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDocDepartment;
