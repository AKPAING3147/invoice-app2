import { LoginForm } from "@/components/login-form";
import { PublicNav } from "@/components/public-nav";

export default function Page() {
  return (
    <div className="min-h-svh w-full flex flex-col">
      <PublicNav />
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
