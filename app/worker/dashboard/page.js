"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If not logged in, redirect to login
    if (status === "unauthenticated") {
      router.push("/login");
    }

    // If logged in but not a worker, redirect away
    if (session?.user?.role !== "worker") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-blue-900">Worker Dashboard</h1>
        <p className="text-gray-700">You can see your assigned tasks here.</p>
      </div>
    </div>
  );
}

