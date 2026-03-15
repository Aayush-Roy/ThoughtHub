import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { serverFetch } from "@/lib/api";
import { Post, User } from "@/types";
import { CommentSection } from "@/components/post/CommentSection";
import { formatDistanceToNow } from "date-fns";

interface Props {
  params: { id: string };
}

export default async function PostPage({ params }: Props) {
  const { userId } = await auth();
    const {id} = await params;
  const [post, me] = await Promise.all([
    serverFetch<Post>(`/posts/${id}`).catch(() => null),
    userId ? serverFetch<User>("/users/me").catch(() => null) : Promise.resolve(null),
  ]);

  if (!post) notFound();

  // const likedByMe = me ? post.likes?.some((l) => l.userId === me.id) ?? false : false;
  const likedByMe =
  me && Array.isArray(post.likes)
    ? post.likes.some((l) => l.userId === me.id)
    : false;

  return (
    <div>
      {/* Back */}
      <Link href="/feed" className="text-xs font-mono text-[#444] hover:text-[#888] transition-colors mb-6 inline-block">
        ← back
      </Link>

      {/* Post */}
      <article className="border border-[#1e1e1e] bg-[#0f0f0f] rounded-sm p-6 mb-8">

        {/* Author */}
        <div className="flex items-center gap-3 mb-5">
          {post.author.imageUrl ? (
            <Image src={post.author.imageUrl} alt={post.author.username} width={40} height={40} className="rounded-full" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1e1e1e] flex items-center justify-center text-sm font-mono text-[#555]">
              {post.author.username[0].toUpperCase()}
            </div>
          )}
          <div>
            <Link href={`/profile/${post.author.username}`} className="text-sm font-semibold text-[#e8e6e1] hover:text-[#e8ff47] transition-colors">
              {post.author.name || post.author.username}
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#444]">@{post.author.username}</span>
              <span className="text-[#333]">·</span>
              <time className="text-xs font-mono text-[#444]">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </time>
            </div>
          </div>
        </div>

        {/* Content */}
        <p className="text-[#ccc] text-base leading-relaxed mb-4">{post.content}</p>

        {post.imageUrl && (
          <div className="rounded-sm overflow-hidden border border-[#1e1e1e] mb-4">
            <Image src={post.imageUrl} alt="Post image" width={600} height={400} className="w-full object-cover" />
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-5 pt-4 border-t border-[#161616]">
          <span className={`text-xs font-mono ${likedByMe ? "text-[#e8ff47]" : "text-[#444]"}`}>
            △ {post._count?.likes ?? 0} likes
          </span>
          <span className="text-xs font-mono text-[#444]">
            ◇ {post._count?.comments ?? 0} comments
          </span>
        </div>
      </article>

      {/* Comments */}
      <CommentSection
        postId={post.id}
        initialComments={post.comments ?? []}
        currentDbUserId={me?.id}
      />
    </div>
  );
}