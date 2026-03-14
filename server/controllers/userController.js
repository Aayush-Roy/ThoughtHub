
import {db} from "../lib/prismClient.js";

// POST /api/users/sync
export const syncUser = async (req, res) => {
  try {
    const { clerkId, email, username, name, imageUrl } = req.body;

    if (!clerkId || !email || !username) {
      return res.status(400).json({ message: "clerkId, email, username required" });
    }

    const existing = await db.user.findUnique({ where: { clerkId } });
    if (existing) return res.status(200).json(existing);

    const user = await db.user.create({
      data: { clerkId, email, username, name, imageUrl },
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/users/me
export const getMe = async (req, res) => {
  try {
    const user = await db.user.findUnique({
      where: { clerkId: req.userId },
      include: {
        _count: {
          select: { posts: true, followers: true, following: true },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:username
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await db.user.findUnique({
      where: { username },
      include: {
        posts: {
          where: { published: true },
          orderBy: { createdAt: "desc" },
          include: {
            _count: { select: { likes: true, comments: true } },
          },
        },
        _count: {
          select: { posts: true, followers: true, following: true },
        },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/me
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, imageUrl } = req.body;

    const user = await db.user.update({
      where: { clerkId: req.userId },
      data: { name, bio, imageUrl },
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};