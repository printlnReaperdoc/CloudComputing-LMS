const { db } = require("../config/db");
const PDFDocument = require("pdfkit");

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

exports.exportMasterPDF = async (req, res) => {
  try {
    const data = await db.getMasterGradebook();
    const course = await db.getCourse();
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 32, right: 28, bottom: 32, left: 28 },
      info: {
        Title: "ITEP413-T Course Master Gradebook",
        Author: "Cloud Computing LMS"
      }
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="ITEP413T_Master_Gradebook.pdf"');
    doc.pipe(res);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const chapterCount = data.chapters.length;
    const nameWidth = 116;
    const metricWidth = 52;
    const chapterWidth = Math.max(34, (pageWidth - nameWidth - metricWidth * 3) / chapterCount);
    const rowHeight = 24;
    const columns = [
      { label: "Student", width: nameWidth },
      ...data.chapters.map((chapter) => ({ label: `CH ${chapter.chapter_number}`, width: chapterWidth })),
      { label: "Passed", width: metricWidth },
      { label: "Progress", width: metricWidth },
      { label: "Average", width: metricWidth }
    ];

    const drawCell = (text, x, y, width, height, options = {}) => {
      doc.rect(x, y, width, height)
        .fillAndStroke(options.header ? "#1f3a5f" : (options.alt ? "#f3f6fa" : "#ffffff"), "#9aa7b5");
      doc.fillColor(options.header ? "#ffffff" : "#17202a")
        .font(options.header ? "Helvetica-Bold" : "Helvetica")
        .fontSize(options.header ? 7 : 7.5)
        .text(String(text), x + 3, y + (options.header ? 8 : 7), width - 6, {
          align: options.align || "center",
          ellipsis: true,
          lineBreak: false
        });
    };

    const drawHeader = () => {
      let x = doc.page.margins.left;
      const y = doc.y;
      columns.forEach((column) => {
        drawCell(column.label, x, y, column.width, 22, { header: true, align: column.label === "Student" ? "left" : "center" });
        x += column.width;
      });
      doc.y = y + 22;
    };

    doc.fillColor("#17202a").font("Helvetica-Bold").fontSize(16)
      .text("Course Master Gradebook Matrix");
    doc.moveDown(0.25).font("Helvetica").fontSize(9)
      .text(`${course.code}: ${course.title} — ${course.year_level}, ${course.term}`);
    doc.moveDown(0.2).fontSize(8)
      .text(`Generated: ${new Date().toLocaleString()}    |    Enrolled Students: ${data.summary.totalStudents}    |    Chapters: ${chapterCount}    |    Class Average: ${data.summary.classAverage}%    |    Certified: ${data.summary.certifiedGraduates}`);
    doc.moveDown(0.8);

    drawHeader();
    data.matrix.forEach((student, index) => {
      if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        drawHeader();
      }
      const y = doc.y;
      let x = doc.page.margins.left;
      drawCell(`${student.surname}, ${student.first_name} (#${student.student_id})`, x, y, nameWidth, rowHeight, { alt: index % 2 === 1, align: "left" });
      x += nameWidth;
      data.chapters.forEach((chapter) => {
        const score = student.chapterScores[chapter.chapter_number];
        const value = score && score.attempts > 0 ? `${score.percentage}%` : "—";
        drawCell(value, x, y, chapterWidth, rowHeight, { alt: index % 2 === 1 });
        x += chapterWidth;
      });
      drawCell(`${student.totalPassed}/${chapterCount}`, x, y, metricWidth, rowHeight, { alt: index % 2 === 1 });
      x += metricWidth;
      drawCell(`${student.completionRate}%`, x, y, metricWidth, rowHeight, { alt: index % 2 === 1 });
      x += metricWidth;
      drawCell(`${student.averagePercentage}%`, x, y, metricWidth, rowHeight, { alt: index % 2 === 1 });
      doc.y = y + rowHeight;
    });

    doc.end();
  } catch (error) {
    console.error("exportMasterPDF error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, error: "Error exporting master PDF." });
    }
  }
};
