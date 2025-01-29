import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Building2 } from "lucide-react"
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik"
import toast from "react-hot-toast"
import axiosInstance from "@/config/axios"

// Validation schema using Yup
const SignUpSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref('password'), null as any], "Passwords must match"),
});

export default function Signup() {
  const navigate = useNavigate();
  const handleSubmit = async (formData: {
    email: string;
    password: string;
  }) => {
    try {
      await axiosInstance.post(
        "/signup",
        formData,
      );
      toast.success('User registered successfully')
      navigate('/signin');
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side */}
      <div className="hidden w-1/2 bg-black text-white lg:block">
        <div className="flex h-full flex-col justify-between p-8">
          <div className="flex items-center space-x-2">
            <Building2 />
            <span className="text-xl font-bold">Offbeat Inc</span>
          </div>
          <div className="max-w-md">
            <p className="mb-2 text-lg font-medium">
              "This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before."
            </p>
            <p className="font-medium">Sofia Davis</p>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex w-full flex-col justify-center p-8 lg:w-1/2 gap-4">
        <div className="mx-auto w-full max-w-md">
          <h1 className="mb-4 text-2xl md:text-3xl font-bold text-center">Create an account</h1>
          <p className="mb-4 text-md text-center text-gray-600">Fill in the details below to create your account</p>
          {/* Formik integration */}
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={SignUpSchema}
            onSubmit={async (values) => {
              console.log(values);

              await handleSubmit(values)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Field
                    as={Input}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  Sign Up
                </Button>
              </Form>
            )}
          </Formik>
        </div>
        <p className="text-center mx-auto w-[50%] text-sm text-gray-600">
          Already have an account?{" "}
          <Link className="underline" to={"/signin"} >
            Sign In
          </Link>{" "}


        </p>
      </div>
    </div>
  )
}