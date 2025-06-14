// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import QRScanner from "@/components/QRScanner";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { signOut } from "next-auth/react";

// export default function WorkerDashboard() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [showScanner, setShowScanner] = useState(false);
//   const [scanningComplaintId, setScanningComplaintId] = useState(null);
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//       return;
//     }

//     if (session?.user?.role !== "worker") {
//       router.push("/");
//       return;
//     }
//   }, [status, session]);

//   const fetchComplaints = async () => {
//     try {
//       const res = await axios.get("/api/test/worker");
//       setComplaints(
//         res.data.complaints.sort((a, b) => {
//           const order = { High: 1, Medium: 2, Low: 3 };
//           return order[a.priority] - order[b.priority];
//         })
//       );
//     } catch (err) {
//       console.error("Error fetching complaints:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchComplaints();
//   }, []);

//   const handleScanClick = (complaintId) => {
//     if (!showScanner && !scanningComplaintId) {
//       setScanningComplaintId(complaintId);
//       setShowScanner(true);
//     }
//   };

 
//   const handleQRResult = async (scannedCode) => {
//     console.log("Scanned complaintCode:", scannedCode);

//     try {
//       const res = await axios.get(
//         `/api/test/get-complaint?code=${scannedCode}`
//       );
//       const complaint = res.data;

//       if (!complaint) {
//         alert("Complaint not found or already resolved.");
//         return;
//       }

//       // ✅ Ensure it's actually assigned to this worker and in progress
//       if (complaint.status !== "in progress") {
//         alert("Complaint is not in progress.");
//         return;
//       }

//       // ✅ Update status using complaint.id (not complaintCode anymore)
//       await axios.patch("/api/test/update-status", {
//         id: complaint.id, // resolved by complaint.id
//         status: "resolved",
//         priority: complaint.priority, 
//       });

//       alert("Complaint marked as resolved!");
//       fetchComplaints(); // refresh table
//     } catch (error) {
//       console.error("❌ QR Scan Error:", error);
//       alert(
//         error?.response?.data?.message ||
//           "Failed to resolve complaint. Try again."
//       );
//     } finally {
//       setShowScanner(false);
//       setScanningComplaintId(null);
//     }
//   };

//   const handleAccept = async (id) => {
//     try {
//       await axios.patch("/api/test/update-status", {
//         id,
//         status: "in progress",
//       });
//       fetchComplaints();
//     } catch (err) {
//       console.error("Error updating complaint status:", err);
//     }
//   };

//   if (status === "loading" || loading) {
//     return <div className="text-center mt-10">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen p-6 bg-indigo-100 relative">
//       <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-6 text-blue-900">
//           Worker Dashboard
//         </h1>
//         <div className="mt-4 text-center">
//           <button
//             className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded"
//             onClick={() => router.push("/worker/tokens")}
//           >
//             Go to Token Dashboard
//           </button>
//         </div>
//         <div className="flex justify-end mb-4">
//           <button
//             onClick={() => signOut({ callbackUrl: "/login" })}
//             className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
//           >
//             Logout
//           </button>
//         </div>

//         {complaints.length === 0 ? (
//           <p className="text-gray-600">No complaints assigned yet.</p>
//         ) : (
//           <div className="space-y-4">
//             <h2 className="text-blue-800 text-lg">All Complaints</h2>
//             {complaints.map((c) => (
//               <div key={c.id} className="bg-gray-50 p-4 rounded-lg shadow">
//                 <p>
//                   <strong>Complaint Code:</strong> {c.complaintCode}
//                 </p>
//                 <p>
//                   <strong>Resident Name:</strong> {c.residentName}
//                 </p>
//                 <p>
//                   <strong>Contact No:</strong> {c.residentContact}
//                 </p>
//                 <p>
//                   <strong>Flat No:</strong> {c.residentFlat}
//                 </p>
//                 <p>
//                   <strong>Description:</strong> {c.description}
//                 </p>
//                 <p>
//                   <strong>Priority:</strong> {c.priority}
//                 </p>
//                 <p>
//                   <strong>Status:</strong> {c.status}
//                 </p>

//                 {c.status === "assigned" && (
//                   <button
//                     onClick={() => handleAccept(c.id)}
//                     className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     Accept Request
//                   </button>
//                 )}

