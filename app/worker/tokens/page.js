"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function TokenDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "worker") {
      router.push("/");
    } else {
      fetchBalance();
    }
  }, [status, session]);

  const fetchBalance = async () => {
    try {
      const res = await axios.get("/api/tokens/balance");
      setTokenBalance(res.data.totalTokens || 0);
    } catch (err) {
      console.error("Error fetching token balance", err);
      alert("Could not fetch token balance");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    const confirmed = confirm("Are you sure you want to redeem all tokens?");
    if (!confirmed || tokenBalance <= 0) return;

    try {
      const res = await axios.post("/api/tokens/redeem", {
        tokensToRedeem: tokenBalance,
      });

      if (res.status === 200) {
        alert("Tokens redeemed successfully!");
        // Update the balance with returned value
        setTokenBalance(res.data.remaining);
      }
    } catch (err) {
      console.error("Error redeeming tokens", err);
      alert("Redemption failed. Try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="bg-white shadow-md rounded-xl p-8 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-yellow-700 mb-4">Your Tokens</h2>
        <p className="text-4xl font-extrabold text-gray-800 mb-6">
          {tokenBalance} Tokens
        </p>
        <button
          className={`${
            tokenBalance > 0
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          } text-white px-5 py-2 rounded`}
          onClick={handleRedeem}
          disabled={tokenBalance <= 0}
        >
          Redeem Rewards
        </button>
      </div>
    </div>
  );
}



