import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
 
import { syncUser, getMe, getUserByUsername, updateProfile } from "../controllers/user.controller";
import { getFeedPosts, getPostById, getUserPosts, createPost, updatePost, deletePost } from "../controllers/post.controller";
import { getComments, createComment, updateComment, deleteComment } from "../controllers/comment.controller";
import { toggleLike, getLikes, getLikedByUsers } from "../controllers/like.controller";
import { toggleFollow, getFollowers, getFollowing, getFollowingFeed } from "../controllers/follow.controller";
 
const router = Router();


router.post  ("/users/:userId/follow",  ...protect, toggleFollow);
router.get   ("/users/:userId/followers",          getFollowers);
router.get   ("/users/:userId/following",          getFollowing);
router.get   ("/feed",                  ...protect, getFollowingFeed);

export default router;