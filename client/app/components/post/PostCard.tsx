"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Post } from "@/types";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  currentDbUserId?: string;
  hasLiked?: boolean;
  onDelete?: (id: string) => void;
}

export function PostCard({ post, currentDbUserId, hasLiked = false, onDelete }: PostCardProps) {
  const { request } = useApi();
  const { user } = useUser();
  const [liked, setLiked]       = useState(hasLiked);
  const [likeCount, setLikeCount] = useState(post._count?.likes ?? 0);
  const [deleting, setDeleting] = useState(false);

  const isOwner = currentDbUserId === post.authorId;

  const handleLike = async () => {
    try {
      const res = await request<{ liked: boolean }>(`/posts/${post.id}/like`, { method: "POST" });
      setLiked(res.liked);
      setLikeCount((c) => res.liked ? c + 1 : c - 1);
    } catch {}
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      await request(`/posts/${post.id}`, { method: "DELETE" });
      onDelete?.(post.id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <article className="border border-[#1e1e1e] bg-[#0f0f0f] rounded-sm p-5 hover:border-[#2a2a2a] transition-colors group">

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <Link href={`/profile/${post.author.username}`} className="flex items-center gap-2.5">
          {post.author.imageUrl ? (
            <Image
              src={post.author.imageUrl}
              alt={post.author.username}
              width={32}
              height={32}
              className="rounded-full grayscale group-hover:grayscale-0 transition-all"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center text-xs font-mono text-[#666]">
              {post.author.username[0].toUpperCase()}
            </div>
          )}
          <div>
            <span className="text-sm font-semibold text-[#e8e6e1] hover:text-[#e8ff47] transition-colors">
              {post.author.name || post.author.username}
            </span>
            <span className="text-xs text-[#555] ml-2 font-mono">@{post.author.username}</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <time className="text-xs text-[#444] font-mono">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </time>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs text-[#444] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              {deleting ? "..." : "delete"}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <Link href={`/post/${post.id}`}>
        <p className="text-[#ccc] text-sm leading-relaxed mb-4 hover:text-[#e8e6e1] transition-colors">
          {post.content}
        </p>
        {post.imageUrl && (
          <div className="mb-4 rounded-sm overflow-hidden border border-[#1e1e1e]">
            <Image src={post.imageUrl} alt="Post image" width={600} height={400} className="w-full object-cover" />
          </div>
        )}
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-5 pt-2 border-t border-[#161616]">
        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${
            liked ? "text-[#e8ff47]" : "text-[#555] hover:text-[#888]"
          }`}
        >
          <span>{liked ? "▲" : "△"}</span>
          <span>{likeCount}</span>
        </button>

        {/* Comments */}
        <Link
          href={`/post/${post.id}`}
          className="flex items-center gap-1.5 text-xs font-mono text-[#555] hover:text-[#888] transition-colors"
        >
          <span>◇</span>
          <span>{post._count?.comments ?? 0}</span>
        </Link>
      </div>
    </article>
  );
}