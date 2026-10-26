const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const curriculum = require("../data/curriculumData");

const STORE_PATH = path.join(__dirname, "../data/lms-db.json");

let isMySQLActive = false;
let pool = null;
let memoryStore = null;

// Initialize or load the JSON store
function initMemoryStore() {
  if (fs.existsSync(STORE_PATH)) {
    try {
      const raw = fs.readFileSync(STORE_PATH, "utf8");
      memoryStore = JSON.parse(raw);
      console.log("[DB] Loaded existing persistent data store from", STORE_PATH);
      return;
    } catch (e) {
      console.warn("[DB] Could not parse existing store, re-seeding...", e.message);
    }
  }

  // Build clean fresh store from curriculumData
  const users = curriculum.defaultUsers.map((u, idx) => ({
    user_id: idx + 1,
    ...u,
    created_at: new Date().toISOString()
  }));

  const course = {
    course_id: 1,
    ...curriculum.courseData,
    created_at: new Date().toISOString()
  };

  const chapters = [];
  const quizzes = [];
  const quiz_questions = [];
  let questionCounter = 1;

  curriculum.chapters.forEach((ch, chIdx) => {
    const chapterId = chIdx + 1;
    chapters.push({
      chapter_id: chapterId,
      course_id: 1,
      chapter_number: ch.chapter_number,
      module_title: ch.module_title,
      chapter_title: ch.chapter_title,
      objectives: ch.objectives,
      summary_text: ch.summary_text,
      presentation_url: null,
      slides: ch.slides,
      created_at: new Date().toISOString()
    });

    const quizId = chapterId;
    quizzes.push({
      quiz_id: quizId,
      chapter_id: chapterId,
      title: ch.quiz.title,
      time_limit_minutes: ch.quiz.time_limit_minutes || 10,
      passing_percentage: ch.quiz.passing_percentage || 75.0,
      total_questions: ch.quiz.questions.length,
      created_at: new Date().toISOString()
    });

    ch.quiz.questions.forEach((q) => {
      quiz_questions.push({
        question_id: questionCounter++,
        quiz_id: quizId,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
        explanation: q.explanation || "",
        created_at: new Date().toISOString()
      });
    });
  });

  // Seed sample student progress and attempts for realistic gradebook demo
  const student_progress = [];
  const quiz_attempts = [];
  let attemptCounter = 1;

  // Student 1 (Juan Dela Cruz): passed Ch 1 (18/20 = 90%)
  student_progress.push({
    progress_id: 1,
    student_id: 2, // student1
    chapter_id: 1,
    is_unlocked: 1,
    is_completed: 1,
    highest_score: 90.0,
    unlocked_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    completed_at: new Date(Date.now() - 86400000).toISOString()
  });
  student_progress.push({
    progress_id: 2,
    student_id: 2,
    chapter_id: 2,
    is_unlocked: 1, // unlocked because ch 1 passed!
    is_completed: 0,
    highest_score: 0.0,
    unlocked_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: null
  });
  quiz_attempts.push({
    attempt_id: attemptCounter++,
    quiz_id: 1,
    student_id: 2,
    score: 18,
    total_questions: 20,
    percentage: 90.0,
    passed: 1,
    time_taken_seconds: 412,
    attempted_at: new Date(Date.now() - 86400000).toISOString()
  });

  // Student 2 (Maria Santos): passed Ch 1 (20/20 = 100%), passed Ch 2 (17/20 = 85%)
  student_progress.push({
    progress_id: 3,
    student_id: 3, // student2
    chapter_id: 1,
    is_unlocked: 1,
    is_completed: 1,
    highest_score: 100.0,
    unlocked_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    completed_at: new Date(Date.now() - 86400000 * 2).toISOString()
  });
  student_progress.push({
    progress_id: 4,
    student_id: 3,
    chapter_id: 2,
    is_unlocked: 1,
    is_completed: 1,
    highest_score: 85.0,
    unlocked_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    completed_at: new Date(Date.now() - 86400000).toISOString()
  });
  student_progress.push({
    progress_id: 5,
    student_id: 3,
    chapter_id: 3,
    is_unlocked: 1,
    is_completed: 0,
    highest_score: 0.0,
    unlocked_at: new Date(Date.now() - 86400000).toISOString(),
    completed_at: null
  });
  quiz_attempts.push({
    attempt_id: attemptCounter++,
    quiz_id: 1,
    student_id: 3,
    score: 20,
    total_questions: 20,
    percentage: 100.0,
    passed: 1,
    time_taken_seconds: 350,
    attempted_at: new Date(Date.now() - 86400000 * 2).toISOString()
  });
  quiz_attempts.push({
    attempt_id: attemptCounter++,
    quiz_id: 2,
    student_id: 3,
    score: 17,
    total_questions: 20,
    percentage: 85.0,
    passed: 1,
    time_taken_seconds: 480,
    attempted_at: new Date(Date.now() - 86400000).toISOString()
  });

  // Student 3 (Carlo Reyes): failed Ch 1 (12/20 = 60%) -> Ch 1 shows failed, Ch 2 locked!
  student_progress.push({
    progress_id: 6,
    student_id: 4, // student3
    chapter_id: 1,
    is_unlocked: 1,
    is_completed: 0,
    highest_score: 60.0,
    unlocked_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    completed_at: null
  });
  quiz_attempts.push({
    attempt_id: attemptCounter++,
    quiz_id: 1,
    student_id: 4,
    score: 12,
    total_questions: 20,
    percentage: 60.0,
    passed: 0,
    time_taken_seconds: 520,
    attempted_at: new Date(Date.now() - 86400000).toISOString()
  });

  // Student 4 (Ana Gomez): Honor student who passed all 12 chapters!
  for (let chNum = 1; chNum <= 12; chNum++) {
    const score = 18 + (chNum % 3); // 18, 19, or 20
    const pct = (score / 20) * 100;
    student_progress.push({
      progress_id: 6 + chNum,
      student_id: 5, // student4
      chapter_id: chNum,
      is_unlocked: 1,
      is_completed: 1,
      highest_score: pct,
      unlocked_at: new Date(Date.now() - 86400000 * (13 - chNum)).toISOString(),
      completed_at: new Date(Date.now() - 86400000 * (12 - chNum)).toISOString()
    });
    quiz_attempts.push({
      attempt_id: attemptCounter++,
      quiz_id: chNum,
      student_id: 5,
      score: score,
      total_questions: 20,
      percentage: pct,
      passed: 1,
      time_taken_seconds: 320 + chNum * 15,
      attempted_at: new Date(Date.now() - 86400000 * (12 - chNum)).toISOString()
    });
  }

  memoryStore = {
    users,
    course,
    chapters,
    quizzes,
    quiz_questions,
    student_progress,
    quiz_attempts,
    quiz_attempt_answers: []
  };

  saveMemoryStore();
  console.log("[DB] Seeded fresh LMS database with 12 chapters, 240 questions, and sample student attempts.");
}

