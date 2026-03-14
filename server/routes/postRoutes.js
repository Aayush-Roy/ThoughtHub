import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
 
import { syncUser, getMe, getUserByUsername, updateProfile } from "../controllers/user.controller";
import { getFeedPosts, getPostById, getUserPosts, createPost, updatePost, deletePost } from "../controllers/post.controller";
import { getComments, createComment, updateComment, deleteComment } from "../controllers/comment.controller";
import { toggleLike, getLikes, getLikedByUsers } from "../controllers/like.controller";
import { toggleFollow, getFollowers, getFollowing, getFollowingFeed } from "../controllers/follow.controller";
 
const router = Router();
router.get   ("/posts",                    getFeedPosts);
router.get   ("/posts/:id",                getPostById);
router.get   ("/users/:userId/posts",      getUserPosts);
router.post  ("/posts",          ...protect, createPost);
router.patch ("/posts/:id",      ...protect, updatePost);
router.delete("/posts/:id",      ...protect, deletePost);

export default router;