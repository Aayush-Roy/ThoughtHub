import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { serverFetch } from "@/lib/api";
import { PaginatedPosts, User } from "@/types";
import { FeedClient } from "./FeedClient";

export default async function FeedPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  // Parallel fetch — posts + current user
  const [{ posts }, me] = await Promise.all([
    serverFetch<PaginatedPosts>("/posts?page=1&limit=20"),
    serverFetch<User>("/users/me").catch(() => null),
  ]);

  return <FeedClient initialPosts={posts} currentUser={me} />;
}