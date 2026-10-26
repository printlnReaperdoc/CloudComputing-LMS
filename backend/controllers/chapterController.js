const { db } = require("../config/db");

exports.getChapters = async (req, res) => {
  try {
    const userId = req.user ? req.user.user_id : null;
    const role = req.user ? req.user.role : "student";

    const chapters = await db.getChaptersForUser(userId, role);
    res.json({
      success: true,
      chapters
    });
  } catch (error) {
    console.error("getChapters error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve chapters." });
  }
};

exports.getChapter = async (req, res) => {
  try {
    const chapterId = Number(req.params.id);
    const userId = req.user ? req.user.user_id : null;
    const role = req.user ? req.user.role : "student";

    const chapter = await db.getChapterById(chapterId, userId, role);
    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found." });
    }

    // Access control check for students:
    // If student and chapter is locked, prevent reading content
    if (role === "student" && !chapter.is_unlocked) {
      return res.status(403).json({
        success: false,
        is_locked: true,
        message: `Chapter ${chapter.chapter_number} is locked. You must achieve >= 75% on Chapter ${chapter.chapter_number - 1}'s quiz to unlock this topic.`
      });
    }

    res.json({
      success: true,
      chapter
    });
  } catch (error) {
    console.error("getChapter error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve chapter." });
  }
};

exports.updateChapter = async (req, res) => {
  try {
    const chapterId = Number(req.params.id);
    const { summary_text, presentation_url, slides, objectives, chapter_title } = req.body;

    const updated = await db.updateChapter(chapterId, {
      summary_text,
      presentation_url,
      slides,
      objectives,
      chapter_title
    });

    res.json({
      success: true,
      message: "Chapter materials updated successfully.",
      chapter: updated
    });
  } catch (error) {
    console.error("updateChapter error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to update chapter." });
  }
};

