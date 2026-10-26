const { db } = require("../config/db");

exports.getQuiz = async (req, res) => {
  try {
    const chapterId = Number(req.params.chapterId);
    const userId = req.user ? req.user.user_id : null;
    const role = req.user ? req.user.role : "student";

    // Check if chapter is unlocked for student
    const chapter = await db.getChapterById(chapterId, userId, role);
    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found." });
    }

    if (role === "student" && !chapter.is_unlocked) {
      return res.status(403).json({
        success: false,
        message: "This chapter's quiz is locked. Pass the preceding chapter first."
      });
    }

    const quiz = await db.getQuizByChapterId(chapterId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not configured for this chapter." });
    }

    // Hide answers from students
    const isFaculty = role === "faculty";
    const questions = await db.getQuizQuestions(quiz.quiz_id, isFaculty);

    res.json({
      success: true,
      quiz: {
        ...quiz,
        chapter_title: chapter.chapter_title,
        chapter_number: chapter.chapter_number,
        questions
      }
    });
  } catch (error) {
    console.error("getQuiz error:", error);
    res.status(500).json({ success: false, message: "Failed to load quiz." });
  }
};

exports.getQuizForFaculty = async (req, res) => {
  try {
    const chapterId = Number(req.params.chapterId);
    const quiz = await db.getQuizByChapterId(chapterId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }

    const questions = await db.getQuizQuestions(quiz.quiz_id, true);
    res.json({
      success: true,
      quiz: {
        ...quiz,
        questions
      }
    });
  } catch (error) {
    console.error("getQuizForFaculty error:", error);
    res.status(500).json({ success: false, message: "Failed to load faculty quiz view." });
  }
};

exports.submitAttempt = async (req, res) => {
  try {
    const chapterId = Number(req.params.chapterId);
    const { answers, timeTakenSeconds } = req.body;
    const studentId = req.user.user_id;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ success: false, message: "Invalid answers submitted." });
    }

    const quiz = await db.getQuizByChapterId(chapterId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found." });
    }

    const result = await db.submitQuizAttempt({
      quizId: quiz.quiz_id,
      studentId,
      answers,
      timeTakenSeconds: Number(timeTakenSeconds) || 0
    });

    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error("submitAttempt error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to submit quiz attempt." });
  }
};

exports.addQuestion = async (req, res) => {
  try {
    const chapterId = Number(req.params.chapterId);
    const quiz = await db.getQuizByChapterId(chapterId);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found." });

    const { question_text, option_a, option_b, option_c, option_d, correct_option, explanation } = req.body;

    if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (question text, options A, B, C, D, and correct option)."
      });
    }

    const newQuestion = await db.addQuizQuestion(quiz.quiz_id, {
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      explanation
    });

    res.status(201).json({
      success: true,
      message: "Question added successfully.",
      question: newQuestion
    });
  } catch (error) {
    console.error("addQuestion error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to add question." });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);
    const updated = await db.updateQuizQuestion(questionId, req.body);
    res.json({
      success: true,
      message: "Question updated successfully.",
      question: updated
    });
  } catch (error) {
    console.error("updateQuestion error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update question." });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = Number(req.params.questionId);
    await db.deleteQuizQuestion(questionId);
    res.json({
      success: true,
      message: "Question deleted successfully."
    });
  } catch (error) {
    console.error("deleteQuestion error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to delete question." });
  }
};

exports.resetQuiz = async (req, res) => {
  try {
    const chapterId = Number(req.params.chapterId);
    await db.resetChapterQuiz(chapterId);
    res.json({
      success: true,
      message: `Reset Chapter ${chapterId} quiz back to default 20 curated questions.`
    });
  } catch (error) {
    console.error("resetQuiz error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to reset quiz." });
  }
};

exports.importQuestions = async (req, res) => {
  try {
    const chapterId = Number(req.params.chapterId);
    const quiz = await db.getQuizByChapterId(chapterId);
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found." });

    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: "Expected non-empty array of questions in 'items'." });
    }

    let importedCount = 0;
    for (const item of items) {
      if (item.question_text && item.option_a && item.option_b && item.option_c && item.option_d && item.correct_option) {
        await db.addQuizQuestion(quiz.quiz_id, item);
        importedCount++;
      }
    }

    res.json({
      success: true,
      message: `Successfully imported ${importedCount} questions into Chapter ${chapterId} quiz.`
    });
  } catch (error) {
    console.error("importQuestions error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to import questions." });
  }
};

