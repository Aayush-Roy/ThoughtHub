"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

const BASE ="https://thoughthub-5t0m.onrender.com";

export function useApi() {
  const { getToken } = useAuth();

  const request = useCallback(
    async <T>(path: string, options: RequestInit = {}): Promise<T> => {
      const token = await getToken();

      const res = await fetch(`${BASE}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });

      // if (!res.ok) {
      //   const err = await res.json().catch(() => ({ message: "Request failed" }));
      //   throw new Error(err.message || "Request failed");
      // }
      if (!res.ok) {
  const text = await res.text();
  console.log("API ERROR:", res.status, text);
  throw new Error(`API Error ${res.status}`);
}
      return res.json();
    },
    [getToken]
  );

  return { request };
}