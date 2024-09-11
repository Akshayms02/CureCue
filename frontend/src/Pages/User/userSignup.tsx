import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import Myimage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";
import BackgroundImage from "../../assets/sebastian-svenson-LpbyDENbQQg-unsplash.jpg";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { signUp } from "../../Redux/Actions/userActions";
import { toast } from "sonner";
import { Toaster } from "../../../components/ui/sonner";

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
    name: z.string().min(1, "Name is required"), // Non-empty name
    email: z
      .string()
      .email("Invalid email address")
      .min(2, { message: "Email must be a minimum of 2 characters" })
      .max(50, { message: "Email cannot exceed 50 characters" }),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number cannot exceed 15 digits")
      .regex(/^\d+$/, "Phone number must contain only digits"), // Only digits allowed
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const UserSignup: React.FC = () => {
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
        navigate("/otp");
      } else {
        toast.error("This Email is already in use");
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("An error occured during the registration process");
    }
  };
  return (
    <main
      className="w-full h-full flex flex-col items-center justify-center bg-gray-50 sm:px-4 bg-cover pb-11 pt-5"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <Toaster position="top-center" richColors />
      <div className="w-full space-y-6 text-gray-600 sm:max-w-md">
        <div className="text-center">
          <img src={Myimage} width={250} className="mx-auto mt-0" />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Create an account
            </h3>
            <p className="">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-medium text-indigo-600 hover:text-white"
              >
                Log in
              </NavLink>
            </p>
          </div>
        </div>
        <div className="max-w-lg w-full  text-gray-600">
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
                        type="name"
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
                  <FormItem className="text-black">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="Phone"
                        placeholder="Enter Your Mobile Number"
                        {...field}
                        className="p-4 h-12  border-gray-900 text-black placeholder:text-black text-sm"
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter Your Password"
                        {...field}
                        className="p-4 h-12  border-gray-900 text-black placeholder:text-black text-sm"
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
                  <FormItem className="text-black">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter Your Password"
                        {...field}
                        className="p-4 h-12  border-gray-900 text-black placeholder:text-black text-sm"
                      />
                    </FormControl>

                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-black text-white">
                Sign in
              </Button>
            </form>
          </Form>
          {/* <div className="mt-5">
            <button className="w-full flex items-center justify-center gap-x-3 py-2.5 mt-5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100">
              <svg
                className="w-5 h-5"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_17_40)">
                  <path
                    d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                    fill="#34A853"
                  />
                  <path
                    d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                    fill="#FBBC04"
                  />
                  <path
                    d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                    fill="#EA4335"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_17_40">
                    <rect width="48" height="48" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Continue with Google
            </button>
          </div> */}
        </div>
      </div>
    </main>
  );
};

export default UserSignup;
