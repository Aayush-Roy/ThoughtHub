"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { Comment } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  postId: string;
  initialComments: Comment[];
  currentDbUserId?: string;
}

export function CommentSection({ postId, initialComments, currentDbUserId }: CommentSectionProps) {
  const { request } = useApi();
  const [comments, setComments]   = useState<Comment[]>(initialComments);
  const [content, setContent]     = useState("");
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    try {
      const comment = await request<Comment>(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      });
      setComments((c) => [...c, comment]);
      setContent("");
    } catch {}
    setLoading(false);
  };

  const handleDelete = async (commentId: string) => {
    try {
      await request(`/comments/${commentId}`, { method: "DELETE" });
      setComments((c) => c.filter((x) => x.id !== commentId));
    } catch {}
  };

  return (
    <div className="mt-8">
      <h3 className="text-xs font-mono text-[#555] uppercase tracking-widest mb-4">
        {comments.length} comment{comments.length !== 1 ? "s" : ""}
      </h3>

      {/* Input */}
      {currentDbUserId && (
        <div className="border border-[#1e1e1e] rounded-sm p-3 mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            rows={2}
            className="w-full bg-transparent text-sm text-[#e8e6e1] placeholder-[#333] resize-none outline-none"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || loading}
              className="text-xs bg-[#e8ff47] text-[#0a0a0a] font-bold px-3 py-1 rounded-sm hover:bg-[#d4eb3a] disabled:opacity-30 transition-all"
            >
              {loading ? "..." : "reply"}
            </button>
          </div>
        </div>
      )}
{/* {fuck vercel} */}
      {/* List */}
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3 group">
            {c.author.imageUrl ? (
              <Image src={c.author.imageUrl} alt={c.author.username} width={24} height={24} className="rounded-full mt-0.5 flex-shrink-0" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#1e1e1e] flex items-center justify-center text-xs font-mono text-[#555] flex-shrink-0 mt-0.5">
                {c.author.username[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <Link href={`/profile/${c.author.username}`} className="text-xs font-semibold text-[#aaa] hover:text-[#e8ff47] transition-colors">
                  @{c.author.username}
                </Link>
                <time className="text-xs font-mono text-[#444]">
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </time>
                {currentDbUserId === c.author.id && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs text-[#333] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-auto"
                  >
                    del
                  </button>
                )}
              </div>
              <p className="text-sm text-[#888] leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-xs font-mono text-[#333]">no comments yet.</p>
        )}
      </div>
    </div>
  );
}