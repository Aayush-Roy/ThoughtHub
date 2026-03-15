// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";
// import { useApi } from "@/hooks/useApi";
// import { Post } from "@/types";
// import { useUser } from "@clerk/nextjs";
// import { formatDistanceToNow } from "date-fns";

// interface PostCardProps {
//   post: Post;
//   currentDbUserId?: string;
//   hasLiked?: boolean;
//   onDelete?: (id: string) => void;
// }

// export function PostCard({ post, currentDbUserId, hasLiked = false, onDelete }: PostCardProps) {
//   const { request } = useApi();
//   const { user } = useUser();
//   const [liked, setLiked]       = useState(hasLiked);
//   const [likeCount, setLikeCount] = useState(post._count?.likes ?? 0);
//   const [deleting, setDeleting] = useState(false);

//   const isOwner = currentDbUserId === post.authorId;

//   const handleLike = async () => {
//     try {
//       const res = await request<{ liked: boolean }>(`/posts/${post.id}/like`, { method: "POST" });
//       setLiked(res.liked);
//       setLikeCount((c) => res.liked ? c + 1 : c - 1);
//     } catch {}
//   };

//   const handleDelete = async () => {
//     if (!confirm("Delete this post?")) return;
//     setDeleting(true);
//     try {
//       await request(`/posts/${post.id}`, { method: "DELETE" });
//       onDelete?.(post.id);
//     } catch {
//       setDeleting(false);
//     }
//   };

//   return (
//     <article className="border border-[#1e1e1e] bg-[#0f0f0f] rounded-sm p-5 hover:border-[#2a2a2a] transition-colors group">

//       {/* Header */}
//       <div className="flex items-start justify-between mb-3">
//         <Link href={`/profile/${post.author.username}`} className="flex items-center gap-2.5">
//           {post.author.imageUrl ? (
//             <Image
//               src={post.author.imageUrl}
//               alt={post.author.username}
//               width={32}
//               height={32}
//               className="rounded-full grayscale group-hover:grayscale-0 transition-all"
//             />
//           ) : (
//             <div className="w-8 h-8 rounded-full bg-[#1e1e1e] flex items-center justify-center text-xs font-mono text-[#666]">
//               {post.author.username[0].toUpperCase()}
//             </div>
//           )}
//           <div>
//             <span className="text-sm font-semibold text-[#e8e6e1] hover:text-[#e8ff47] transition-colors">
//               {post.author.name || post.author.username}
//             </span>
//             <span className="text-xs text-[#555] ml-2 font-mono">@{post.author.username}</span>
//           </div>
//         </Link>

//         <div className="flex items-center gap-3">
//           <time className="text-xs text-[#444] font-mono">
//             {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
//           </time>
//           {isOwner && (
//             <button
//               onClick={handleDelete}
//               disabled={deleting}
//               className="text-xs text-[#444] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
//             >
//               {deleting ? "..." : "delete"}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Content */}
//       <Link href={`/post/${post.id}`}>
//         <p className="text-[#ccc] text-sm leading-relaxed mb-4 hover:text-[#e8e6e1] transition-colors">
//           {post.content}
//         </p>
//         {post.imageUrl && (
//           <div className="mb-4 rounded-sm overflow-hidden border border-[#1e1e1e]">
//             <Image src={post.imageUrl} alt="Post image" width={600} height={400} className="w-full object-cover" />
//           </div>
//         )}
//       </Link>

//       {/* Actions */}
//       <div className="flex items-center gap-5 pt-2 border-t border-[#161616]">
//         {/* Like */}
//         <button
//           onClick={handleLike}
//           className={`flex items-center gap-1.5 text-xs font-mono transition-colors ${
//             liked ? "text-[#e8ff47]" : "text-[#555] hover:text-[#888]"
//           }`}
//         >
//           <span>{liked ? "▲" : "△"}</span>
//           <span>{likeCount}</span>
//         </button>

//         {/* Comments */}
//         <Link
//           href={`/post/${post.id}`}
//           className="flex items-center gap-1.5 text-xs font-mono text-[#555] hover:text-[#888] transition-colors"
//         >
//           <span>◇</span>
//           <span>{post._count?.comments ?? 0}</span>
//         </Link>
//       </div>
//     </article>
//   );
// }
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { Post } from "@/types";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { 
  Heart, 
  MessageCircle, 
  MoreHorizontal,
  Trash2,
  Clock,
  Sparkles
} from "lucide-react";

