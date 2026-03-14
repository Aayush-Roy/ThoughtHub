
import { db } from "../lib/prismClient.js";

// GET /api/posts/:postId/comments
export const getComments = async (req, res) => {
  try {
    const comments = await db.comment.findMany({
      where: { postId: req.params.postId },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { id: true, username: true, name: true, imageUrl: true },
        },
      },
    });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/posts/:postId/comments
export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) return res.status(400).json({ message: "Content required" });

    const post = await db.post.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await db.comment.create({
      data: {
        content,
        postId,
        authorId: req.dbUserId,
      },
      include: {
        author: {
          select: { id: true, username: true, name: true, imageUrl: true },
        },
      },
    });

    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /api/comments/:id
export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;

    const comment = await db.comment.findUnique({ where: { id: req.params.id } });
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.authorId !== req.dbUserId) return res.status(403).json({ message: "Forbidden" });

    const updated = await db.comment.update({
      where: { id: req.params.id },
      data: { content },
    });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/comments/:id
export const deleteComment = async (req, res) => {
  try {
    const comment = await db.comment.findUnique({ where: { id: req.params.id } });
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.authorId !== req.dbUserId) return res.status(403).json({ message: "Forbidden" });

    await db.comment.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};