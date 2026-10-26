require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const storePath = path.join(__dirname, "data", "lms-db.json");

async function main() {
  const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "cloudcomputinglms"
  });

  try {
    await connection.query("ALTER TABLE chapters ADD COLUMN IF NOT EXISTS objectives JSON NULL");
    await connection.query("ALTER TABLE chapters ADD COLUMN IF NOT EXISTS slides JSON NULL");
    await connection.query("ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS explanation TEXT NULL");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    for (const table of [
      "quiz_attempt_answers",
      "quiz_attempts",
      "student_progress",
      "quiz_questions",
      "quizzes",
      "chapters",
      "courses",
      "users"
    ]) {
      await connection.query(`TRUNCATE TABLE \`${table}\``);
    }

    await connection.beginTransaction();
    const usernames = new Set();
    for (const user of store.users) {
      let username = user.username;
      let suffix = 2;
      while (usernames.has(username.toLowerCase())) {
        const suffixText = `_${suffix++}`;
        username = `${user.username.slice(0, 50 - suffixText.length)}${suffixText}`;
      }
      usernames.add(username.toLowerCase());
      await connection.execute(
        `INSERT INTO users
         (user_id, username, password_hash, first_name, surname, role, is_active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user.user_id, username, user.password_hash, user.first_name, user.surname,
          user.role, user.is_active, user.created_at]
      );
    }

    await connection.execute(
      `INSERT INTO courses
       (course_id, code, title, term, year_level, description, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [store.course.course_id, store.course.code, store.course.title, store.course.term,
        store.course.year_level, store.course.description, store.course.created_at]
    );

    for (const chapter of store.chapters) {
      await connection.execute(
        `INSERT INTO chapters
         (chapter_id, course_id, chapter_number, module_title, chapter_title, summary_text,
          presentation_url, objectives, slides, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [chapter.chapter_id, chapter.course_id, chapter.chapter_number, chapter.module_title,
          chapter.chapter_title, chapter.summary_text, chapter.presentation_url,
          JSON.stringify(chapter.objectives || []), JSON.stringify(chapter.slides || []), chapter.created_at]
      );
    }

    for (const quiz of store.quizzes) {
      await connection.execute(
        `INSERT INTO quizzes
         (quiz_id, chapter_id, title, time_limit_minutes, passing_percentage, total_questions, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [quiz.quiz_id, quiz.chapter_id, quiz.title, quiz.time_limit_minutes,
          quiz.passing_percentage, quiz.total_questions, quiz.created_at]
      );
    }

    for (const question of store.quiz_questions) {
      await connection.execute(
        `INSERT INTO quiz_questions
         (question_id, quiz_id, question_text, option_a, option_b, option_c, option_d,
          correct_option, explanation, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [question.question_id, question.quiz_id, question.question_text, question.option_a,
          question.option_b, question.option_c, question.option_d, question.correct_option,
          question.explanation || "", question.created_at]
      );
    }

    for (const progress of store.student_progress) {
      await connection.execute(
        `INSERT INTO student_progress
         (progress_id, student_id, chapter_id, is_unlocked, is_completed, highest_score,
          unlocked_at, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [progress.progress_id, progress.student_id, progress.chapter_id, progress.is_unlocked,
          progress.is_completed, progress.highest_score, progress.unlocked_at, progress.completed_at]
      );
    }

    for (const attempt of store.quiz_attempts) {
      await connection.execute(
        `INSERT INTO quiz_attempts
         (attempt_id, quiz_id, student_id, score, total_questions, percentage, passed,
          time_taken_seconds, attempted_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [attempt.attempt_id, attempt.quiz_id, attempt.student_id, attempt.score,
          attempt.total_questions, attempt.percentage, attempt.passed,
          attempt.time_taken_seconds, attempt.attempted_at]
      );
    }

    for (const answer of store.quiz_attempt_answers || []) {
      await connection.execute(
        `INSERT INTO quiz_attempt_answers
         (answer_id, attempt_id, question_id, selected_option, is_correct)
         VALUES (?, ?, ?, ?, ?)`,
        [answer.answer_id, answer.attempt_id, answer.question_id, answer.selected_option, answer.is_correct]
      );
    }

    for (const table of [
      ["users", "user_id"],
      ["courses", "course_id"],
      ["chapters", "chapter_id"],
      ["quizzes", "quiz_id"],
      ["quiz_questions", "question_id"],
      ["student_progress", "progress_id"],
      ["quiz_attempts", "attempt_id"],
      ["quiz_attempt_answers", "answer_id"]
    ]) {
      const [rows] = await connection.query(
        `SELECT COALESCE(MAX(\`${table[1]}\`), 0) + 1 AS next_id FROM \`${table[0]}\``
      );
      const nextId = Number(rows[0].next_id);
      await connection.query(`ALTER TABLE \`${table[0]}\` AUTO_INCREMENT = ${nextId}`);
    }

    await connection.commit();
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Migrated JSON LMS data into MySQL successfully.");
  } catch (error) {
    await connection.rollback();
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("MySQL migration failed:", error.message);
  process.exitCode = 1;
});
