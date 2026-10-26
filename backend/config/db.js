const mysql = require("mysql2/promise");
const curriculum = require("../data/curriculumData");

let pool = null;

function jsonValue(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "cloudcomputinglms",
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 2000
  });

  const connection = await pool.getConnection();
  connection.release();
  console.log("[DB] Connected to MySQL successfully. MySQL-only mode active.");
}

function requirePool() {
  if (!pool) throw new Error("Database is not initialized.");
  return pool;
}

function chapterWithJson(chapter) {
  if (!chapter) return null;
  return {
    ...chapter,
    objectives: jsonValue(chapter.objectives, []),
    slides: jsonValue(chapter.slides, [])
  };
}

function questionWithJson(question) {
  if (!question) return null;
  return { ...question, explanation: question.explanation || "" };
}

const db = {
  isMySQL() {
    return Boolean(pool);
  },

  async getCourse() {
    const [rows] = await requirePool().execute("SELECT * FROM courses ORDER BY course_id LIMIT 1");
    return rows[0] || null;
  },

  async getAllUsers() {
    const [rows] = await requirePool().execute(
      "SELECT user_id, username, first_name, surname, role, is_active, created_at FROM users"
    );
    return rows;
  },

  async findUserByUsername(username) {
    const [rows] = await requirePool().execute(
      "SELECT user_id, username, password_hash, first_name, surname, role, is_active FROM users WHERE username = ? AND is_active = 1 LIMIT 1",
      [username.trim()]
    );
    return rows[0] || null;
  },

  async findUserById(id) {
    const [rows] = await requirePool().execute(
      "SELECT user_id, username, first_name, surname, role, is_active FROM users WHERE user_id = ? AND is_active = 1 LIMIT 1",
      [id]
    );
    return rows[0] || null;
  },

  async createUser({ username, password_hash, first_name, surname }) {
    const existing = await this.findUserByUsername(username);
    if (existing) throw new Error("Username already taken.");
    const database = requirePool();
    const [result] = await database.execute(
      "INSERT INTO users (username, password_hash, first_name, surname, role, is_active) VALUES (?, ?, ?, ?, 'student', 1)",
      [username.trim(), password_hash, first_name.trim(), surname.trim()]
    );
    return this.findUserById(result.insertId);
  },

  async getChaptersForUser(userId, role) {
    const [chapters] = await requirePool().execute(
      `SELECT ch.chapter_id, ch.chapter_number, ch.module_title, ch.chapter_title,
              CASE WHEN ? = 'faculty' OR ch.chapter_number = 1 OR COALESCE(sp.is_unlocked, 0) = 1
                   THEN 1 ELSE 0 END AS is_unlocked,
              COALESCE(sp.is_completed, 0) AS is_completed,
              COALESCE(sp.highest_score, 0) AS highest_score,
              JSON_LENGTH(COALESCE(ch.slides, JSON_ARRAY())) AS slides_count
       FROM chapters ch
       LEFT JOIN student_progress sp ON sp.chapter_id = ch.chapter_id AND sp.student_id = ?
       ORDER BY ch.chapter_number`,
      [role, userId || 0]
    );
    return chapters;
  },

  async getChapterById(chapterId, userId, role) {
    const [rows] = await requirePool().execute(
      `SELECT ch.*, CASE WHEN ? = 'faculty' OR ch.chapter_number = 1 OR COALESCE(sp.is_unlocked, 0) = 1
                    THEN 1 ELSE 0 END AS is_unlocked,
              COALESCE(sp.is_completed, 0) AS is_completed,
              COALESCE(sp.highest_score, 0) AS highest_score
       FROM chapters ch
       LEFT JOIN student_progress sp ON sp.chapter_id = ch.chapter_id AND sp.student_id = ?
       WHERE ch.chapter_id = ? LIMIT 1`,
      [role, userId || 0, chapterId]
    );
    return chapterWithJson(rows[0]);
  },

  async updateChapter(chapterId, data) {
    const fields = [];
    const values = [];
    const jsonFields = ["objectives", "slides"];
    for (const field of ["summary_text", "presentation_url", "chapter_title"]) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(data[field]);
      }
    }
    for (const field of jsonFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(JSON.stringify(data[field]));
      }
    }
    if (!fields.length) return this.getChapterById(chapterId, null, "faculty");
    values.push(chapterId);
    const [result] = await requirePool().execute(
      `UPDATE chapters SET ${fields.join(", ")} WHERE chapter_id = ?`,
      values
    );
    if (!result.affectedRows) throw new Error("Chapter not found");
    return this.getChapterById(chapterId, null, "faculty");
  },

  async getQuizByChapterId(chapterId) {
    const [rows] = await requirePool().execute(
      "SELECT * FROM quizzes WHERE chapter_id = ? LIMIT 1",
      [chapterId]
    );
    return rows[0] || null;
  },

  async getQuizQuestions(quizId, includeAnswers = false) {
    const [rows] = await requirePool().execute(
      "SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY question_id",
      [quizId]
    );
    return rows.map((question) => {
      const result = questionWithJson(question);
      if (!includeAnswers) {
        delete result.correct_option;
        delete result.explanation;
      }
      return result;
    });
  },

  async addQuizQuestion(quizId, data) {
    const [result] = await requirePool().execute(
      `INSERT INTO quiz_questions
       (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [quizId, data.question_text, data.option_a, data.option_b, data.option_c, data.option_d,
        data.correct_option.toUpperCase(), data.explanation || ""]
    );
    await requirePool().execute(
      "UPDATE quizzes SET total_questions = (SELECT COUNT(*) FROM quiz_questions WHERE quiz_id = ?) WHERE quiz_id = ?",
      [quizId, quizId]
    );
    const [rows] = await requirePool().execute("SELECT * FROM quiz_questions WHERE question_id = ?", [result.insertId]);
    return questionWithJson(rows[0]);
  },

  async updateQuizQuestion(questionId, data) {
    const fields = [];
    const values = [];
    for (const field of ["question_text", "option_a", "option_b", "option_c", "option_d", "explanation"]) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(data[field]);
      }
    }
    if (data.correct_option !== undefined) {
      fields.push("correct_option = ?");
      values.push(data.correct_option.toUpperCase());
    }
    if (!fields.length) throw new Error("No question fields to update.");
    values.push(questionId);
    const [result] = await requirePool().execute(
      `UPDATE quiz_questions SET ${fields.join(", ")} WHERE question_id = ?`,
      values
    );
    if (!result.affectedRows) throw new Error("Question not found");
    const [rows] = await requirePool().execute("SELECT * FROM quiz_questions WHERE question_id = ?", [questionId]);
    return questionWithJson(rows[0]);
  },

  async deleteQuizQuestion(questionId) {
    const [result] = await requirePool().execute("DELETE FROM quiz_questions WHERE question_id = ?", [questionId]);
    if (!result.affectedRows) throw new Error("Question not found");
    return true;
  },

  async resetChapterQuiz(chapterId) {
    const chapter = curriculum.chapters[Number(chapterId) - 1];
    if (!chapter) throw new Error("Invalid chapter");
    const quiz = await this.getQuizByChapterId(chapterId);
    if (!quiz) throw new Error("Quiz not found");
    const connection = await requirePool().getConnection();
    try {
      await connection.beginTransaction();
      await connection.execute("DELETE FROM quiz_questions WHERE quiz_id = ?", [quiz.quiz_id]);
      for (const question of chapter.quiz.questions) {
        await connection.execute(
          `INSERT INTO quiz_questions
           (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [quiz.quiz_id, question.question_text, question.option_a, question.option_b, question.option_c,
            question.option_d, question.correct_option, question.explanation || ""]
        );
      }
      await connection.execute("UPDATE quizzes SET total_questions = ? WHERE quiz_id = ?",
        [chapter.quiz.questions.length, quiz.quiz_id]);
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    return true;
  },

  async submitQuizAttempt({ quizId, studentId, answers, timeTakenSeconds }) {
    const database = requirePool();
    const [questions] = await database.execute(
      "SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY question_id", [quizId]
    );
    if (!questions.length) throw new Error("No questions in this quiz.");
    let correctCount = 0;
    const answerAudit = questions.map((question) => {
      const selected = (answers[question.question_id] || "").toUpperCase();
      const isCorrect = selected === question.correct_option;
      if (isCorrect) correctCount++;
      return {
        question_id: question.question_id,
        question_text: question.question_text,
        selected_option: selected,
        correct_option: question.correct_option,
        is_correct: isCorrect ? 1 : 0,
        explanation: question.explanation || ""
      };
    });
    const total = questions.length;
    const percentage = Number(((correctCount / total) * 100).toFixed(2));
    const passed = percentage >= 75 ? 1 : 0;
    const connection = await database.getConnection();
    try {
      await connection.beginTransaction();
      const [attemptResult] = await connection.execute(
        `INSERT INTO quiz_attempts
         (quiz_id, student_id, score, total_questions, percentage, passed, time_taken_seconds)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [quizId, studentId, correctCount, total, percentage, passed, timeTakenSeconds || 0]
      );
      for (const answer of answerAudit) {
        if (["A", "B", "C", "D"].includes(answer.selected_option)) {
          await connection.execute(
            `INSERT INTO quiz_attempt_answers (attempt_id, question_id, selected_option, is_correct)
             VALUES (?, ?, ?, ?)`,
            [attemptResult.insertId, answer.question_id, answer.selected_option, answer.is_correct]
          );
        }
      }
      const [quizRows] = await connection.execute("SELECT chapter_id FROM quizzes WHERE quiz_id = ?", [quizId]);
      const chapterId = quizRows[0].chapter_id;
      await connection.execute(
        `INSERT INTO student_progress
         (student_id, chapter_id, is_unlocked, is_completed, highest_score, unlocked_at, completed_at)
         VALUES (?, ?, 1, ?, ?, CURRENT_TIMESTAMP, ?)
         ON DUPLICATE KEY UPDATE
           highest_score = GREATEST(highest_score, VALUES(highest_score)),
           is_completed = GREATEST(is_completed, VALUES(is_completed)),
           completed_at = CASE WHEN VALUES(is_completed) = 1 THEN COALESCE(completed_at, VALUES(completed_at)) ELSE completed_at END`,
        [studentId, chapterId, passed, percentage, passed ? new Date() : null]
      );
      if (passed) {
        await connection.execute(
          `INSERT INTO student_progress
           (student_id, chapter_id, is_unlocked, is_completed, highest_score, unlocked_at)
           SELECT ?, next_ch.chapter_id, 1, 0, 0, CURRENT_TIMESTAMP
           FROM chapters current_ch
           JOIN chapters next_ch ON next_ch.course_id = current_ch.course_id
             AND next_ch.chapter_number = current_ch.chapter_number + 1
           WHERE current_ch.chapter_id = ?
           ON DUPLICATE KEY UPDATE is_unlocked = 1`,
          [studentId, chapterId]
        );
      }
      await connection.commit();
      const [attemptRows] = await database.execute("SELECT * FROM quiz_attempts WHERE attempt_id = ?", [attemptResult.insertId]);
      const [nextRows] = await database.execute(
        "SELECT chapter_id FROM student_progress WHERE student_id = ? AND chapter_id = ? + 1 AND is_unlocked = 1",
        [studentId, chapterId]
      );
      return {
        attempt: attemptRows[0],
        passed: Boolean(passed),
        score: correctCount,
        total_questions: total,
        percentage,
        nextChapterUnlocked: Boolean(passed && nextRows.length),
        nextChapterId: nextRows[0] ? nextRows[0].chapter_id : null,
        answerAudit
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getTopicGradebook(chapterId, sortBy = "surname", order = "asc") {
    const [rows] = await requirePool().execute(
      `SELECT u.user_id AS student_id, u.surname, u.first_name,
              CONCAT(u.surname, ', ', u.first_name) AS student_name,
              COALESCE(MAX(qa.score), 0) AS highest_score,
              COALESCE(MAX(qa.percentage), 0) AS highest_percentage,
              COALESCE(MAX(qa.passed), 0) AS has_passed,
              COUNT(qa.attempt_id) AS total_attempts,
              MAX(qa.attempted_at) AS last_attempt_at
       FROM users u
       LEFT JOIN quizzes q ON q.chapter_id = ? 
       LEFT JOIN quiz_attempts qa ON qa.quiz_id = q.quiz_id AND qa.student_id = u.user_id
       WHERE u.role = 'student'
       GROUP BY u.user_id, u.surname, u.first_name
       ORDER BY ${sortBy === "score" ? "highest_percentage" : "surname"} ${order === "desc" ? "DESC" : "ASC"}`,
      [chapterId]
    );
    return rows;
  },

  async getMasterGradebook() {
    const [chapters] = await requirePool().execute("SELECT chapter_number, chapter_title FROM chapters ORDER BY chapter_number");
    const [students] = await requirePool().execute(
      "SELECT user_id, surname, first_name, username FROM users WHERE role = 'student' ORDER BY surname"
    );
    const [attempts] = await requirePool().execute(
      `SELECT qa.student_id, ch.chapter_number, qa.score, qa.percentage, qa.passed
       FROM quiz_attempts qa JOIN quizzes q ON q.quiz_id = qa.quiz_id
       JOIN chapters ch ON ch.chapter_id = q.chapter_id`
    );
    const matrix = students.map((student) => {
      const chapterScores = {};
      let totalPassed = 0;
      let sumPercentages = 0;
      for (const chapter of chapters) {
        const values = attempts.filter((a) => a.student_id === student.user_id && a.chapter_number === chapter.chapter_number);
        const maxPercentage = values.length ? Math.max(...values.map((a) => Number(a.percentage))) : 0;
        const maxScore = values.length ? Math.max(...values.map((a) => Number(a.score))) : 0;
        const passed = values.some((a) => a.passed) ? 1 : 0;
        totalPassed += passed;
        sumPercentages += maxPercentage;
        chapterScores[chapter.chapter_number] = { score: maxScore, percentage: maxPercentage, passed, attempts: values.length };
      }
      return {
        student_id: student.user_id, surname: student.surname, first_name: student.first_name,
        student_name: `${student.surname}, ${student.first_name}`, chapterScores, totalPassed,
        totalChapters: chapters.length,
        averagePercentage: chapters.length ? Number((sumPercentages / chapters.length).toFixed(2)) : 0,
        completionRate: chapters.length ? Number(((totalPassed / chapters.length) * 100).toFixed(1)) : 0,
        isCompletedAll: totalPassed === chapters.length
      };
    });
    return {
      summary: {
        totalStudents: students.length,
        totalChapters: chapters.length,
        classAverage: students.length ? Number((matrix.reduce((sum, s) => sum + s.averagePercentage, 0) / students.length).toFixed(2)) : 0,
        certifiedGraduates: matrix.filter((s) => s.isCompletedAll).length
      },
      chapters,
      matrix
    };
  },

  async getStudentIndividualReport(studentId) {
    const [students] = await requirePool().execute(
      "SELECT user_id, username, first_name, surname FROM users WHERE user_id = ? AND role = 'student'",
      [studentId]
    );
    if (!students[0]) throw new Error("Student not found");
    const [chapters] = await requirePool().execute("SELECT * FROM chapters ORDER BY chapter_number");
    const [progress] = await requirePool().execute("SELECT * FROM student_progress WHERE student_id = ?", [studentId]);
    const [attempts] = await requirePool().execute(
      `SELECT qa.*, q.chapter_id FROM quiz_attempts qa
       JOIN quizzes q ON q.quiz_id = qa.quiz_id WHERE qa.student_id = ?`,
      [studentId]
    );
    const chapterReports = chapters.map((chapter) => {
      const currentProgress = progress.find((p) => p.chapter_id === chapter.chapter_id);
      const currentAttempts = attempts.filter((a) => a.chapter_id === chapter.chapter_id);
      return {
        chapter_number: chapter.chapter_number, chapter_title: chapter.chapter_title,
        module_title: chapter.module_title,
        is_unlocked: currentProgress ? currentProgress.is_unlocked : chapter.chapter_number === 1 ? 1 : 0,
        is_completed: currentProgress ? currentProgress.is_completed : 0,
        highest_score: currentProgress ? currentProgress.highest_score : 0,
        total_attempts: currentAttempts.length,
        attempts: currentAttempts.map((a) => ({
          score: a.score, percentage: a.percentage, passed: a.passed, attempted_at: a.attempted_at
        }))
      };
    });
    const passedCount = chapterReports.filter((chapter) => chapter.is_completed).length;
    return {
      student: {
        user_id: students[0].user_id, name: `${students[0].first_name} ${students[0].surname}`,
        surname: students[0].surname, first_name: students[0].first_name, username: students[0].username
      },
      course: await this.getCourse(),
      passedCount, totalChapters: chapters.length,
      overallProgress: chapters.length ? Number(((passedCount / chapters.length) * 100).toFixed(1)) : 0,
      averageScore: chapters.length
        ? Number((chapterReports.reduce((sum, chapter) => sum + Number(chapter.highest_score || 0), 0) / chapters.length).toFixed(2))
        : 0,
      chapters: chapterReports
    };
  }
};

module.exports = { initDB, db };
