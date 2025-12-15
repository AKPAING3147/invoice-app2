"use client"

import { useForm } from "react-hook-form"
import Link from "next/link"
import { signup } from "@/app/service/auth/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type SignupFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export function SignupForm() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>()

  const password = watch("password")

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup(
        data.name,
        data.email,
        data.password,
        data.confirmPassword
      )

      // success (redirect later)
      console.log("Signup success")
    } catch (error: any) {
      if (error?.errors) {
        Object.entries(error.errors).forEach(([field, messages]: any) => {
          setError(field as any, {
            type: "server",
            message: messages[0],
          })
        })
      }
    }
  }

  return (
    <Card className="max-w-sm w-full">
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>Register new account</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input {...register("name", { required: "Name is required" })} />
              {errors.name && (
                <FieldDescription className="text-destructive">
                  {errors.name.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <FieldDescription className="text-destructive">
                  {errors.email.message}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Min 8 chars" },
                })}
              />
            </Field>

            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                type="password"
                {...register("confirmPassword", {
                  validate: (v) => v === password || "Passwords do not match",
                })}
              />
            </Field>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="
    w-full
    h-11
    font-semibold
    transition-all
    duration-200
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Sign up"
              )}
            </Button>


            <FieldDescription className="text-center">
              Already have account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </FieldDescription>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
