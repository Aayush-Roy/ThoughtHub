import { auth } from "@clerk/nextjs/server";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ─── Client-side fetch (browser mein use karo) ───
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

// ─── Server-side fetch (Server Components mein use karo) ───
export async function serverFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}

// ─── Client hooks ke liye token getter ───
export async function getAuthHeaders(): Promise<HeadersInit> {
  // Client component mein @clerk/nextjs ka useAuth hook se token lena padega
  // Yeh helper sirf server side ke liye hai
  return { "Content-Type": "application/json" };
}