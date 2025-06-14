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
  const [filter, setFilter] = useState("all"); // "all", "new", "pending"
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
        setWorkers(workersRes.data);
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
      await axios.post("/api/test/assign", {
        complaintId,
        workerId,
        priority,
      });

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === complaintId
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

  const filteredComplaints = complaints.filter((c) => {
  if (filter === "new") return c.status === "submitted";
  if (filter === "pending") return c.status === "assigned" || c.status === "in progress";
  return true; // all
});


  if (status === "loading") {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-indigo-100">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">Manager Dashboard</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="space-x-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 mx-4 py-2 rounded ${
                filter === "all" ? "bg-blue-700 text-white" : "bg-gray-200"
              }`}
            >
              View All Complaints
            </button>
            <br/><br/>
            <button
              onClick={() => setFilter("new")}
              className={`px-4 py-2 rounded ${
                filter === "new" ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              View New Complaints
            </button>
            <br/><br/>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded ${
                filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"
              }`}
            >
              View Pending Complints
            </button>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-700 mb-4">
          View and manage complaints by assigning them to appropriate workers.
        </p>

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
                <th className="p-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map((c) => (
                <tr key={c.id} className="border-t text-sm">
                  <td className="p-2">{c.category}</td>
                  <td className="p-2">{c.description}</td>
                  <td className="p-2 capitalize">{c.status}</td>
                  <td className="p-2">
                    <select
                      value={assignmentInputs[c.id]?.priority || ""}
                      onChange={(e) =>
                        setAssignmentInputs((prev) => ({
                          ...prev,
                          [c.id]: {
                            ...(prev[c.id] || {}),
                            priority: e.target.value,
                          },
                        }))
                      }
                      disabled={c.status !== "submitted"}
                      className="border px-2 py-1 rounded"
                    >
                      <option value="">--</option>
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
                      disabled={c.status !== "submitted"}
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
                      disabled={c.status !== "submitted"}
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
              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No complaints to display.
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


