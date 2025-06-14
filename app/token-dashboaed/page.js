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
  const [rewards, setRewards] = useState([]);

  
  const fetchRewards = async () => {
  try {
    const res = await axios.get("/api/rewards");
    setRewards(res.data || []);
  } catch (err) {
    console.error("Error fetching rewards", err);
    alert("Could not load rewards");
  }
};


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "worker") {
      router.push("/");
    } else {
      fetchTokenBalance();
       fetchRewards();
    }
  }, [status, session]);

  const fetchTokenBalance = async () => {
    try {
      const res = await axios.get("/api/tokens/balance");
      setTokens(res.data.totalTokens || 0);
    } catch (err) {
      console.error("Error fetching tokens:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (tokensToRedeem, rewardName) => {
    try {
      const res = await axios.post("/api/tokens/redeem", {
        tokensToRedeem,
        rewardName,
      });

      alert(`Successfully redeemed: ${rewardName}`);
      // Update token balance
      setTokens((prev) => prev - tokensToRedeem);
    } catch (err) {
      console.error("Redeem failed:", err);
      alert(err.response?.data?.message || "Redeem failed");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2 text-indigo-800">
        Available Rewards
      </h2>
      <div className="space-y-4">
        {rewardsList.map((reward) => (
          <div
            key={reward.id}
            className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded shadow"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-800">{reward.name}</h3>
              <p className="text-sm text-gray-600">
                {reward.tokens} 🪙 required
              </p>
            </div>
            <button
              onClick={() => handleRedeem(reward.tokens, reward.name)}
              disabled={tokens < reward.tokens}
              className={`px-4 py-1 rounded text-white ${
                tokens >= reward.tokens
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Redeem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
