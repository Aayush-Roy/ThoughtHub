
import { db } from "../lib/prismClient.js";

// GET /api/posts?page=1&limit=10
export const getFeedPosts = async (req, res) => {
  try {
    const page  = parseInt(req.query.page ) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip  = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where: { published: true },
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
      db.post.count({ where: { published: true } }),
    ]);

    return res.status(200).json({
      posts,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/posts/:id
export const getPostById = async (req, res) => {
  try {
    const post = await db.post.findUnique({
      where: { id: req.params.id },
      include: {
        author: {
          select: { id: true, username: true, name: true, imageUrl: true },
        },
        comments: {
          orderBy: { createdAt: "asc" },
          include: {
            author: {
              select: { id: true, username: true, name: true, imageUrl: true },
            },
          },
        },
        likes: { select: { userId: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/users/:userId/posts
export const getUserPosts = async (req, res) => {
  try {
    const posts = await db.post.findMany({
      where: { authorId: req.params.userId, published: true },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { likes: true, comments: true } },
      },
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    if (!content) return res.status(400).json({ message: "Content required" });

    const post = await db.post.create({
      data: {
        content,
        imageUrl,
        authorId: req.dbUserId,
      },
      include: {
        author: {
          select: { id: true, username: true, name: true, imageUrl: true },
        },
      },
    });

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PATCH /api/posts/:id
export const updatePost = async (req, res) => {
  try {
    const { content, imageUrl, published } = req.body;

    const post = await db.post.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== req.dbUserId) return res.status(403).json({ message: "Forbidden" });

    const updated = await db.post.update({
      where: { id: req.params.id },
      data: { content, imageUrl, published },
    });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  try {
    const post = await db.post.findUnique({ where: { id: req.params.id } });
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.authorId !== req.dbUserId) return res.status(403).json({ message: "Forbidden" });

    await db.post.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};