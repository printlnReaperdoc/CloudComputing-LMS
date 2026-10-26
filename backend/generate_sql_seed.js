const fs = require("fs");
const path = require("path");
const curriculum = require("./data/curriculumData");

function escapeSql(str) {
  if (!str) return "";
  return String(str).replace(/'/g, "''").replace(/\\/g, "\\\\");
}

let sql = `-- ============================================================================
-- LMS Database Seed Data: cloudcomputinglms
-- Contains Course Metadata, 12 Chapters, 240 Quiz Questions, and Pre-configured Users
-- ============================================================================

USE \`cloudcomputinglms\`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Course Metadata
INSERT INTO \`courses\` (\`course_id\`, \`code\`, \`title\`, \`term\`, \`year_level\`, \`description\`)
VALUES (1, '${escapeSql(curriculum.courseData.code)}', '${escapeSql(curriculum.courseData.title)}', '${escapeSql(curriculum.courseData.term)}', '${escapeSql(curriculum.courseData.year_level)}', '${escapeSql(curriculum.courseData.description)}')
ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`);

-- 2. Demo Users (Faculty and Students)
`;

curriculum.defaultUsers.forEach((u, i) => {
  sql += `INSERT INTO \`users\` (\`user_id\`, \`username\`, \`password_hash\`, \`first_name\`, \`surname\`, \`role\`, \`is_active\`)
VALUES (${i + 1}, '${escapeSql(u.username)}', '${escapeSql(u.password_hash)}', '${escapeSql(u.first_name)}', '${escapeSql(u.surname)}', '${escapeSql(u.role)}', 1)
ON DUPLICATE KEY UPDATE \`role\`=VALUES(\`role\`);
`;
});

sql += `\n-- 3. Chapters, Quizzes, and Question Banks\n`;

let qId = 1;
curriculum.chapters.forEach((ch) => {
  const chNum = ch.chapter_number;
  sql += `-- Chapter ${chNum}: ${escapeSql(ch.chapter_title)}\n`;
  sql += `INSERT INTO \`chapters\` (\`chapter_id\`, \`course_id\`, \`chapter_number\`, \`module_title\`, \`chapter_title\`, \`summary_text\`)
VALUES (${chNum}, 1, ${chNum}, '${escapeSql(ch.module_title)}', '${escapeSql(ch.chapter_title)}', '${escapeSql(ch.summary_text)}')
ON DUPLICATE KEY UPDATE \`chapter_title\`=VALUES(\`chapter_title\`);

INSERT INTO \`quizzes\` (\`quiz_id\`, \`chapter_id\`, \`title\`, \`time_limit_minutes\`, \`passing_percentage\`, \`total_questions\`)
VALUES (${chNum}, ${chNum}, '${escapeSql(ch.quiz.title)}', ${ch.quiz.time_limit_minutes || 10}, ${ch.quiz.passing_percentage || 75.00}, ${ch.quiz.questions.length})
ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`);

`;

  ch.quiz.questions.forEach((q) => {
    sql += `INSERT INTO \`quiz_questions\` (\`question_id\`, \`quiz_id\`, \`question_text\`, \`option_a\`, \`option_b\`, \`option_c\`, \`option_d\`, \`correct_option\`)
VALUES (${qId++}, ${chNum}, '${escapeSql(q.question_text)}', '${escapeSql(q.option_a)}', '${escapeSql(q.option_b)}', '${escapeSql(q.option_c)}', '${escapeSql(q.option_d)}', '${q.correct_option}');
`;
  });

  sql += "\n";
});

sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;

fs.writeFileSync(path.join(__dirname, "seed_data.sql"), sql, "utf8");
console.log("Successfully generated backend/seed_data.sql with all 12 chapters and 240 questions!");

