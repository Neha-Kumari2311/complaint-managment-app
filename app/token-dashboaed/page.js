"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TokenDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "worker") {
      router.push("/");
    } else {
      fetchTokenBalance();
    }
  }, [status, session]);

  const fetchTokenBalance = async () => {
    try {
      const res = await axios.get("/api/test/tokens");
      setTokens(res.data.tokens);
    } catch (err) {
      console.error("Error fetching tokens:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = () => {
    alert("Redeem feature coming soon!");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen p-6 bg-indigo-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4 text-indigo-900">Token Balance</h1>
        <p className="text-4xl font-extrabold text-green-600 mb-4">{tokens ?? 0} 🪙</p>
        <button
          onClick={handleRedeem}
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Redeem Rewards
        </button>
      </div>
    </div>
  );
}
