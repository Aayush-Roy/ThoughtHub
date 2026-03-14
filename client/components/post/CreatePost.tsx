"use client";

import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Post } from "@/types";

interface CreatePostProps {
  onCreated: (post: Post) => void;
}

export function CreatePost({ onCreated }: CreatePostProps) {
  const { request } = useApi();
  const [content, setContent]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const MAX = 280;

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const post = await request<Post>("/posts", {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      onCreated(post);
      setContent("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const remaining = MAX - content.length;

  return (
    <div className="border border-[#1e1e1e] bg-[#0f0f0f] rounded-sm p-4 mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, MAX))}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full bg-transparent text-[#e8e6e1] text-sm placeholder-[#333] resize-none outline-none font-display leading-relaxed"
      />

      {error && <p className="text-red-400 text-xs font-mono mt-1">{error}</p>}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#161616]">
        <span className={`text-xs font-mono ${remaining < 20 ? "text-red-400" : "text-[#444]"}`}>
          {remaining}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!content.trim() || loading}
          className="bg-[#e8ff47] text-[#0a0a0a] text-xs font-bold px-4 py-1.5 rounded-sm hover:bg-[#d4eb3a] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "posting..." : "post"}
        </button>
      </div>
    </div>
  );
}