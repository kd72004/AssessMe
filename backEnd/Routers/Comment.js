const express = require("express");
const { createComment, getCommentsByExam, deleteComment } = require("../Controllers/Comment");
const router = express.Router();


// Create a new comment
router.post("/", createComment);

// Get all comments for an exam
router.get("/:examId", getCommentsByExam);

// Delete a comment
router.delete("/:commentId", deleteComment);

module.exports = router;