function ensureStore() {
  if (!memoryStore) {
    initMemoryStore();
  }
}

function saveMemoryStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(memoryStore, null, 2), "utf8");
  } catch (err) {
    console.error("[DB] Error saving persistent store:", err.message);
  }
}

// Connect to DB (attempt MySQL, fallback to persistent JSON store)
async function initDB() {
  initMemoryStore();

  try {
    const testPool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "cloudcomputinglms",
      waitForConnections: true,
      connectionLimit: 5,
      connectTimeout: 2000
    });

    const conn = await testPool.getConnection();
    console.log("[DB] Connected to MySQL successfully! MySQL Mode Active.");
    conn.release();
    pool = testPool;
    isMySQLActive = true;
  } catch (error) {
    console.log(`[DB] MySQL not available (${error.code || error.message}). Running in Standalone Persistent Database mode.`);
    isMySQLActive = false;
  }
}

// Database helper functions
const db = {
  isMySQL() {
    return isMySQLActive;
  },

  async getCourse() {
    return memoryStore.course;
  },

  async getAllUsers() {
    return memoryStore.users.map(({ password_hash, ...u }) => u);
  },

  async findUserByUsername(username) {
    if (isMySQLActive) {
      const [rows] = await pool.execute(
        "SELECT user_id, username, password_hash, first_name, surname, role, is_active FROM users WHERE username = ? AND is_active = 1 LIMIT 1",
        [username.trim()]
      );
      return rows[0] || null;
    }
    return memoryStore.users.find((u) => u.username.toLowerCase() === username.toLowerCase().trim());
  },

  async findUserById(id) {
    if (isMySQLActive) {
      const [rows] = await pool.execute(
        "SELECT user_id, username, first_name, surname, role, is_active FROM users WHERE user_id = ? AND is_active = 1 LIMIT 1",
        [id]
      );
      return rows[0] || null;
    }
    const user = memoryStore.users.find((u) => u.user_id === Number(id));
    if (!user) return null;
    const { password_hash, ...safe } = user;
    return safe;
  },

  async createUser({ username, password_hash, first_name, surname }) {
    if (!isMySQLActive) {
      throw new Error("Database is unavailable. Registration requires an active MySQL connection.");
    }

    const existing = await this.findUserByUsername(username);
    if (existing) {
      throw new Error("Username already taken.");
    }

    const [result] = await pool.execute(
      "INSERT INTO users (username, password_hash, first_name, surname, role, is_active) VALUES (?, ?, ?, ?, 'student', 1)",
      [username.trim(), password_hash, first_name.trim(), surname.trim()]
    );
    const [rows] = await pool.execute(
      "SELECT user_id, username, first_name, surname, role, is_active FROM users WHERE user_id = ? LIMIT 1",
      [result.insertId]
    );
    return rows[0];
  },

  async getChaptersForUser(userId, role) {
    const isFaculty = role === "faculty";
    const userProgress = isFaculty
      ? []
      : memoryStore.student_progress.filter((p) => p.student_id === Number(userId));

    return memoryStore.chapters.map((ch) => {
      let is_unlocked = isFaculty ? 1 : 0;
      let is_completed = 0;
      let highest_score = 0;

      if (isFaculty) {
        is_unlocked = 1;
      } else {
        // Chapter 1 is unlocked by default for all students
        if (ch.chapter_number === 1) {
          is_unlocked = 1;
        }
        const prog = userProgress.find((p) => p.chapter_id === ch.chapter_id);
        if (prog) {
          is_unlocked = prog.is_unlocked ? 1 : is_unlocked;
          is_completed = prog.is_completed ? 1 : 0;
          highest_score = prog.highest_score || 0;
        }
      }

      return {
        chapter_id: ch.chapter_id,
        chapter_number: ch.chapter_number,
        module_title: ch.module_title,
        chapter_title: ch.chapter_title,
        is_unlocked,
        is_completed,
        highest_score,
        slides_count: ch.slides ? ch.slides.length : 0
      };
    });
  },

  async getChapterById(chapterId, userId, role) {
    const ch = memoryStore.chapters.find((c) => c.chapter_id === Number(chapterId));
    if (!ch) return null;

    const isFaculty = role === "faculty";
    let is_unlocked = isFaculty ? 1 : (ch.chapter_number === 1 ? 1 : 0);
    let is_completed = 0;
    let highest_score = 0;

    if (!isFaculty && userId) {
      const prog = memoryStore.student_progress.find(
        (p) => p.student_id === Number(userId) && p.chapter_id === Number(chapterId)
      );
      if (prog) {
        is_unlocked = prog.is_unlocked ? 1 : is_unlocked;
        is_completed = prog.is_completed ? 1 : 0;
        highest_score = prog.highest_score || 0;
      }
    }

    return {
      ...ch,
      is_unlocked,
      is_completed,
      highest_score
    };
  },

  async updateChapter(chapterId, { summary_text, presentation_url, slides, objectives, chapter_title }) {
    const ch = memoryStore.chapters.find((c) => c.chapter_id === Number(chapterId));
    if (!ch) throw new Error("Chapter not found");

    if (summary_text !== undefined) ch.summary_text = summary_text;
    if (presentation_url !== undefined) ch.presentation_url = presentation_url;
    if (slides !== undefined) ch.slides = slides;
    if (objectives !== undefined) ch.objectives = objectives;
    if (chapter_title !== undefined) ch.chapter_title = chapter_title;

    ch.updated_at = new Date().toISOString();
    saveMemoryStore();
    return ch;
  },

  async getQuizByChapterId(chapterId) {
    return memoryStore.quizzes.find((q) => q.chapter_id === Number(chapterId));
  },

  async getQuizQuestions(quizId, includeAnswers = false) {
    const questions = memoryStore.quiz_questions.filter((q) => q.quiz_id === Number(quizId));
    return questions.map((q) => {
      if (includeAnswers) {
        return { ...q };
      }
      const { correct_option, explanation, ...safeQ } = q;
      return safeQ;
    });
  },

  async addQuizQuestion(quizId, qData) {
    const newId = memoryStore.quiz_questions.length
      ? Math.max(...memoryStore.quiz_questions.map((q) => q.question_id)) + 1
      : 1;

    const newQuestion = {
      question_id: newId,
      quiz_id: Number(quizId),
      question_text: qData.question_text,
      option_a: qData.option_a,
      option_b: qData.option_b,
      option_c: qData.option_c,
      option_d: qData.option_d,
      correct_option: qData.correct_option.toUpperCase(),
      explanation: qData.explanation || "",
      created_at: new Date().toISOString()
    };

    memoryStore.quiz_questions.push(newQuestion);
    // Update quiz total_questions count
    const quiz = memoryStore.quizzes.find((q) => q.quiz_id === Number(quizId));
    if (quiz) {
      quiz.total_questions = memoryStore.quiz_questions.filter((q) => q.quiz_id === Number(quizId)).length;
    }
    saveMemoryStore();
    return newQuestion;
  },

  async updateQuizQuestion(questionId, qData) {
    const q = memoryStore.quiz_questions.find((q) => q.question_id === Number(questionId));
    if (!q) throw new Error("Question not found");

    if (qData.question_text !== undefined) q.question_text = qData.question_text;
    if (qData.option_a !== undefined) q.option_a = qData.option_a;
    if (qData.option_b !== undefined) q.option_b = qData.option_b;
    if (qData.option_c !== undefined) q.option_c = qData.option_c;
    if (qData.option_d !== undefined) q.option_d = qData.option_d;
    if (qData.correct_option !== undefined) q.correct_option = qData.correct_option.toUpperCase();
    if (qData.explanation !== undefined) q.explanation = qData.explanation;

    q.updated_at = new Date().toISOString();
    saveMemoryStore();
    return q;
  },

  async deleteQuizQuestion(questionId) {
    const idx = memoryStore.quiz_questions.findIndex((q) => q.question_id === Number(questionId));
    if (idx === -1) throw new Error("Question not found");
    const quizId = memoryStore.quiz_questions[idx].quiz_id;
    memoryStore.quiz_questions.splice(idx, 1);

    const quiz = memoryStore.quizzes.find((q) => q.quiz_id === quizId);
    if (quiz) {
      quiz.total_questions = memoryStore.quiz_questions.filter((q) => q.quiz_id === quizId).length;
    }
    saveMemoryStore();
    return true;
  },

  async resetChapterQuiz(chapterId) {
    const chIdx = Number(chapterId) - 1;
    if (chIdx < 0 || chIdx >= curriculum.chapters.length) throw new Error("Invalid chapter");
    const defaultCh = curriculum.chapters[chIdx];

    // Remove existing questions for this quiz
    memoryStore.quiz_questions = memoryStore.quiz_questions.filter((q) => q.quiz_id !== Number(chapterId));

    let maxId = memoryStore.quiz_questions.length
      ? Math.max(...memoryStore.quiz_questions.map((q) => q.question_id))
      : 0;

    defaultCh.quiz.questions.forEach((q) => {
      memoryStore.quiz_questions.push({
        question_id: ++maxId,
        quiz_id: Number(chapterId),
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_option: q.correct_option,
        explanation: q.explanation || "",
        created_at: new Date().toISOString()
      });
    });

    const quiz = memoryStore.quizzes.find((q) => q.quiz_id === Number(chapterId));
    if (quiz) {
      quiz.total_questions = defaultCh.quiz.questions.length;
    }
    saveMemoryStore();
    return true;
  },

  async submitQuizAttempt({ quizId, studentId, answers, timeTakenSeconds }) {
    const questions = memoryStore.quiz_questions.filter((q) => q.quiz_id === Number(quizId));
    const total = questions.length;
    if (total === 0) throw new Error("No questions in this quiz.");

    let correctCount = 0;
    const answerAudit = [];

    questions.forEach((q) => {
      const selected = answers[q.question_id] || "";
      const isCorrect = selected.toUpperCase() === q.correct_option.toUpperCase();
      if (isCorrect) correctCount++;
      answerAudit.push({
        question_id: q.question_id,
        question_text: q.question_text,
        selected_option: selected,
        correct_option: q.correct_option,
        is_correct: isCorrect ? 1 : 0,
        explanation: q.explanation
      });
    });

    const percentage = Number(((correctCount / total) * 100).toFixed(2));
    const passed = percentage >= 75.0 ? 1 : 0;

    const newAttemptId = memoryStore.quiz_attempts.length
      ? Math.max(...memoryStore.quiz_attempts.map((a) => a.attempt_id)) + 1
      : 1;

    const attemptRecord = {
      attempt_id: newAttemptId,
      quiz_id: Number(quizId),
      student_id: Number(studentId),
      score: correctCount,
      total_questions: total,
      percentage,
      passed,
      time_taken_seconds: timeTakenSeconds || 0,
      attempted_at: new Date().toISOString()
    };
    memoryStore.quiz_attempts.push(attemptRecord);

    // Save answer audits
    answerAudit.forEach((aud) => {
      memoryStore.quiz_attempt_answers.push({
        answer_id: memoryStore.quiz_attempt_answers.length + 1,
        attempt_id: newAttemptId,
        question_id: aud.question_id,
        selected_option: aud.selected_option,
        is_correct: aud.is_correct
      });
    });

    // Update student progress and SEQUENTIAL UNLOCKING logic
    const quiz = memoryStore.quizzes.find((q) => q.quiz_id === Number(quizId));
    const currentChapterId = quiz ? quiz.chapter_id : Number(quizId);

    let progress = memoryStore.student_progress.find(
      (p) => p.student_id === Number(studentId) && p.chapter_id === currentChapterId
    );

    if (!progress) {
      progress = {
        progress_id: memoryStore.student_progress.length + 1,
        student_id: Number(studentId),
        chapter_id: currentChapterId,
        is_unlocked: 1,
        is_completed: 0,
        highest_score: percentage,
        unlocked_at: new Date().toISOString(),
        completed_at: passed ? new Date().toISOString() : null
      };
      memoryStore.student_progress.push(progress);
    } else {
      if (percentage > (progress.highest_score || 0)) {
        progress.highest_score = percentage;
      }
      if (passed && !progress.is_completed) {
        progress.is_completed = 1;
        progress.completed_at = new Date().toISOString();
      }
    }

    // GATING UNLOCK LOGIC:
    // If student PASSED (>= 75%), unlock Chapter N+1
    let nextChapterUnlocked = false;
    let nextChapterId = null;

    if (passed) {
      const currentCh = memoryStore.chapters.find((c) => c.chapter_id === currentChapterId);
      if (currentCh && currentCh.chapter_number < 12) {
        const nextCh = memoryStore.chapters.find((c) => c.chapter_number === currentCh.chapter_number + 1);
        if (nextCh) {
          nextChapterId = nextCh.chapter_id;
          let nextProg = memoryStore.student_progress.find(
            (p) => p.student_id === Number(studentId) && p.chapter_id === nextCh.chapter_id
          );
          if (!nextProg) {
            nextProg = {
              progress_id: memoryStore.student_progress.length + 1,
              student_id: Number(studentId),
              chapter_id: nextCh.chapter_id,
              is_unlocked: 1,
              is_completed: 0,
              highest_score: 0.0,
              unlocked_at: new Date().toISOString(),
              completed_at: null
            };
            memoryStore.student_progress.push(nextProg);
            nextChapterUnlocked = true;
          } else if (!nextProg.is_unlocked) {
            nextProg.is_unlocked = 1;
            nextProg.unlocked_at = new Date().toISOString();
            nextChapterUnlocked = true;
          }
        }
      }
    }

    saveMemoryStore();

    return {
      attempt: attemptRecord,
      passed: Boolean(passed),
      score: correctCount,
      total_questions: total,
      percentage,
      nextChapterUnlocked,
      nextChapterId,
      answerAudit
    };
  },

  async getTopicGradebook(chapterId, sortBy = "surname", order = "asc") {
    const chId = Number(chapterId);
    const quiz = memoryStore.quizzes.find((q) => q.chapter_id === chId);
    if (!quiz) return [];

    const students = memoryStore.users.filter((u) => u.role === "student");
    const attempts = memoryStore.quiz_attempts.filter((a) => a.quiz_id === quiz.quiz_id);

    const rows = students.map((stu) => {
      const stuAttempts = attempts.filter((a) => a.student_id === stu.user_id);
      const totalAttempts = stuAttempts.length;
      let highestScore = 0;
      let highestPct = 0;
      let hasPassed = 0;
      let lastAttemptAt = null;

      if (totalAttempts > 0) {
        stuAttempts.sort((a, b) => new Date(b.attempted_at) - new Date(a.attempted_at));
        lastAttemptAt = stuAttempts[0].attempted_at;
        highestScore = Math.max(...stuAttempts.map((a) => a.score));
        highestPct = Math.max(...stuAttempts.map((a) => a.percentage));
        hasPassed = stuAttempts.some((a) => a.passed) ? 1 : 0;
      }

      return {
        student_id: stu.user_id,
        surname: stu.surname,
        first_name: stu.first_name,
        student_name: `${stu.surname}, ${stu.first_name}`,
        total_attempts: totalAttempts,
        highest_score: highestScore,
        highest_percentage: highestPct,
        has_passed: hasPassed,
        last_attempt_at: lastAttemptAt
      };
    });

    rows.sort((a, b) => {
      if (sortBy === "score") {
        return order === "desc"
          ? b.highest_percentage - a.highest_percentage
          : a.highest_percentage - b.highest_percentage;
      }
      // default: surname
      const cmp = a.surname.localeCompare(b.surname);
      return order === "desc" ? -cmp : cmp;
    });

    return rows;
  },

  async getMasterGradebook() {
    const students = memoryStore.users.filter((u) => u.role === "student");
    const chapters = memoryStore.chapters;
    const quizzes = memoryStore.quizzes;
    const attempts = memoryStore.quiz_attempts;

    const matrix = students.map((stu) => {
      const chapterScores = {};
      let totalPassed = 0;
      let sumPercentages = 0;

      chapters.forEach((ch) => {
        const quiz = quizzes.find((q) => q.chapter_id === ch.chapter_id);
        if (!quiz) {
          chapterScores[ch.chapter_number] = { score: 0, percentage: 0, passed: 0, attempts: 0 };
          return;
        }

        const stuAttempts = attempts.filter(
          (a) => a.quiz_id === quiz.quiz_id && a.student_id === stu.user_id
        );

        if (stuAttempts.length === 0) {
          chapterScores[ch.chapter_number] = { score: 0, percentage: 0, passed: 0, attempts: 0 };
        } else {
          const maxPct = Math.max(...stuAttempts.map((a) => a.percentage));
          const maxScore = Math.max(...stuAttempts.map((a) => a.score));
          const passed = stuAttempts.some((a) => a.passed) ? 1 : 0;
          if (passed) totalPassed++;
          sumPercentages += maxPct;
          chapterScores[ch.chapter_number] = {
            score: maxScore,
            percentage: maxPct,
            passed,
            attempts: stuAttempts.length
          };
        }
      });

      const averagePercentage = Number((sumPercentages / chapters.length).toFixed(2));
      const completionRate = Number(((totalPassed / chapters.length) * 100).toFixed(1));

      return {
        student_id: stu.user_id,
        surname: stu.surname,
        first_name: stu.first_name,
        student_name: `${stu.surname}, ${stu.first_name}`,
        chapterScores,
        totalPassed,
        totalChapters: chapters.length,
        averagePercentage,
        completionRate,
        isCompletedAll: totalPassed === chapters.length
      };
    });

    // Sort alphabetically by surname
    matrix.sort((a, b) => a.surname.localeCompare(b.surname));

    // Calculate class global analytics KPIs
    const totalStudents = students.length;
    const classAvg = totalStudents
      ? Number((matrix.reduce((acc, s) => acc + s.averagePercentage, 0) / totalStudents).toFixed(2))
      : 0;
    const certifiedCount = matrix.filter((s) => s.isCompletedAll).length;

    return {
      summary: {
        totalStudents,
        totalChapters: chapters.length,
        classAverage: classAvg,
        certifiedGraduates: certifiedCount
      },
      chapters: chapters.map((c) => ({
        chapter_number: c.chapter_number,
        chapter_title: c.chapter_title
      })),
      matrix
    };
  },

  async getStudentIndividualReport(studentId) {
    const stu = memoryStore.users.find((u) => u.user_id === Number(studentId));
    if (!stu) throw new Error("Student not found");

    const chapters = memoryStore.chapters;
    const attempts = memoryStore.quiz_attempts.filter((a) => a.student_id === Number(studentId));
    const progress = memoryStore.student_progress.filter((p) => p.student_id === Number(studentId));

    const chapterReports = chapters.map((ch) => {
      const chProgress = progress.find((p) => p.chapter_id === ch.chapter_id);
      const chAttempts = attempts.filter((a) => a.quiz_id === ch.chapter_id);

      return {
        chapter_number: ch.chapter_number,
        chapter_title: ch.chapter_title,
        module_title: ch.module_title,
        is_unlocked: chProgress ? chProgress.is_unlocked : (ch.chapter_number === 1 ? 1 : 0),
        is_completed: chProgress ? chProgress.is_completed : 0,
        highest_score: chProgress ? chProgress.highest_score : 0,
        total_attempts: chAttempts.length,
        attempts: chAttempts.map((a) => ({
          score: a.score,
          percentage: a.percentage,
          passed: a.passed,
          attempted_at: a.attempted_at
        }))
      };
    });

    const passedCount = chapterReports.filter((c) => c.is_completed).length;
    const avgScore = passedCount
      ? Number(
          (
            chapterReports.reduce((acc, c) => acc + (c.highest_score || 0), 0) /
            chapterReports.length
          ).toFixed(2)
        )
      : 0;

    return {
      student: {
        user_id: stu.user_id,
        name: `${stu.first_name} ${stu.surname}`,
        surname: stu.surname,
        first_name: stu.first_name,
        username: stu.username
      },
      course: memoryStore.course,
      passedCount,
      totalChapters: chapters.length,
      overallProgress: Number(((passedCount / chapters.length) * 100).toFixed(1)),
      averageScore: avgScore,
      chapters: chapterReports
    };
  }
};

// Initialize memory store immediately so db methods are ready upon import
initMemoryStore();

module.exports = {
  initDB,
  db
};
