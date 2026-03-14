// // const Clerk = require('')
// import Clerk from "@clerk/clerk-sdk-node"
// const auth = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization
//     console.log('Received header:', authHeader) // debug

//     if (!authHeader?.startsWith('Bearer ')) {
//       return res.status(401).json({ error: 'No token' })
//     }

//     const token = authHeader.split(' ')[1]

//     // Token verify
//     const { verifyToken } = require('@clerk/clerk-sdk-node')
//     const payload = await verifyToken(token, {
//       secretKey: process.env.CLERK_SECRET_KEY
//     })

//     console.log('Verified userId:', payload.sub) // debug
//     req.userId = payload.sub
//     next()
//   } catch (err) {
//     console.error('Auth middleware error:', err.message)
//     res.status(401).json({ error: err.message })
//   }
// }

// export default auth;


import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { db } from "../lib/prismClient.js";

// Express Request pe userId aur dbUserId extend karo
// declare global {
//   namespace Express {
//     interface Request {
//       userId: string;      // Clerk ID  (e.g. "user_2xyz...")
//       dbUserId: string;    // Apna DB id (cuid)
//     }
//   }
// }

// ─── Step 1: Clerk JWT verify karo ───
export const requireAuth = ClerkExpressRequireAuth();

// ─── Step 2: DB user attach karo (requireAuth ke baad use karo) ───
export const attachDbUser = async (
  req,
  res,
  next
) => {
  try {
    const clerkId = req.auth.userId;
    if (!clerkId) return res.status(401).json({ message: "Unauthorized" });

    req.userId = clerkId;

    const user = await db.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!user) return res.status(404).json({ message: "User not synced. Call /api/users/sync first." });

    req.dbUserId = user.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

// ─── Combined — dono ek saath ───
export const protect = [requireAuth, attachDbUser];