//                 {c.status === "in progress" && (
//                   <div className="mt-3">
//                     <p className="text-green-600 font-semibold">In Progress</p>
//                     <button
//                       onClick={() => handleScanClick(c.id)}
//                       className="bg-green-600 text-white px-3 py-1 mt-2 rounded hover:bg-green-700"
//                     >
//                       Scan QR & Resolve
//                     </button>
//                   </div>
//                 )}

//                 {c.status === "resolved" && (
//                   <button
//                     disabled
//                     className="bg-gray-400 text-white px-3 py-1 mt-2 rounded cursor-not-allowed"
//                   >
//                     Resolved
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {showScanner && (
//         <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
//           <QRScanner
//             onScan={handleQRResult}
//             onClose={() => {
//               setShowScanner(false);
//               setScanningComplaintId(null);
//             }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import QRScanner from "@/components/QRScanner";
import { useEffect, useState } from "react";
import axios from "axios";
import { signOut } from "next-auth/react";

export default function WorkerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [scanningComplaintId, setScanningComplaintId] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "worker") {
      router.push("/");
    }
  }, [status, session]);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("/api/test/worker");
      setComplaints(
        res.data.complaints.sort((a, b) => {
          const order = { High: 1, Medium: 2, Low: 3 };
          return order[a.priority] - order[b.priority];
        })
      );
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleScanClick = (complaintId) => {
    if (!showScanner && !scanningComplaintId) {
      setScanningComplaintId(complaintId);
      setShowScanner(true);
    }
  };

  const handleQRResult = async (scannedCode) => {
    try {
      const res = await axios.get(
        `/api/test/get-complaint?code=${scannedCode}`
      );
      const complaint = res.data;

      if (!complaint || complaint.status !== "in progress") {
        alert("Invalid or already resolved complaint.");
        return;
      }

      await axios.patch("/api/test/update-status", {
        id: complaint.id,
        status: "resolved",
        priority: complaint.priority,
      });

      alert("Complaint marked as resolved!");
      fetchComplaints();
    } catch (error) {
      console.error("QR Scan Error:", error);
      alert("Failed to resolve complaint. Try again.");
    } finally {
      setShowScanner(false);
      setScanningComplaintId(null);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.patch("/api/test/update-status", {
        id,
        status: "in progress",
      });
      fetchComplaints();
    } catch (err) {
      console.error("Error accepting complaint:", err);
    }
  };

  if (status === "loading" || loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-[#e0f2f1] relative">
      <div className="bg-white shadow-xl rounded-xl p-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-[#62baac]">
            👷‍♂️ Worker Dashboard
          </h1>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Logout
          </button>
        </div>

        <div className="flex justify-end mb-6">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
            onClick={() => router.push("/worker/tokens")}
          >
            🎁 View Token Dashboard
          </button>
        </div>

        {complaints.length === 0 ? (
          <p className="text-gray-600">No complaints assigned yet.</p>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-800">
              Assigned Complaints
            </h2>

            {complaints.map((c) => (
              <div
                key={c.id}
                className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p>
                    <strong>Code:</strong> {c.complaintCode}
                  </p>
                  <p>
                    <strong>Priority:</strong>{" "}
                    <span
                      className={`font-semibold ${
                        c.priority === "High"
                          ? "text-red-600"
                          : c.priority === "Medium"
                          ? "text-orange-500"
                          : "text-green-600"
                      }`}
                    >
                      {c.priority}
                    </span>
                  </p>
                  <p>
                    <strong>Resident:</strong> {c.residentName}
                  </p>
                  <p>
                    <strong>Flat No.:</strong> {c.residentFlat}
                  </p>
                  <p>
                    <strong>Contact:</strong> {c.residentContact}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="capitalize">{c.status}</span>
                  </p>
                  <p className="col-span-2">
                    <strong>Description:</strong> {c.description}
                  </p>
                </div>

                <div className="mt-4">
                  {c.status === "assigned" && (
                    <button
                      onClick={() => handleAccept(c.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Accept Request
                    </button>
                  )}

                  {c.status === "in progress" && (
                    <button
                      onClick={() => handleScanClick(c.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Scan QR & Resolve
                    </button>
                  )}

                  {c.status === "resolved" && (
                    <button
                      disabled
                      className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                    >
                      Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <QRScanner
            onScan={handleQRResult}
            onClose={() => {
              setShowScanner(false);
              setScanningComplaintId(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
