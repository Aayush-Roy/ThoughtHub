// "use client";

// import { useState } from "react";
// import { Post, User } from "@/types";
// import {useEffect} from "react";
// import { useUser } from "@clerk/nextjs";
// import { PostCard } from "@/components/post/PostCard";
// import { CreatePost } from "@/components/post/CreatePost";
// import { useApi } from "@/hooks/useApi";

// interface FeedClientProps {
//   initialPosts: Post[];
//   currentUser: User | null;
// }

// export function FeedClient({ initialPosts, currentUser }: FeedClientProps) {
//   const [posts, setPosts] = useState<Post[]>(initialPosts);
//     const { user } = useUser();
//   const { request } = useApi();
//      useEffect (() => {
//     if (user && !currentUser) {
//       request("/users/sync", {
//         method: "POST",
//         body: JSON.stringify({
//           clerkId:  user.id,
//           email:    user.emailAddresses[0].emailAddress,
//           username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
//           name:     user.fullName,
//           imageUrl: user.imageUrl,
//         }),
//       }).catch(console.error);
//     }
//   }, [user, currentUser]);
//   const handleCreated = (post: Post) => {
//     setPosts((p) => [post, ...p]);
//   };

//   const handleDelete = (id: string) => {
//     setPosts((p) => p.filter((x) => x.id !== id));
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-baseline justify-between mb-6">
//         <h2 className="text-xs font-mono text-[#444] uppercase tracking-widest">
//           — feed —
//         </h2>
//         {currentUser && (
//           <span className="text-xs font-mono text-[#333]">
//             @{currentUser.username}
//           </span>
//         )}
//       </div>

//       {/* Create */}
//       {currentUser && <CreatePost onCreated={handleCreated} />}

//       {/* Posts */}
//       <div className="space-y-3">
//         {posts.length === 0 && (
//           <p className="text-center text-[#333] text-sm font-mono py-12">
//             nothing here yet. be the first.
//           </p>
//         )}
//         {posts.map((post) => (
//           <PostCard
//             key={post.id}
//             post={post}
//             currentDbUserId={currentUser?.id}
//             onDelete={handleDelete}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { Post, User } from "@/types";
import { useUser } from "@clerk/nextjs";
import { PostCard } from "@/components/post/PostCard";
import { CreatePost } from "@/components/post/CreatePost";
import { useApi } from "@/hooks/useApi";
import { 
  PenSquare, 
  Users, 
  Sparkles,
  RefreshCw,
  Bell 
} from "lucide-react";

interface FeedClientProps {
  initialPosts: Post[];
  currentUser: User | null;
}

export function FeedClient({ initialPosts, currentUser }: FeedClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useUser();
  const { request } = useApi();

  useEffect(() => {
    if (user && !currentUser) {
      request("/users/sync", {
        method: "POST",
        body: JSON.stringify({
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          username: user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
          name: user.fullName,
          imageUrl: user.imageUrl,
        }),
      }).catch(console.error);
    }
  }, [user, currentUser, request]);

  const handleCreated = (post: Post) => {
    setPosts((p) => [post, ...p]);
  };

  const handleDelete = (id: string) => {
    setPosts((p) => p.filter((x) => x.id !== id));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh - replace with actual refresh logic
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with gradient */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-gradient-to-b from-[#9D7E5E] to-[#7A5C3E] rounded-full" />
            <div>
              <h1 className="text-2xl font-serif text-[#4A3A2A] tracking-tight">
                The Feed
              </h1>
              <p className="text-xs font-mono text-[#7A5C3E] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                latest from the community
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 text-[#7A5C3E] hover:text-[#4A3A2A] transition-colors"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            
            {currentUser && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FDF8F2] border border-[#E8D9C9] rounded-full">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#9D7E5E] to-[#7A5C3E] flex items-center justify-center text-white text-xs font-medium">
                  {currentUser.username?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-mono text-[#4A3A2A]">
                  @{currentUser.username}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 px-4 py-2 bg-[#FDF8F2] border border-[#E8D9C9] rounded-lg text-xs font-mono text-[#7A5C3E]">
          <div className="flex items-center gap-1.5">
            <PenSquare className="w-3.5 h-3.5" />
            <span>{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
          </div>
          <div className="w-px h-3 bg-[#E8D9C9]" />
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>active now</span>
          </div>
          <div className="w-px h-3 bg-[#E8D9C9]" />
          <div className="flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5" />
            <span>updates</span>
          </div>
        </div>
      </div>

      {/* Create Post Section */}
      {currentUser && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-1 bg-[#9D7E5E] rounded-full" />
            <span className="text-xs font-mono text-[#7A5C3E] tracking-wider">
              SHARE SOMETHING
            </span>
          </div>
          <CreatePost onCreated={handleCreated} />
        </div>
      )}

      {/* Posts Feed */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-1 bg-[#9D7E5E] rounded-full" />
          <span className="text-xs font-mono text-[#7A5C3E] tracking-wider">
            LATEST POSTS
          </span>
        </div>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="relative">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#FDF8F2] to-transparent opacity-50 rounded-lg" />
              
              <div className="relative py-16 px-4 text-center border-2 border-dashed border-[#E8D9C9] rounded-lg">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FDF8F2] border-2 border-[#E8D9C9] flex items-center justify-center">
                  <PenSquare className="w-6 h-6 text-[#7A5C3E]" />
                </div>
                <p className="text-sm font-mono text-[#7A5C3E] mb-2">
                  nothing here yet
                </p>
                <p className="text-xs font-mono text-[#9D7E5E] max-w-xs mx-auto">
                  be the first to share something with the community
                </p>
                {!currentUser && (
                  <button className="mt-4 px-4 py-2 bg-[#4A3A2A] text-white text-xs font-mono rounded-lg hover:bg-[#5F4B38] transition-colors">
                    sign in to post
                  </button>
                )}
              </div>
            </div>
          ) : (
            posts.map((post, index) => (
              <div
                key={post.id}
                className="transform transition-all duration-300 hover:-translate-y-1"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.5s ease-out forwards'
                }}
              >
                <PostCard
                  post={post}
                  currentDbUserId={currentUser?.id}
                  onDelete={handleDelete}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer for logged out users */}
      {!currentUser && posts.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-xs font-mono text-[#7A5C3E]">
            want to join the conversation?{' '}
            <button className="text-[#4A3A2A] font-medium underline hover:text-[#9D7E5E] transition-colors">
              sign in
            </button>
          </p>
        </div>
      )}
    </div>
  );
}