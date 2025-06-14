// "use client";
// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import axios from "@/lib/axios";

// export default function RegisterPage() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     role: "",
//     contact: "",
//     flatNumber: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post("/api/auth/register", form);

//       if (res.status === 200 || res.status === 201) {
//         alert("Registered successfully!");
//         router.push("/login");
//       } else {
//         alert("Registration failed.");
//       }
//     } catch (error) {
//       console.error("Registration Error:", error);
//       alert("Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white px-4">
      
      
//       <form
//         onSubmit={handleSubmit}
//         className="bg-indigo-300 shadow-xl rounded-xl p-8 sm:p-10 w-full max-w-md"
//       >
//         <h2 className="text-3xl font-semibold text-center text-blue-800 mb-6">
//           Register
//         </h2>

//         <input
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           required
//           placeholder="Name"
//           className="w-full mb-3 p-2 rounded"
//         />
//         <input
//           name="email"
//           type="email"
//           value={form.email}
//           onChange={handleChange}
//           required
//           placeholder="Email"
//           className="w-full mb-3 p-2 rounded"
//         />
//         <input
//           type="password"
//           name="password"
//           value={form.password}
//           onChange={handleChange}
//           required
//           placeholder="Password"
//           className="w-full mb-3 p-2 rounded"
//         />

//         <select
//           name="role"
//           value={form.role}
//           onChange={handleChange}
//           required
//           className="w-full mb-3 p-2 rounded"
//         >
//           <option value="">Select Role</option>
//           <option value="resident">Resident</option>
//           <option value="manager">Manager</option>
//           <option value="worker">Worker</option>
//         </select>

//         {form.role === "resident" && (
//           <input
//             name="flatNumber"
//             value={form.flatNumber}
//             onChange={handleChange}
//             placeholder="Flat Number"
//             required
//             className="w-full mb-3 p-2 rounded"
//           />
//         )}
//         {form.role === "worker" && (
//           <div>
//             <label className="block mb-1 font-medium">Specialisation</label>
//             <select
//               name="specialisation"
//               onChange={handleChange}
//               value={form.specialisation || ""}
//               required={form.role === "worker"}
//               className="w-full border rounded px-3 py-2"
//             >
//               <option value="">-- Select Specialisation --</option>
//               <option value="Plumbing">Plumbing</option>
//               <option value="Electrical">Electrical</option>
//               <option value="Cleaning">Cleaning</option>
//               <option value="Carpentry">Carpentry</option>
//               <option value="Pest Control">Pest Control</option>
//               <option value="Painting">Painting</option>
//               <option value="HVAC">HVAC (Heating, Ventilation, AC)</option>
//               <option value="Gardening">Gardening</option>
//               <option value="Security">Security</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>
//         )}

//         <input
//           name="contact"
//           value={form.contact}
//           onChange={handleChange}
//           placeholder="Contact Number"
//           required
//           className="w-full mb-4 p-2 rounded"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className={`${
//             loading ? "bg-gray-500" : "bg-blue-700 hover:bg-blue-900"
//           } text-white w-full py-2 rounded font-medium`}
//         >
//           {loading ? "Registering..." : "Register"}
//         </button>

//         <p className="text-center mt-4">
//           Already registered?{" "}
//           <span
//             className="text-blue-900 underline cursor-pointer"
//             onClick={() => router.push("/login")}
//           >
//             Login
//           </span>
//         </p>
//       </form>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "@/lib/axios";
import { FiUser, FiMail, FiLock, FiPhone, FiHome, FiBriefcase } from "react-icons/fi";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    contact: "",
    flatNumber: "",
    specialisation: "",
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fee9ff] px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#9659d0] mb-2">
          Report. Resolve. Relax.
        </h1>
        <p className="text-[#62baac] text-lg max-w-xl mx-auto">
          Quick reports. Fast actions. Peace of mind.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl px-8 py-10 w-full max-w-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-[#9659d0] mb-6">
          Create an Account
        </h2>

        <div className="space-y-4">
          <div className="flex items-center border border-[#bc9fd3] rounded-xl p-3">
            <FiUser className="text-[#5e2396] mr-3" />
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center border border-[#bc9fd3] rounded-xl p-3">
            <FiMail className="text-[#5e2396] mr-3" />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email Address"
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center border border-[#bc9fd3] rounded-xl p-3">
            <FiLock className="text-[#5e2396]  mr-3" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Password"
              className="w-full outline-none"
            />
          </div>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#bc9fd3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9659d0]"
          >
            <option value="">Select Role</option>
            <option className="text-[#9659d0]" value="resident">
              Resident
            </option>
            <option className="text-[#9659d0]" value="manager">
              Manager
            </option>
            <option className="text-[#9659d0]" value="worker">
              Worker
            </option>
          </select>

          {form.role === "resident" && (
            <div className="flex items-center border border-[#bc9fd3] rounded-xl p-3">
              <FiHome className="text-[#5e2396] mr-3" />
              <input
                name="flatNumber"
                value={form.flatNumber}
                onChange={handleChange}
                placeholder="Flat Number"
                required
                className="w-full outline-none"
              />
            </div>
          )}

          {form.role === "worker" && (
            <div className="flex items-center border border-[#bc9fd3] rounded-xl p-3">
              <FiBriefcase className="text-[#5e2396]  mr-3" />
              <select
                name="specialisation"
                onChange={handleChange}
                value={form.specialisation}
                required
                className="w-full outline-none bg-transparent"
              >
                <option value="">-- Select Specialisation --</option>
                <option className="text-[#9659d0]" value="Plumbing">Plumbing</option>
                <option className="text-[#9659d0]" value="Electrical">Electrical</option>
                <option className="text-[#9659d0]" value="Cleaning">Cleaning</option>
                <option className="text-[#9659d0]" value="Carpentry">Carpentry</option>
                <option className="text-[#9659d0]" value="Pest Control">Pest Control</option>
                <option className="text-[#9659d0]" value="Painting">Painting</option>
                <option className="text-[#9659d0]" value="HVAC">HVAC</option>
                <option className="text-[#9659d0]" value="Gardening">Gardening</option>
                <option className="text-[#9659d0]" value="Security">Security</option>
                <option className="text-[#9659d0]" value="Other">Other</option>
              </select>
            </div>
          )}

          <div className="flex items-center border border-[#bc9fd3] rounded-xl p-3">
            <FiPhone className="text-[#5e2396]  mr-3" />
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="Contact Number"
              required
              className="w-full outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-6 w-full py-3 text-white rounded-xl font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#9659d0] hover:bg-[#7d42b7]"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center mt-4 text-gray-700">
          Already registered?{" "}
          <span
            className="text-[#9659d0] underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}







