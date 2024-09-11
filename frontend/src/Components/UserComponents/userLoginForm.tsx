import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Myimage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";
import BackgroundImage from "../../assets/sebastian-svenson-LpbyDENbQQg-unsplash.jpg";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Actions/userActions";
import { AppDispatch } from "../../Redux/store";
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

const LoginForm: React.FC = () => {
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
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error || "Login Failed");
    }
  };

  return (
    <>
      <main
        className="w-full min-h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center pb-11"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <Toaster position="top-right" />
        <div className="max-w-sm w-full text-gray-600">
          <div className="text-center">
            <img src={Myimage} width={250} className="mx-auto mt-0" />
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-900 text-2xl font-bold sm:text-3xl selection:bg-blue-800">
                Log in to your account
              </h3>
              <p className="">
                Don't have an account?{" "}
                <NavLink
                  to="/signup"
                  className="font-medium text-blue-500 hover:text-white"
                >
                  Sign up
                </NavLink>
              </p>
            </div>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="mt-8 space-y-5"
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
                        placeholder="example@example.com"
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
              <Button type="submit" className="w-full bg-black text-white">
                Sign in
              </Button>
              <div className="text-center">
                <NavLink
                  to="/forgot-password"
                  className="hover:text-white text-gray-900"
                >
                  Forgot password?
                </NavLink>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </>
  );
};

export default LoginForm;
