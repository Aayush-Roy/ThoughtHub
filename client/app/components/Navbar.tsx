"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Navbar() {
  const path = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-[#e8ff47] font-display font-800 text-xl tracking-tight">
          pulse<span className="text-[#444]">.</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <SignedIn>
            <Link
              href="/feed"
              className={`text-sm font-medium transition-colors ${
                path === "/feed" ? "text-[#e8ff47]" : "text-[#888] hover:text-[#e8e6e1]"
              }`}
            >
              Feed
            </Link>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7 ring-1 ring-[#333] hover:ring-[#e8ff47] transition-all",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <Link
              href="/sign-in"
              className="text-sm text-[#888] hover:text-[#e8e6e1] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm bg-[#e8ff47] text-[#0a0a0a] font-semibold px-3 py-1.5 rounded-sm hover:bg-[#d4eb3a] transition-colors"
            >
              Join
            </Link>
          </SignedOut>
        </nav>

      </div>
    </header>
  );
}