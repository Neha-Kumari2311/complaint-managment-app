// "use client";
// import { useState, useEffect } from "react";
// import axios from "@/lib/axios";
// import QRCode from "react-qr-code";
// import { signOut } from "next-auth/react";

// export default function ResidentDashboard() {
//   const [complaints, setComplaints] = useState([]);
//   const [form, setForm] = useState({
//     category: "",
//     description: "",
//     image: null,
//   });
//   useEffect(() => {
//     const fetchComplaints = async () => {
//       try {
//         const res = await axios.get("/api/test/getByUser");
//         setComplaints(res.data);
//       } catch (err) {
//         console.error("Error fetching complaints:", err);
//       }
//     };

//     fetchComplaints();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const formData = new FormData();
//       formData.append("category", form.category);
//       formData.append("description", form.description);
//       if (form.image) {
//         formData.append("image", form.image);
//       }

//       const res = await axios.post("/api/test/createComplaint", formData);
//       const result = res.data;

//       // ✅ Add new complaint to table
//       setComplaints((prev) => [result, ...prev]);

//       alert(
//         `Complaint submitted successfully!\nComplaint Code: ${result.complaintCode}`
//       );

//       setForm({ category: "", description: "", image: null });
//     } catch (err) {
//       console.error("Submit error:", err);
//       alert("Failed to submit complaint");
//     }
//   };
//   const handleDelete = async (id) => {
//     if (!id) {
//       alert("Invalid complaint ID");
//       return;
//     }

//     const confirmed = window.confirm(
//       "Are you sure you want to delete this complaint?"
//     );
//     if (!confirmed) return;

//     try {
//       await axios.delete(`/api/test/deleteComplaint?id=${id}`);
//       setComplaints((prev) => prev.filter((c) => c.id !== id)); // instantly remove from UI
//     } catch (err) {
//       console.error("Delete error:", err);
//       alert("Failed to delete complaint");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Resident Dashboard
//       </h1>
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => signOut({ callbackUrl: "/login" })}
//           className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Complaint Submission Form */}
//       <div className="bg-white rounded shadow p-4 mb-8">
//         <h2 className="text-xl font-semibold mb-4">Submit a Complaint</h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium">Category</label>
//             <select
//               name="category"
//               onChange={handleChange}
//               required
//               className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
//             >
//               <option value="" >
//                 -- Select Category --
//               </option>
//               <option value="Plumbing">Plumbing</option>
//               <option value="Electrical">Electrical</option>
//               <option value="Cleaning">Cleaning</option>
//               <option value="Carpentry">Carpentry</option>
//               <option value="Pest Control">Pest Control</option>
//               <option value="Painting">Painting</option>
//               <option value="HVAC">HVAC</option>
//               <option value="Gardening">Gardening</option>
//               <option value="Security">Security</option>
//               <option value="Other">Other</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Description</label>
//             <textarea
//               name="description"
//               onChange={handleChange}
//               rows={4}
//               placeholder="Write your complaint here..."
//               required
//               className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">
//               Photo Upload (optional)
//             </label>
//             <input
//               type="file"
//               name="image"
//               accept="image/*"
//               onChange={handleChange}
//               className="w-full mt-1"
//             />
//           </div>

//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Submit Complaint
//           </button>
//         </form>
//       </div>

//       {/* Placeholder for Complaints Table */}
//       <div>
//         <h2 className="text-lg font-semibold mt-6 mb-2">Your Complaints</h2>

//         <table className="w-full table-auto border border-gray-300 rounded-lg">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 text-left">Category</th>
//               <th className="px-4 py-2 text-left">Description</th>
//               <th className="px-4 py-2 text-left">Date</th>

//               <th className="px-4 py-2 text-left">Status</th>
//               <th className="px-4 py-2 text-left">Complaint Code</th>
//               <th className="px-4 py-2 text-left">QR Code</th>
//               <th className="p-2">Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {complaints.map((complaint, index) => (
//               <tr key={index} className="border-t border-gray-200">
//                 <td className="px-4 py-2">{complaint.category}</td>
//                 <td className="px-4 py-2">{complaint.description}</td>
//                 <td className="px-4 py-2 text-sm text-gray-600">
//                   {new Date(complaint.createdAt).toLocaleString()}
//                 </td>

