import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
 
import { syncUser, getMe, getUserByUsername, updateProfile } from "../controllers/user.controller";
import { getFeedPosts, getPostById, getUserPosts, createPost, updatePost, deletePost } from "../controllers/post.controller";
import { getComments, createComment, updateComment, deleteComment } from "../controllers/comment.controller";
import { toggleLike, getLikes, getLikedByUsers } from "../controllers/like.controller";
import { toggleFollow, getFollowers, getFollowing, getFollowingFeed } from "../controllers/follow.controller";
 
const router = Router();

router.post("/posts/:postId/like",          ...protect, toggleLike);
router.get("/posts/:postId/likes",         ...protect, getLikes);
router.get("/posts/:postId/likes/users",            getLikedByUsers);


export default router;