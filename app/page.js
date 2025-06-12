"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    contact: "",
    flatNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/register", form);
      
      if (res.status === 200 || res.status === 201) {
        alert("Registered successfully!");
        router.push("/login");
      } else {
        alert("Registration failed.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-indigo-300 shadow-xl rounded-xl p-8 sm:p-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">
          Register
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Name"
          className="w-full mb-3 p-2 rounded"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="w-full mb-3 p-2 rounded"
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Password"
          className="w-full mb-3 p-2 rounded"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          className="w-full mb-3 p-2 rounded"
        >
          <option value="">Select Role</option>
          <option value="resident">Resident</option>
          <option value="manager">Manager</option>
          <option value="worker">Worker</option>
        </select>

        {form.role === "resident" && (
          <input
            name="flatNumber"
            value={form.flatNumber}
            onChange={handleChange}
            placeholder="Flat Number"
            required
            className="w-full mb-3 p-2 rounded"
          />
        )}

        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          required
          className="w-full mb-4 p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-500" : "bg-blue-700 hover:bg-blue-900"
          } text-white w-full py-2 rounded font-medium`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-4">
          Already registered?{" "}
          <span
            className="text-blue-900 underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}


