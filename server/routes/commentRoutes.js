
import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
 
import { syncUser, getMe, getUserByUsername, updateProfile } from "../controllers/user.controller";
import { getFeedPosts, getPostById, getUserPosts, createPost, updatePost, deletePost } from "../controllers/post.controller";
import { getComments, createComment, updateComment, deleteComment } from "../controllers/comment.controller";
import { toggleLike, getLikes, getLikedByUsers } from "../controllers/like.controller";
import { toggleFollow, getFollowers, getFollowing, getFollowingFeed } from "../controllers/follow.controller";
 
const router = Router();


router.get   ("/posts/:postId/comments",             getComments);
router.post  ("/posts/:postId/comments", ...protect, createComment);
router.patch ("/comments/:id",           ...protect, updateComment);
router.delete("/comments/:id",           ...protect, deleteComment);


export default router;