import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FormInformation, FormErrors, Response } from "./LoginPage";
import keys from "../constants/keys";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormInformation>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>("");

  const validateSignupForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters.";
    }
    if (formData.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setApiError("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!validateSignupForm()) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`${keys.APP_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Signup failed. Please try again.");
      }

      const data: Response = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/tasks");
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {apiError && (
          <p className="text-red-500 text-center mb-4">{apiError}</p>
        )}

        <label className="block font-medium">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter Username"
          className={`w-full p-2 border rounded mb-2 focus:outline-blue-500 ${
            errors.username ? "border-red-500" : ""
          }`}
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username}</p>
        )}

        <label className="block font-medium mt-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Password"
          className={`w-full p-2 border rounded mb-2 focus:outline-blue-500 ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
