const Comment = require("../Models/comment");
const Exam = require("../Models/exam");


exports.createComment = async (req, res) => {
    try {
        const { examId, studentId, text } = req.body;

        // Check if the exam exists
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Create a new comment
        const newComment = new Comment({
            examId,
            studentId,
            text
        });

        await newComment.save();

        return res.status(201).json({ 
            message: "Comment added successfully", 
            comment: newComment 
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.getCommentsByExam = async (req, res) => {
    try {
        const { examId } = req.params;

        // Fetch comments for the given exam ID
        const comments = await Comment.find({ examId })
            // .populate("studentId", "name") // Populate student details
            // .sort({ createdAt: -1 }); // Sort by latest first

        return res.status(200).json({
            comments,
            message: "Comments fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { studentId } = req.body; // Student ID should be passed to verify ownership

        // Find the comment
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Ensure only the author can delete their comment
        if (comment.studentId.toString() !== studentId) {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
