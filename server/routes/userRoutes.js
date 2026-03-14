import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
 
import { syncUser, getMe, getUserByUsername, updateProfile } from "../controllers/user.controller";
import { getFeedPosts, getPostById, getUserPosts, createPost, updatePost, deletePost } from "../controllers/post.controller";
import { getComments, createComment, updateComment, deleteComment } from "../controllers/comment.controller";
import { toggleLike, getLikes, getLikedByUsers } from "../controllers/like.controller";
import { toggleFollow, getFollowers, getFollowing, getFollowingFeed } from "../controllers/follow.controller";
 


const router = Router();


// ─── Users ───────────────────────────────
router.post  ("/users/sync",              syncUser);         // no auth — webhook se
router.get   ("/users/me",       ...protect, getMe);
router.get   ("/users/:username",          getUserByUsername);
router.patch ("/users/me",       ...protect, updateProfile);


export default router;