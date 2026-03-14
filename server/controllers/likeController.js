
import { db } from "../lib/prismClient.js";

// POST /api/posts/:postId/like  — toggle
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.dbUserId;

    const post = await db.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existing = await db.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      await db.like.delete({
        where: { userId_postId: { userId, postId } },
      });
      return res.status(200).json({ liked: false, message: "Unliked" });
    }

    await db.like.create({ data: { userId, postId } });
    return res.status(201).json({ liked: true, message: "Liked" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/posts/:postId/likes
export const getLikes = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.dbUserId;

    const [count, myLike] = await Promise.all([
      db.like.count({ where: { postId } }),
      db.like.findUnique({
        where: { userId_postId: { userId, postId } },
      }),
    ]);

    return res.status(200).json({ count, likedByMe: !!myLike });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/posts/:postId/likes/users
export const getLikedByUsers = async (req, res) => {
  try {
    const likes = await db.like.findMany({
      where: { postId: req.params.postId },
      include: {
        user: {
          select: { id: true, username: true, name: true, imageUrl: true },
        },
      },
    });

    return res.status(200).json(likes.map((l) => l.user));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};