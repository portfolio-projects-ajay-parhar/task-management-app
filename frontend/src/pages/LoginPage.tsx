import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { TextInput } from "../components/ui/TextInput";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { CheckSquare } from "lucide-react";

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await login(formData.email, formData.password);
    if (success) navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-violet-950/40 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-600 rounded-2xl mb-4 shadow-lg shadow-violet-200 dark:shadow-violet-900/40">
            <CheckSquare size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Sign in to your account
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <TextInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData((p) => ({ ...p, email: e.target.value }))
              }
              required
              autoComplete="email"
            />

            <TextInput
              label="Password"
              type="password"
              passwordToggle
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData((p) => ({ ...p, password: e.target.value }))
              }
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
