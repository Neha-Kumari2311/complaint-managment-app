"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ResidentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.role !== "resident") {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-blue-900">Resident Dashboard</h1>
        <p className="text-gray-700">
          Welcome to your dashboard. Here you can submit and track complaints.
        </p>
      </div>
    </div>
  );
}



