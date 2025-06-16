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
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeemStatus, setRedeemStatus] = useState("");
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "worker") {
      router.push("/");
    } else {
      fetchBalance();
      fetchRewards();
    }
  }, [status, session]);
  const fetchRewards = async () => {
    try {
      const res = await axios.get("/api/rewards");
      setRewards(res.data || []);
    } catch (err) {
      console.error("Error fetching rewards", err);
      alert("Could not load rewards.");
    }
  };

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
    if (!selectedReward) {
      alert("Please select a reward to redeem.");
      return;
    }

    if (selectedReward.cost > tokenBalance) {
      alert("Not enough tokens for this reward.");
      return;
    }

    const confirmed = confirm(
      `Redeem ${selectedReward.name} for ${selectedReward.cost} tokens?`
    );
    if (!confirmed) return;

    try {
      const res = await axios.post("/api/tokens/reedem", {
        tokensToRedeem: selectedReward.cost,
        rewardName: selectedReward.name,
      });

      if (res.status === 200) {
        setTokenBalance(res.data.remaining);
        setRedeemStatus(`🎉 Redeemed ${selectedReward.name} successfully!`);
        setSelectedReward(null);
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
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4">
      <div className="bg-white shadow-md rounded-xl p-8 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-yellow-700 mb-4">Your Tokens</h2>
        <p className="text-4xl font-extrabold text-gray-800 mb-6">
          {tokenBalance} 🪙
        </p>

        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Available Rewards:
        </h3>
        <ul className="space-y-2 mb-4">
          {rewards.map((reward) => (
            <li key={reward.name}>
              <button
                className={`w-full px-4 py-2 rounded border ${
                  selectedReward?.name === reward.name
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-yellow-800 border-yellow-500"
                } hover:bg-yellow-500 hover:text-white`}
                onClick={() => setSelectedReward(reward)}
              >
                {reward.name} — {reward.cost} 🪙
              </button>
            </li>
          ))}
        </ul>

        <button
          className={`w-full py-2 rounded ${
            selectedReward && selectedReward.cost <= tokenBalance
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
          onClick={handleRedeem}
          disabled={!selectedReward || selectedReward.cost > tokenBalance}
        >
          Redeem Selected Reward
        </button>

        {redeemStatus && (
          <p className="mt-4 text-green-700 font-medium">{redeemStatus}</p>
        )}
      </div>
    </div>
  );
}
