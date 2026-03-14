
import { db } from "../lib/prismClient.js";

// POST /api/users/:userId/follow  — toggle
export const toggleFollow = async (req, res) => {
  try {
    const followerId  = req.dbUserId;
    const followingId = req.params.userId;

    if (followerId === followingId) {
      return res.status(400).json({ message: "Khud ko follow nahi kar sakte 😂" });
    }

    const target = await db.user.findUnique({ where: { id: followingId } });
    if (!target) return res.status(404).json({ message: "User not found" });

    const existing = await db.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    if (existing) {
      await db.follow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      });
      return res.status(200).json({ following: false, message: "Unfollowed" });
    }

    await db.follow.create({ data: { followerId, followingId } });
    return res.status(201).json({ following: true, message: "Followed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:userId/followers
export const getFollowers = async (req, res) => {
  try {
    const follows = await db.follow.findMany({
      where: { followingId: req.params.userId },
      include: {
        follower: {
          select: { id: true, username: true, name: true, imageUrl: true },
        },
      },
    });

    return res.status(200).json(follows.map((f) => f.follower));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:userId/following
export const getFollowing = async (req, res) => {
  try {
    const follows = await db.follow.findMany({
      where: { followerId: req.params.userId },
      include: {
        following: {
          select: { id: true, username: true, name: true, imageUrl: true },
        },
      },
    });

    return res.status(200).json(follows.map((f) => f.following));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/feed  — sirf following ke posts
export const getFollowingFeed = async (req, res) => {
  try {
    const page  = parseInt(req.query.page  ) || 1;
    const limit = parseInt(req.query.limit ) || 10;
    const skip  = (page - 1) * limit;

    const follows = await db.follow.findMany({
      where: { followerId: req.dbUserId },
      select: { followingId: true },
    });

    const followingIds = follows.map((f) => f.followingId);

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where: { authorId: { in: followingIds }, published: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, username: true, name: true, imageUrl: true },
          },
          _count: { select: { likes: true, comments: true } },
        },
      }),
      db.post.count({
        where: { authorId: { in: followingIds }, published: true },
      }),
    ]);

    return res.status(200).json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};