//                 <td className="px-4 py-2 capitalize">{complaint.status}</td>
//                 <td className="px-4 py-2 text-xs">{complaint.complaintCode}</td>
//                 <td className="px-4 py-2">
//                   <QRCode
//                     value={complaint.complaintCode}
//                     style={{ height: "50px", width: "50px" }}
//                   />
//                 </td>
//                 <td className="p-2">
//                   <button
//                     onClick={() => handleDelete(complaint.id)}
//                     className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import QRCode from "react-qr-code";
import { signOut } from "next-auth/react";

export default function ResidentDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    category: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get("/api/test/getByUser");
        setComplaints(res.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      }
    };

    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("category", form.category);
      formData.append("description", form.description);
      if (form.image) {
        formData.append("image", form.image);
      }

      const res = await axios.post("/api/test/createComplaint", formData);
      const result = res.data;
      setComplaints((prev) => [result, ...prev]);
      alert(
        `Complaint submitted successfully!\nComplaint Code: ${result.complaintCode}`
      );
      setForm({ category: "", description: "", image: null });
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit complaint");
    }
  };

  const handleDelete = async (id) => {
    if (!id) return alert("Invalid complaint ID");
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/test/deleteComplaint?id=${id}`);
      setComplaints((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete complaint");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0fdfc] px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-[#62baac]">
            Submit a complaint
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Logout
          </button>
        </div>

        {/* Complaint Submission Form */}
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-[#d4f3ef]">
          {/* <h2 className="text-2xl font-bold text-[#333] mb-6">
            Submit a Complaint
          </h2> */}

          <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
            {/* Category */}
            <div className="col-span-2">
              <label className="block text-base font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                onChange={handleChange}
                required
                value={form.category}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#62baac]"
              >
                <option value="">-- Select Category --</option>
                <option className="text-[#25655b]" value="Plumbing">Plumbing</option>
                <option value="Electrical" className="text-[#25655b]">Electrical</option>
                <option value="Cleaning" className="text-[#25655b]">Cleaning</option>
                <option className="text-[#25655b]" value="Carpentry">Carpentry</option>
                <option className="text-[#25655b]" value="Pest Control">Pest Control</option>
                <option className="text-[#25655b]" value="Painting">Painting</option>
                <option className="text-[#25655b]"  value="HVAC">HVAC</option>
                <option className="text-[#25655b]"  value="Gardening">Gardening</option>
                <option className="text-[#25655b]" value="Security">Security</option>
                <option className="text-[#25655b]" value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-base font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                onChange={handleChange}
                value={form.description}
                placeholder="Describe your issue clearly..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#62baac]"
                required
              />
            </div>

            {/* Photo Upload */}
            <div className="col-span-2">
              <label className="block text-base font-medium text-gray-700 mb-1">
                Photo Upload (optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full file:rounded-lg file:bg-[#62baac] file:text-white file:px-4 file:py-2 file:cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#62baac] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#4ca297] transition"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        </div>

        {/* Complaints Table */}
        <div>
          <h1 className="text-4xl font-bold text-[#62baac]">
            Your Complaints
          </h1>
          <br/>
          <div className="overflow-x-auto">
            <table className="w-full table-auto bg-white shadow rounded-xl overflow-hidden">
              <thead className="bg-[#e6f6f3] text-[#333]">
                <tr>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Complaint Code</th>
                  <th className="px-4 py-2 text-left">QR Code</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{complaint.category}</td>
                    <td className="px-4 py-2">{complaint.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(complaint.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 capitalize">{complaint.status}</td>
                    <td className="px-4 py-2 text-xs">
                      {complaint.complaintCode}
                    </td>
                    <td className="px-4 py-2">
                      <QRCode
                        value={complaint.complaintCode}
                        style={{ height: "50px", width: "50px" }}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(complaint.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No complaints submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
