import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Myimage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";
import BackgroundImage from "../../assets/annie-spratt-nNQP1LXMA0g-unsplash.jpg";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Actions/doctorActions";
import { AppDispatch } from "../../Redux/store";
import { toast} from "sonner";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(2, { message: "Email must be a minimum of 2 characters" })
    .max(50),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const LoginForm: React.FC = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async (values: FormValues) => {
    try {
      const result = await dispatch(login(values)).unwrap();
      if (result) {
        toast.success("Logged in successfully");
        navigate("/doctor/dashboard");
      }
    } catch (error: any) {
      toast.error(error || "Login Error");
    }
  };

  return (
    <>
      <main
        className="w-full min-h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center pb-11"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="max-w-sm w-full text-gray-600 space-y-8">
          <div className="text-center">
            <img src={Myimage} width={250} className="mx-auto" alt="Logo" />
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-900 text-2xl font-bold sm:text-3xl">
                Log in to your account
              </h3>
              <p className="">
                Don't have an account?{" "}
                <NavLink
                  to="/doctor/signup"
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
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@example.com"
                        {...field}
                        className="w-full p-4 h-12 border border-gray-500 text-black placeholder:text-black rounded-lg focus:ring-blue-600 focus:border-blue-600 shadow-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 mt-1 text-sm" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter Your Password"
                        {...field}
                        className="w-full p-4 h-12 border border-gray-500 text-black placeholder:text-black rounded-lg focus:ring-blue-600 focus:border-blue-600 shadow-xl"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 mt-1 text-sm" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </Button>
              <div className="text-center text-black">
                <NavLink to="/forgot-password" className="hover:text-white">
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
