
"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaUserShield, FaEnvelope, FaPhone, FaLock, FaHome } from "react-icons/fa";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
    flatNumber: "",
    contact: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      ...form,
      redirect: false,
    });

    if (res.ok) {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      toast.success("Login successful!");

      if (session?.user?.role === "resident") {
        router.push("resident/dashboard");
      } else if (session?.user?.role === "manager") {
        router.push("manager/dashboard");
      } else if (session?.user?.role === "worker") {
        router.push("worker/dashboard");
      } else {
        router.push("/");
      }
    } else {
      toast.error(res.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fee9ff] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 sm:p-10 w-full max-w-md"
      >
        {/* 🔝 Icon Header */}
        <div className="text-center mb-6">
          <FaUserShield className="text-[#9659d0] text-5xl mx-auto mb-2" />
          <h2 className="text-3xl font-semibold text-[#9659d0]">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">Login to continue</p>
        </div>

        {/* 👤 Role Selection */}
        <div className="mb-4">
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#bc9fd3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9659d0]"
          >
            <option value="">Select Role</option>
            <option className="text-[#5b10a1]" value="resident">Resident</option>
            <option className="text-[#5b10a1]" value="manager">Manager</option>
            <option className="text-[#5b10a1]" value="worker">Worker</option>
          </select>
        </div>

        {/* Role-specific Inputs */}
        {form.role === "resident" ? (
          <>
            <div className="relative mb-3">
              <FaHome className="absolute left-3 top-3.5 text-[#9659d0]" />
              <input
                name="flatNumber"
                value={form.flatNumber}
                onChange={handleChange}
                placeholder="Flat Number"
                required
                className="w-full pl-10 p-3 border border-[#bc9fd3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9659d0]"
              />
            </div>
            <div className="relative mb-4">
              <FaPhone className="absolute left-3 top-3.5 text-[#9659d0]" />
              <input
                name="contact"
                type="tel"
                value={form.contact}
                onChange={handleChange}
                placeholder="Contact"
                required
                className="w-full pl-10 p-3 border border-[#bc9fd3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9659d0]"
              />
            </div>
          </>
        ) : (
          <>
            <div className="relative mb-3">
              <FaEnvelope className="absolute left-3 top-3.5 text-[#9659d0]" />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full pl-10 p-3 border border-[#bc9fd3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9659d0]"
              />
            </div>
            <div className="relative mb-4">
              <FaLock className="absolute left-3 top-3.5 text-[#9659d0]" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full pl-10 p-3 border border-[#bc9fd3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9659d0]"
              />
            </div>
          </>
        )}

        {/*  Login Button */}
        <button
          className="bg-[#9659d0] hover:bg-[#7a3eb2] text-white w-full py-3 rounded-xl font-medium transition"
        >
          Login
        </button>

        {/* Redirect */}
        <p className="text-center mt-5 text-base text-gray-700">
          Not registered?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-[#9659d0] underline cursor-pointer"
          >
            Sign up here
          </span>
        </p>
      </form>
    </div>
  );
}


