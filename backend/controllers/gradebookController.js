const { db } = require("../config/db");

exports.getTopicGradebook = async (req, res) => {
  try {
    const chapterId = Number(req.params.chapterId);
    const sortBy = req.query.sortBy === "score" ? "score" : "surname";
    const order = req.query.order === "desc" ? "desc" : "asc";

    const rows = await db.getTopicGradebook(chapterId, sortBy, order);
    const chapter = await db.getChapterById(chapterId, null, "faculty");

    res.json({
      success: true,
      chapter: {
        chapter_id: chapter.chapter_id,
        chapter_number: chapter.chapter_number,
        chapter_title: chapter.chapter_title
      },
      sortBy,
      order,
      records: rows
    });
  } catch (error) {
    console.error("getTopicGradebook error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve topic gradebook." });
  }
};

exports.getMasterGradebook = async (req, res) => {
  try {
    const data = await db.getMasterGradebook();
    const course = await db.getCourse();

    res.json({
      success: true,
      course,
      ...data
    });
  } catch (error) {
    console.error("getMasterGradebook error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve master gradebook." });
  }
};

exports.getStudentReport = async (req, res) => {
  try {
    const studentId = req.params.studentId ? Number(req.params.studentId) : req.user.user_id;

    // Access check: Only faculty can view other students' reports
    if (req.user.role !== "faculty" && req.user.user_id !== studentId) {
      return res.status(403).json({ success: false, message: "Cannot view other student reports." });
    }

    const report = await db.getStudentIndividualReport(studentId);
    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error("getStudentReport error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to retrieve student report." });
  }
};

exports.exportTopicCSV = async (req, res) => {
  try {
    const chapterId = Number(req.params.chapterId);
    const sortBy = req.query.sortBy === "score" ? "score" : "surname";
    const order = req.query.order === "desc" ? "desc" : "asc";

    const rows = await db.getTopicGradebook(chapterId, sortBy, order);
    const chapter = await db.getChapterById(chapterId, null, "faculty");

    const filename = `ITEP413T_Ch${chapter.chapter_number}_Gradebook.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    let csv = `"Course: ITEP413-T Cloud Computing (Elective 4) - 4th Year, 1st Term"\n`;
    csv += `"Chapter ${chapter.chapter_number}: ${chapter.chapter_title}"\n`;
    csv += `"Generated At: ${new Date().toLocaleString()}"\n\n`;
    csv += `"Student ID","Surname","First Name","Highest Score (out of 20)","Percentage","Status","Attempts","Last Attempt Timestamp"\n`;

    rows.forEach((r) => {
      const status = r.has_passed ? "PASSED" : (r.total_attempts > 0 ? "FAILED" : "NOT ATTEMPTED");
      const timestamp = r.last_attempt_at ? new Date(r.last_attempt_at).toLocaleString() : "N/A";
      csv += `"${r.student_id}","${r.surname}","${r.first_name}","${r.highest_score}","${r.highest_percentage}%","${status}","${r.total_attempts}","${timestamp}"\n`;
    });

    res.send(csv);
  } catch (error) {
    console.error("exportTopicCSV error:", error);
    res.status(500).json({ success: false, error: "Error exporting topic CSV." });
  }
};

exports.exportMasterCSV = async (req, res) => {
  try {
    const data = await db.getMasterGradebook();
    const course = await db.getCourse();

    const filename = `ITEP413T_Master_Gradebook.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    let csv = `"Course: ${course.code} ${course.title} - ${course.year_level}, ${course.term}"\n`;
    csv += `"Master Gradebook Report - Generated At: ${new Date().toLocaleString()}"\n\n`;

    // Header row
    csv += `"Student ID","Surname","First Name"`;
    for (let i = 1; i <= 12; i++) {
      csv += `,"Ch ${i} %"`;
    }
    csv += `,"Overall Avg %","Chapters Passed","Completion Rate","Certification Status"\n`;

    data.matrix.forEach((stu) => {
      csv += `"${stu.student_id}","${stu.surname}","${stu.first_name}"`;
      for (let i = 1; i <= 12; i++) {
        const ch = stu.chapterScores[i];
        csv += `,"${ch ? ch.percentage : 0}%"`;
      }
      const cert = stu.isCompletedAll ? "COMPLETED / CERTIFIED" : "IN PROGRESS";
      csv += `,"${stu.averagePercentage}%","${stu.totalPassed}/12","${stu.completionRate}%","${cert}"\n`;
    });

    res.send(csv);
  } catch (error) {
    console.error("exportMasterCSV error:", error);
    res.status(500).json({ success: false, error: "Error exporting master CSV." });
  }
};

