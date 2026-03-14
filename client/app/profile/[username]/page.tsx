import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { serverFetch } from "@/lib/api";
import { User, Post } from "@/types";
import { PostCard } from "@/components/post/PostCard";
import { FollowButton } from "./FollowButton";

interface Props {
  params: { username: string };
}

export default async function ProfilePage({ params }: Props) {
  const { userId } = await auth();
  const { username } = await params;
  const [profile, me] = await Promise.all([
    serverFetch<User & { posts: Post[] }>(`/users/${username}`).catch(() => null),
    userId ? serverFetch<User>("/users/me").catch(() => null) : Promise.resolve(null),
  ]);

  if (!profile) notFound();

  const isMe = me?.id === profile.id;

  return (
    <div>
      {/* Profile header */}
      <div className="border border-[#1e1e1e] bg-[#0f0f0f] rounded-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {profile.imageUrl ? (
              <Image
                src={profile.imageUrl}
                alt={profile.username}
                width={56}
                height={56}
                className="rounded-full ring-1 ring-[#1e1e1e]"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#1e1e1e] flex items-center justify-center text-xl font-mono text-[#555]">
                {profile.username[0].toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-[#e8e6e1]">
                {profile.name || profile.username}
              </h1>
              <span className="text-xs font-mono text-[#444]">@{profile.username}</span>
            </div>
          </div>

          {!isMe && me && (
            <FollowButton targetUserId={profile.id} />
          )}
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-[#666] leading-relaxed mb-4">{profile.bio}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-6 pt-4 border-t border-[#161616]">
          {[
            { label: "posts",     value: profile._count?.posts ?? 0 },
            { label: "followers", value: profile._count?.followers ?? 0 },
            { label: "following", value: profile._count?.following ?? 0 },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-sm font-bold text-[#e8e6e1] font-mono">{value}</div>
              <div className="text-xs text-[#444] font-mono">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="mb-4">
        <h2 className="text-xs font-mono text-[#444] uppercase tracking-widest mb-4">
          — posts —
        </h2>
        <div className="space-y-3">
          {profile.posts?.length === 0 && (
            <p className="text-[#333] text-sm font-mono">no posts yet.</p>
          )}
          {profile.posts?.map((post) => (
            <PostCard
              key={post.id}
              post={{ ...post, author: { id: profile.id, username: profile.username, name: profile.name, imageUrl: profile.imageUrl } }}
              currentDbUserId={me?.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}