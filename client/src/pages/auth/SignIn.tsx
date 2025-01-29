import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { Building2 } from "lucide-react"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext"
import axiosInstance from "@/config/axios"
import toast from 'react-hot-toast';


// Validation schema using Yup
const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required"),
});

export default function SignIn() {
  const { login } = useAuth();

  const handleSubmit = async (formData: {
    email: string;
    password: string;
  }) => {
    try {
      await axiosInstance.post(
        "/signin",
        formData,
      );
      login();
      toast.success('Login successful')
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
          <h1 className="mb-4 text-2xl md:text-3xl font-bold text-center">Welcome Back</h1>
          <p className="mb-4 text-md text-gray-600 text-center">Please enter your details to sign in.</p>
          {/* Formik integration */}
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={SignInSchema}
            onSubmit={async (values, {setSubmitting}) => {
              try {
                await handleSubmit(values)     
              } catch (error) {
                values = {
                  email: "",
                  password: "",
                }
              }finally {
                setSubmitting(false)
              }
              
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
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

                <Button className="w-full" type="submit" disabled={isSubmitting}>
                  Sign In
                </Button>
              </Form>
            )}
          </Formik>
        </div>
        <p className="text-center mx-auto w-[50%] text-sm text-gray-600">
          Create an account?{" "}
          <Link className="underline" to={"/signup"} >
            Sign Up
          </Link>{" "}
        </p>
      </div>
    </div>
  )
}