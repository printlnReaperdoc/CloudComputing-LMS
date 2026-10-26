const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { authenticate, requireAuth, requireFaculty } = require("../middleware/auth");

// Public/Student quiz taking
router.get("/:chapterId", authenticate, quizController.getQuiz);
router.post("/:chapterId/attempt", authenticate, requireAuth, quizController.submitAttempt);

// Faculty authoring & management
router.get("/:chapterId/faculty", authenticate, requireFaculty, quizController.getQuizForFaculty);
router.post("/:chapterId/questions", authenticate, requireFaculty, quizController.addQuestion);
router.put("/questions/:questionId", authenticate, requireFaculty, quizController.updateQuestion);
router.delete("/questions/:questionId", authenticate, requireFaculty, quizController.deleteQuestion);
router.post("/:chapterId/reset", authenticate, requireFaculty, quizController.resetQuiz);
router.post("/:chapterId/import", authenticate, requireFaculty, quizController.importQuestions);

module.exports = router;

