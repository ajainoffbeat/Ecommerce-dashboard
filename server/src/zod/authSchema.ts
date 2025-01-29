import {z} from "zod"

export const signUpSchema = z.object({
    name: z.string().min(5),
    password: z.string().min(8, "password atleast 8 charaters"),
    confirmPassword: z.string(),
    email: z.string().email("invalid email")
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'], // field to attach the error message
    message: "Passwords do not match",
});

export const signInSchema = z.object({
    email: z.string().email("invalid email"),
    password: z.string()
})