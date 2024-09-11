import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Myimage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";
import BackgroundImage from "../../assets/annie-spratt-nNQP1LXMA0g-unsplash.jpg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { signUp } from "../../Redux/Actions/doctorActions";
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

const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(2, "Email is required")
      .max(50, "Email cannot exceed 50 characters"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number cannot exceed 15 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const DoctorSignupComponent: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      confirmPassword: "",
    },
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSignup = async (values: {
    name: string;
    email: string;
    password: string;
    phone: string;
    confirmPassword: string;
  }) => {
    try {
      const result = await dispatch(signUp(values));
      console.log(result);
      if (result) {
        navigate("/doctor/otp");
      } else {
        toast.error("This Email is already in use");
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("An error occurred during the registration process");
    }
  };

  return (
    <main
      className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 sm:px-4 bg-cover pb-11 pt-5"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <img src={Myimage} width={250} className="mx-auto mt-0" />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Create an account
            </h3>
            <p>
              Already have an account?{" "}
              <NavLink
                to="/doctor/login"
                className="font-medium text-indigo-600 hover:text-white"
              >
                Log in
              </NavLink>
            </p>
          </div>
        </div>
        <div className="max-w-lg w-full text-gray-600">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSignup)}
              className="mt-8 space-y-5"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Your Full Name"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter Your Email"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Your Mobile Number"
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
                  <FormItem>
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter Your Password"
                        {...field}
                        className="p-4 h-12 border-gray-900 text-black placeholder:text-black text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-black text-white">
                Create account
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default DoctorSignupComponent;
