import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { TextInput } from "../components/ui/TextInput";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { CheckSquare, Check } from "lucide-react";

export const RegisterPage = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const passwordChecks = [
    { label: "At least 8 characters", pass: formData.password.length >= 8 },
    {
      label: "One uppercase letter",
      pass: /[A-Z]/.test(formData.password),
    },
    {
      label: "One lowercase letter",
      pass: /[a-z]/.test(formData.password),
    },
    { label: "One number", pass: /\d/.test(formData.password) },
  ];

  const isPasswordValid = passwordChecks.every((c) => c.pass);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    const success = await register(
      formData.name,
      formData.email,
      formData.password
    );
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
            Create account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Start managing your tasks today
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <TextInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
              required
              autoComplete="name"
            />

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

            <div>
              <TextInput
                label="Password"
                type="password"
                passwordToggle
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, password: e.target.value }))
                }
                required
                autoComplete="new-password"
              />

              {formData.password && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {passwordChecks.map((check) => (
                    <div
                      key={check.label}
                      className={`flex items-center gap-1.5 text-xs ${
                        check.pass
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400"
                      }`}
                    >
                      <Check
                        size={12}
                        className={
                          check.pass
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-300 dark:text-gray-600"
                        }
                      />
                      {check.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!isPasswordValid && formData.password.length > 0}
              className="w-full"
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
