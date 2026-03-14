"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";

export function FollowButton({ targetUserId }: { targetUserId: string }) {
  const { request } = useApi();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading]     = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await request<{ following: boolean }>(`/users/${targetUserId}/follow`, { method: "POST" });
      setFollowing(res.following);
    } catch {}
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs font-bold px-4 py-1.5 rounded-sm transition-all disabled:opacity-50 ${
        following
          ? "border border-[#333] text-[#555] hover:border-red-400 hover:text-red-400"
          : "bg-[#e8ff47] text-[#0a0a0a] hover:bg-[#d4eb3a]"
      }`}
    >
      {loading ? "..." : following ? "following" : "follow"}
    </button>
  );
}