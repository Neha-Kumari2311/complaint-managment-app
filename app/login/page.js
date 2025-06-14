// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { signIn, getSession } from "next-auth/react";
// import Link from "next/link";

// export default function LoginPage() {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     role: "",
//     flatNumber: "",
//     contact: "",
//   });
//   const [error, setError] = useState("");

//   const router = useRouter();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     const res = await signIn("credentials", {
//       ...form,
//       redirect: false,
//     });

//     if (res.ok) {
//       const sessionRes = await fetch("/api/auth/session");
//       const session = await sessionRes.json();
//       // const session = await getSession();

//       if (session?.user?.role === "resident") {
//         router.push("resident/dashboard");
//       } else if (session?.user?.role === "manager") {
//         router.push("manager/dashboard");
//       } else if (session?.user?.role === "worker") {
//         router.push("worker/dashboard");
//       } else {
//         router.push("/"); // fallback
//       }
//     } else {
//       setError(res.error || "Login failed. Please check your credentials.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-indigo-300 shadow-xl rounded-xl p-8 sm:p-10 w-full max-w-md"
//       >
//         <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">
//           Login
//         </h2>
//         {error && (
//           <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">
//             {error}
//           </div>
//         )}

//         <select
//           name="role"
//           value={form.role}
//           onChange={handleChange}
//           required
//           className="w-full mb-4 p-2 rounded"
//         >
//           <option value="">Select Role</option>
//           <option value="resident">Resident</option>
//           <option value="manager">Manager</option>
//           <option value="worker">Worker</option>
//         </select>

//         {form.role === "resident" ? (
//           <>
//             <input
//               name="flatNumber"
//               value={form.flatNumber}
//               onChange={handleChange}
//               placeholder="Flat Number"
//               required
//               className="w-full mb-3 p-2 rounded"
//             />
//             <input
//               name="contact"
//               value={form.contact}
//               onChange={handleChange}
//               placeholder="Contact"
//               required
//               className="w-full mb-4 p-2 rounded"
//             />
//           </>
//         ) : (
//           <>
//             <input
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="Email"
//               required
//               className="w-full mb-3 p-2 rounded"
//             />
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="Password"

//               required
//               className="w-full mb-4 p-2 rounded"
//             />
//           </>
//         )}

//         <button className="bg-blue-700 hover:bg-blue-900 text-white w-full py-2 rounded font-medium">
//           Login
//         </button>
//         <p className=" pl-24 mt-4 text-base text-gray-600">
//           Not registered?{" "}
//           <a
//             href="/"
//             className="text-blue-800 underline hover:underline font-medium"
//           >
//             Sign up here
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
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
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      ...form,
      redirect: false,
    });

    if (res.ok) {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

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
      setError(res.error || "Login failed. Please check your credentials.");
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

        {/* 🔴 Error Display */}
        {error && (
          <div className="bg-red-100 text-red-800 p-2 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

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
            <option  className="text-[#5b10a1]" value="manager">Manager</option>
            <option  className="text-[#5b10a1]" value="worker">Worker</option>
          </select>
        </div>

        {/* 🏠 Role-specific Inputs */}
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

        {/* 🔓 Login Button */}
        <button
          className="bg-[#9659d0] hover:bg-[#7a3eb2] text-white w-full py-3 rounded-xl font-medium transition"
        >
          Login
        </button>

        {/* 🔁 Redirect */}
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

