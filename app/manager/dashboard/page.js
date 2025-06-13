"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { signOut } from "next-auth/react";

export default function ManagerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [assignmentInputs, setAssignmentInputs] = useState({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.role !== "manager") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const complaintsRes = await axios.get("/api/test/getAll");
        setComplaints(complaintsRes.data);

        const workersRes = await axios.get("/api/workers/list");
        setWorkers(workersRes.data); // [{id, name, specialization}]
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const handleAssign = async (complaintId, workerId, priority) => {
    if (!workerId || !priority) {
      alert("Please select both worker and priority");
      return;
    }

    try {
      console.log("Sending to API:", { complaintId, workerId, priority });
      await axios.post("/api/test/assign", {
        complaintId,
        workerId,
        priority,
      });

      // Update local UI without reload
      setComplaints((prev) =>
        prev.map((c) =>
          c.id == complaintId
            ? {
                ...c,
                status: "assigned",
                priority,
                assignedTo: workerId,
                assignedAt: new Date().toISOString(),
              }
            : c
        )
      );
    } catch (err) {
      console.error("Assign error:", err);
      alert("Assignment failed");
    }
  };

  if (status === "loading") {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-indigo-100">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">
          Manager Dashboard
        </h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
        <p className="text-gray-700 mb-6">
          View all complaints and assign them to appropriate workers.
        </p>
        <button
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => setShowOnlyNew((prev) => !prev)}
        >
          {showOnlyNew ? "Show All Complaints" : "View New Complaints"}
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                <th className="p-2">Category</th>
                <th className="p-2">Description</th>
                <th className="p-2">Status</th>
                <th className="p-2">Priority</th>
                <th className="p-2">Assign To</th>
                <th className="p-2">Action</th>
                <th className="p-2">Assigned At</th>
              </tr>
            </thead>
            <tbody>
              {complaints
                .filter((c) => (showOnlyNew ? c.status === "submitted" : true))
                .map((c) => (
                  <tr key={c.id} className="border-t text-sm">
                    <td className="p-2">{c.category}</td>
                    <td className="p-2">{c.description}</td>
                    <td className="p-2 capitalize">{c.status}</td>
                    <td className="p-2">
                      <select
                        value={assignmentInputs[c.id]?.priority }
                        onChange={(e) =>
                          setAssignmentInputs((prev) => ({
                            ...prev,
                            [c.id]: {
                              ...(prev[c.id] || {}),
                              priority: e.target.value,
                            },
                          }))
                        }
                        disabled={
                          c.status === "assigned" || c.status === "resolved"
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option  value="">--</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <select
                        defaultValue={c.assignedTo || ""}
                        onChange={(e) =>
                          setAssignmentInputs((prev) => ({
                            ...prev,
                            [c.id]: {
                              ...(prev[c.id] || {}),
                              workerId: e.target.value,
                            },
                          }))
                        }
                        disabled={
                          c.status === "assigned" || c.status === "resolved"
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="">--</option>
                        {workers
                          .filter((w) => w.specialisation === c.category)
                          .map((w) => (
                            <option key={w.id} value={w.id}>
                              {w.name}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          const input = assignmentInputs[c.id];
                          if (!input?.workerId || !input?.priority) {
                            alert("Please select both priority and a worker.");
                            return;
                          }
                          handleAssign(c.id, input.workerId, input.priority);
                        }}
                        disabled={
                          c.status === "assigned" || c.status === "resolved"
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Assign
                      </button>
                    </td>

                    <td className="p-2 text-xs text-gray-600">
                      {new Date(c.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              {complaints.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No complaints available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
