import { Router } from "express";
import { protect } from "../middleware/auth.js";

import { syncUser, getMe, getUserByUsername, updateProfile } from "../controllers/userController.js";
import { getFeedPosts, getPostById, getUserPosts, createPost, updatePost, deletePost } from "../controllers/postController.js";
import { getComments, createComment, updateComment, deleteComment } from "../controllers/commentController.js";
import { toggleLike, getLikes, getLikedByUsers } from "../controllers/likeController.js";
import { toggleFollow, getFollowers, getFollowing, getFollowingFeed } from "../controllers/followController.js";

const router = Router();

// ─── Users ───────────────────────────────
router.post  ("/users/sync",              syncUser);         // no auth — webhook se
router.get   ("/users/me",       ...protect, getMe);
router.get   ("/users/:username",          getUserByUsername);
router.patch ("/users/me",       ...protect, updateProfile);

// ─── Posts ───────────────────────────────
router.get   ("/posts",                    getFeedPosts);
router.get   ("/posts/:id",                getPostById);
router.get   ("/users/:userId/posts",      getUserPosts);
router.post  ("/posts",          ...protect, createPost);
router.patch ("/posts/:id",      ...protect, updatePost);
router.delete("/posts/:id",      ...protect, deletePost);

// ─── Comments ────────────────────────────
router.get   ("/posts/:postId/comments",             getComments);
router.post  ("/posts/:postId/comments", ...protect, createComment);
router.patch ("/comments/:id",           ...protect, updateComment);
router.delete("/comments/:id",           ...protect, deleteComment);

// ─── Likes ───────────────────────────────
router.post  ("/posts/:postId/like",          ...protect, toggleLike);
router.get   ("/posts/:postId/likes",         ...protect, getLikes);
router.get   ("/posts/:postId/likes/users",            getLikedByUsers);

// ─── Follow ──────────────────────────────
router.post  ("/users/:userId/follow",  ...protect, toggleFollow);
router.get   ("/users/:userId/followers",          getFollowers);
router.get   ("/users/:userId/following",          getFollowing);
router.get   ("/feed",                  ...protect, getFollowingFeed);

export default router;