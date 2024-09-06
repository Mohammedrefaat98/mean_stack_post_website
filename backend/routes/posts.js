const express = require("express");

const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const checkFile= require('../middleware/file');
const PostsController= require('../controllers/posts')

router.post(
  "",
  checkAuth,
  checkFile,
  PostsController.createPost
);

router.put(
  "/:id",
  checkAuth,
  checkFile,
  PostsController.updatePostById
);

router.get("", PostsController.getPosts);

router.get("/:id", PostsController.getPostById);

router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;