interface PostCardProps {
  post: Post;
  currentDbUserId?: string;
  hasLiked?: boolean;
  onDelete?: (id: string) => void;
}

export function PostCard({ post, currentDbUserId, hasLiked = false, onDelete }: PostCardProps) {
  const { request } = useApi();
  const { user } = useUser();
  const [liked, setLiked] = useState(hasLiked);
  const [likeCount, setLikeCount] = useState(post._count?.likes ?? 0);
  const [deleting, setDeleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const isOwner = currentDbUserId === post.author.id;
  

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
    <article className="bg-[#FDF8F2] border border-[#E8D9C9] rounded-lg p-5 hover:border-[#9D7E5E] transition-all duration-300 hover:shadow-lg group relative">
      
      {/* Decorative corner accent */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#9D7E5E] opacity-0 group-hover:opacity-100 transition-opacity rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#9D7E5E] opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-lg" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <Link href={`/profile/${post.author.username}`} className="flex items-center gap-3 group/author">
          <div className="relative">
            {post.author.imageUrl ? (
              <Image
                src={post.author.imageUrl}
                alt={post.author.username}
                width={40}
                height={40}
                className="rounded-full border-2 border-[#E8D9C9] group-hover/author:border-[#9D7E5E] transition-colors"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9D7E5E] to-[#7A5C3E] flex items-center justify-center text-white text-sm font-medium border-2 border-[#E8D9C9] group-hover/author:border-[#9D7E5E] transition-colors">
                {post.author.username[0].toUpperCase()}
              </div>
            )}
            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#9D7E5E] border-2 border-[#FDF8F2] rounded-full" />
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-serif text-[#4A3A2A] group-hover/author:text-[#9D7E5E] transition-colors">
                {post.author.name || post.author.username}
              </span>
              {post.author.name && (
                <span className="text-xs font-mono text-[#7A5C3E] bg-[#E8D9C9] px-2 py-0.5 rounded-full">
                  @{post.author.username}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-0.5">
              <Clock className="w-3 h-3 text-[#7A5C3E]" />
              <time className="text-xs font-mono text-[#7A5C3E]">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </time>
              
              {/* Random sparkle for new posts (within last hour) */}
              {Date.now() - new Date(post.createdAt).getTime() < 3600000 && (
                <Sparkles className="w-3 h-3 text-[#9D7E5E]" />
              )}
            </div>
          </div>
        </Link>

        {/* Options dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-1.5 text-[#7A5C3E] hover:text-[#4A3A2A] hover:bg-[#E8D9C9] rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showOptions && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowOptions(false)}
              />
              <div className="absolute right-0 mt-1 w-32 bg-[#FDF8F2] border border-[#E8D9C9] rounded-lg shadow-lg z-20 py-1">
                {isOwner && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full px-3 py-1.5 text-left text-xs font-mono text-red-600 hover:bg-[#E8D9C9] flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <Link href={`/post/${post.id}`} className="block group/content">
        <div className="mb-4 pl-2 border-l-2 border-[#E8D9C9] group-hover/content:border-[#9D7E5E] transition-colors">
          <p className="text-[#4A3A2A] text-sm leading-relaxed">
            {post.content}
          </p>
        </div>
        
        {post.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden border border-[#E8D9C9] group-hover/content:border-[#9D7E5E] transition-colors">
            <Image 
              src={post.imageUrl} 
              alt="Post image" 
              width={600} 
              height={400} 
              className="w-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
      </Link>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E8D9C9]">
        <div className="flex items-center gap-4">
          {/* Like button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
              liked 
                ? "bg-[#9D7E5E] bg-opacity-10 text-[#9D7E5E]" 
                : "text-[#7A5C3E] hover:bg-[#E8D9C9] hover:text-[#4A3A2A]"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            <span className="text-xs font-mono font-medium">{likeCount}</span>
          </button>

          {/* Comments button */}
          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[#7A5C3E] hover:bg-[#E8D9C9] hover:text-[#4A3A2A] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-mono font-medium">{post._count?.comments ?? 0}</span>
          </Link>
        </div>

        {/* Read more link */}
        <Link
          href={`/post/${post.id}`}
          className="text-xs font-mono text-[#7A5C3E] hover:text-[#4A3A2A] transition-colors opacity-0 group-hover:opacity-100"
        >
          view post →
        </Link>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#9D7E5E] to-transparent opacity-0 group-hover:opacity-30 transition-opacity" />
    </article>
  );
}