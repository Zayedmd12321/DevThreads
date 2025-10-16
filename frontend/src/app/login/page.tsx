import LoginHeader from "@/components/LoginHeader";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[rgb(var(--bg))] p-4">
      <div className="w-full max-w-md">
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
}