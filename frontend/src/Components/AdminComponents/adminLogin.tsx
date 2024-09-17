import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import myImage from "../../assets/annie-spratt-0aF_vV0xgQk-unsplash.jpg";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Actions/adminActions";
import { AppDispatch } from "../../Redux/store";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(2, {
      message: "Email must be a minimum of 2 characters",
    })
    .max(50),
  password: z.string().min(1, "Password is required"),
});

const AdminLoginForm: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      if (result) {
        toast.success("Logged in successfully");
        navigate("/admin/dashBoard");
      }
    } catch (error: any) {
      toast.error(error || "Login Failed");
    }
  };

  return (
    <>
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleLogin)}
                className="grid gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="m@example.com"
                          {...field}
                          className="p-4 h-12 border-gray-900 text-black placeholder:text-black text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="text-black">
                      <FormLabel className="text-black">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter Your Password"
                          {...field}
                          className="p-4 h-12 border-gray-900 text-black placeholder:text-black text-sm"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-black text-white">
                  Login
                </Button>
                <div className="text-center">
                  <NavLink
                    to="/forgot-password"
                    className="hover:text-blue-700 text-gray-900"
                  >
                    Forgot password?
                  </NavLink>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <img
            width="1920"
            height="1080"
            src={myImage}
            className="min-h-full min-w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
};

export default AdminLoginForm;
