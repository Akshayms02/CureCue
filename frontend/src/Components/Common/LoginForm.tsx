import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";
import Myimage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";
import BackgroundImage from "../../assets/108364.jpg";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Actions/userActions";
import { AppDispatch } from "../../Redux/store";
import { toast, Toaster } from "sonner";

const LoginForm: React.FC = () => {
  console.log();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = (values: { email: string; password: string }) => {
    dispatch(login(values));
  };

  return (
    <>
      <main
        className="w-full h-screen flex flex-col items-center justify-center px-4 bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <Toaster position="top-center" richColors />
        <div className="max-w-sm w-full text-gray-600">
          <div className="text-center">
            <img src={Myimage} width={250} className="mx-auto mt-0" />
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
                Log in to your account
              </h3>
              <p className="">
                Don't have an account?{" "}
                <NavLink
                  to="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up
                </NavLink>
              </p>
            </div>
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
              password: Yup.string().required("Password is required"),
            })}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-5">
                <div>
                  <label className="font-medium">Email</label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <label className="font-medium">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
                >
                  Sign in
                </button>
                <div className="text-center">
                  <NavLink
                    to="/forgot-password"
                    className="hover:text-indigo-600"
                  >
                    Forgot password?
                  </NavLink>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </>
  );
};

export default LoginForm;
