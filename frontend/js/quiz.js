// Quiz & Assessment System
import { state } from "./state.js";
import { api } from "./api.js";

let currentQuestionIndex = 0;

export async function renderQuizWorkspace(container) {
  const chapter = state.activeChapter;
  if (!chapter) return;

  // If user is not logged in, prompt login
  if (!state.user) {
    container.innerHTML = `
      <div class="quiz-auth-gate">
        <div class="gate-icon">🔒</div>
        <h3>Authentication Required</h3>
        <p>Please log in with your Student or Faculty account to take Chapter ${chapter.chapter_number}'s Assessment.</p>
        <button class="btn btn-primary" id="btnQuizLoginPrompt">Log In to Begin</button>
      </div>
    `;
    document.getElementById("btnQuizLoginPrompt")?.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("open_auth_modal"));
    });
    return;
  }

  // If student and chapter is locked
  if (state.user.role === "student" && !chapter.is_unlocked) {
    container.innerHTML = `
      <div class="quiz-locked-gate">
        <div class="gate-icon">🔒</div>
        <h3>Chapter ${chapter.chapter_number} Quiz Locked</h3>
        <p>You must pass Chapter ${chapter.chapter_number - 1}'s quiz with at least <strong>75% (15/20)</strong> before this assessment unlocks.</p>
        <button class="btn btn-secondary" id="btnGoToPrevChapter">Go to Chapter ${chapter.chapter_number - 1}</button>
      </div>
    `;
    document.getElementById("btnGoToPrevChapter")?.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("navigate_chapter", { detail: chapter.chapter_number - 1 }));
    });
    return;
  }

  // Check if a quiz is already active in state
  if (state.quiz && !state.quizSubmitted) {
    renderActiveQuiz(container);
    return;
  }

  // Check if showing completed result in state
  if (state.quizSubmitted && state.quizResult) {
    renderQuizResult(container);
    return;
  }

  // Otherwise show Quiz Intro Card
  renderQuizIntro(container);
}

function renderQuizIntro(container) {
  const chapter = state.activeChapter;
  const isFaculty = state.user?.role === "faculty";

  container.innerHTML = `
    <div class="quiz-intro-card animate-fade-in">
      <div class="quiz-intro-badge">Chapter ${chapter.chapter_number} Assessment</div>
      <h2 class="quiz-intro-title">Cloud Computing Knowledge Evaluation</h2>
      <p class="quiz-intro-desc">
        Test your mastery of <strong>${escapeHtml(chapter.chapter_title)}</strong>. 
        ${
          !isFaculty
            ? `Achieving <strong>&ge; 75%</strong> is required to unlock Chapter ${chapter.chapter_number + 1}.`
            : `<span class="badge-role-faculty">Faculty Testing Mode (All chapters unlocked)</span>`
        }
      </p>

      <div class="quiz-stats-grid">
        <div class="stat-box">
          <span class="stat-icon">⏱️</span>
          <div class="stat-val">10 Mins</div>
          <div class="stat-lbl">Time Limit</div>
        </div>
        <div class="stat-box">
          <span class="stat-icon">❓</span>
          <div class="stat-val">20 Items</div>
          <div class="stat-lbl">Multiple Choice</div>
        </div>
        <div class="stat-box">
          <span class="stat-icon">🎯</span>
          <div class="stat-val">75% (15/20)</div>
          <div class="stat-lbl">Passing Score</div>
        </div>
        <div class="stat-box">
          <span class="stat-icon">🔓</span>
          <div class="stat-val">Sequential</div>
          <div class="stat-lbl">Gating Rule</div>
        </div>
      </div>

      <div class="quiz-instructions">
        <h4>Assessment Rules & Guidelines:</h4>
        <ul>
          <li>The countdown timer starts immediately once you click <strong>Start 20-Item Quiz</strong>.</li>
          <li>You can navigate freely between questions using the Question Navigator grid.</li>
          <li>If the timer reaches 00:00, your exam will be automatically submitted with current answers.</li>
          <li>You can retake this quiz as many times as needed to achieve the 75% passing threshold.</li>
        </ul>
      </div>

      <div class="quiz-intro-actions">
        <button class="btn btn-primary btn-lg" id="btnStartQuiz">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          Start 20-Item Quiz
        </button>
      </div>
    </div>
  `;

  document.getElementById("btnStartQuiz")?.addEventListener("click", async () => {
    try {
      const btn = document.getElementById("btnStartQuiz");
      btn.disabled = true;
      btn.innerText = "Loading Questions...";
      const res = await api.getQuiz(chapter.chapter_id);
      if (res.success && res.quiz) {
        currentQuestionIndex = 0;
        state.startQuiz(res.quiz);
        renderActiveQuiz(container);
      }
    } catch (err) {
      alert("Error starting quiz: " + err.message);
    }
  });
}

function renderActiveQuiz(container) {
  const quiz = state.quiz;
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    container.innerHTML = `<div class="empty-state">No questions found for this quiz.</div>`;
    return;
  }

  const questions = quiz.questions;
  const total = questions.length;
  const q = questions[currentQuestionIndex];
  const answeredCount = Object.keys(state.quizAnswers).length;
  const selected = state.quizAnswers[q.question_id] || "";

  // Timer formatted mm:ss
  const mins = Math.floor(state.quizTimerSeconds / 60);
  const secs = state.quizTimerSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  const isTimeCritical = state.quizTimerSeconds < 120; // under 2 mins

  container.innerHTML = `
    <div class="active-quiz-container animate-fade-in">
      <!-- Sticky Quiz Top Header Bar -->
      <div class="quiz-top-bar">
        <div class="quiz-meta-info">
          <span class="quiz-meta-title">Ch ${state.activeChapter.chapter_number} Quiz</span>
          <span class="quiz-progress-text">Answered <strong>${answeredCount}</strong> of ${total}</span>
        </div>

        <div class="quiz-timer-pill ${isTimeCritical ? "timer-warning pulse-anim" : ""}" id="timerDisplay">
          <span class="timer-icon">⏱️</span>
          <span class="timer-digits">${timeFormatted}</span>
        </div>

        <button class="btn btn-danger btn-sm" id="btnSubmitQuizHeader">Finish & Submit</button>
      </div>

      <!-- Two Column Layout: Question Area + Question Navigator -->
      <div class="quiz-body-layout">
        <!-- Main Question Area -->
        <div class="quiz-question-area">
          <div class="question-card">
            <div class="question-header">
              <span class="question-num-badge">Question ${currentQuestionIndex + 1} of ${total}</span>
            </div>

            <h3 class="question-text">${escapeHtml(q.question_text)}</h3>

            <!-- Options List -->
            <div class="options-group">
              ${["A", "B", "C", "D"]
                .map((optKey) => {
                  const optField = `option_${optKey.toLowerCase()}`;
                  const optText = q[optField];
                  if (!optText) return "";
                  const isChecked = selected === optKey;
                  return `
                  <label class="option-row ${isChecked ? "selected" : ""}" data-option="${optKey}">
                    <input type="radio" name="opt_${q.question_id}" value="${optKey}" ${isChecked ? "checked" : ""} class="option-radio">
                    <span class="option-key-badge">${optKey}</span>
                    <span class="option-label-text">${escapeHtml(optText)}</span>
                  </label>
                `;
                })
                .join("")}
            </div>

            <!-- Bottom Question Nav -->
            <div class="question-footer-nav">
              <button class="btn btn-secondary" id="btnPrevQuestion" ${currentQuestionIndex === 0 ? "disabled" : ""}>
                &larr; Previous
              </button>

              <div class="footer-center-status">
                ${selected ? `<span class="saved-tag">✓ Answer Saved</span>` : `<span class="unanswered-tag">Unanswered</span>`}
              </div>

              ${
                currentQuestionIndex < total - 1
                  ? `<button class="btn btn-primary" id="btnNextQuestion">Next &rarr;</button>`
                  : `<button class="btn btn-success" id="btnFinalSubmit">Review & Submit</button>`
              }
            </div>
          </div>
        </div>

        <!-- Right Sidebar: Question Navigator Grid -->
        <div class="quiz-navigator-sidebar">
          <div class="nav-sidebar-card">
            <div class="nav-card-title">Question Grid (20 Items)</div>
            <div class="questions-grid">
              ${questions
                .map((quest, i) => {
                  const isAns = Boolean(state.quizAnswers[quest.question_id]);
                  const isCurrent = i === currentQuestionIndex;
                  return `
                  <button class="q-grid-pill ${isCurrent ? "current" : ""} ${isAns ? "answered" : ""}" data-q-index="${i}">
                    ${i + 1}
                  </button>
                `;
                })
                .join("")}
            </div>

            <div class="grid-legend">
              <span class="legend-item"><span class="legend-dot answered"></span> Answered</span>
              <span class="legend-item"><span class="legend-dot current"></span> Current</span>
              <span class="legend-item"><span class="legend-dot"></span> Unanswered</span>
            </div>

            <button class="btn btn-primary btn-block mt-3" id="btnSubmitFromGrid">Submit Exam</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach handlers
  document.querySelectorAll(".option-row").forEach((row) => {
    row.addEventListener("click", () => {
      const opt = row.dataset.option;
      state.setQuizAnswer(q.question_id, opt);
      renderActiveQuiz(container);
    });
  });

  document.querySelectorAll(".q-grid-pill").forEach((pill) => {
    pill.addEventListener("click", (e) => {
      currentQuestionIndex = Number(e.currentTarget.dataset.qIndex);
      renderActiveQuiz(container);
    });
  });

  document.getElementById("btnPrevQuestion")?.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderActiveQuiz(container);
    }
  });

  document.getElementById("btnNextQuestion")?.addEventListener("click", () => {
    if (currentQuestionIndex < total - 1) {
      currentQuestionIndex++;
      renderActiveQuiz(container);
    }
  });

  const handleSubmit = async () => {
    const unanswered = total - Object.keys(state.quizAnswers).length;
    if (unanswered > 0) {
      const confirmSubmit = confirm(
        `You have ${unanswered} unanswered question(s). Are you sure you want to finish and submit now?`
      );
      if (!confirmSubmit) return;
    }

    try {
      const timeTaken = (quiz.time_limit_minutes || 10) * 60 - state.quizTimerSeconds;
      const res = await api.submitQuizAttempt(state.activeChapter.chapter_id, state.quizAnswers, timeTaken);
      if (res.success && res.result) {
        state.setQuizResult(res.result);
        // Refresh chapter list so sidebar reflects newly unlocked chapters!
        const chListRes = await api.getChapters();
        if (chListRes.success) {
          state.setChapters(chListRes.chapters);
        }
        renderQuizResult(container);
      }
    } catch (err) {
      alert("Submission error: " + err.message);
    }
  };

  document.getElementById("btnFinalSubmit")?.addEventListener("click", handleSubmit);
  document.getElementById("btnSubmitFromGrid")?.addEventListener("click", handleSubmit);
  document.getElementById("btnSubmitQuizHeader")?.addEventListener("click", handleSubmit);
}

function renderQuizResult(container) {
  const result = state.quizResult;
  if (!result) return;

  const passed = result.passed;
  const percentage = result.percentage;
  const score = result.score;
  const total = result.total_questions;
  const chapter = state.activeChapter;

  container.innerHTML = `
    <div class="quiz-result-container animate-fade-in">
      <!-- Result Hero Banner -->
      <div class="result-banner ${passed ? "banner-pass" : "banner-fail"}">
        <div class="result-badge-icon">${passed ? "🎉" : "⚠️"}</div>
        <h2 class="result-headline">${passed ? "Assessment Passed!" : "Assessment Failed"}</h2>
        <p class="result-subtext">
          ${
            passed
              ? `Outstanding performance! You scored <strong>${score} out of ${total}</strong> (${percentage}%). Passing mark is 75%.`
              : `You scored <strong>${score} out of ${total}</strong> (${percentage}%). Minimum 75% (15/20) is required to pass.`
          }
        </p>

        ${
          passed && result.nextChapterUnlocked
            ? `
          <div class="unlock-alert">
            <span class="unlock-icon">🔓</span>
            <strong>Chapter ${chapter.chapter_number + 1} has been unlocked!</strong> You can now proceed to the next module.
          </div>
        `
            : ""
        }

        ${
          !passed
            ? `
          <div class="retry-alert">
            <span class="retry-icon">📖</span>
            <strong>Gating Notice:</strong> Chapter ${chapter.chapter_number + 1} remains locked. Please review the slide deck and retake the quiz to proceed.
          </div>
        `
            : ""
        }

        <div class="result-actions-row">
          <button class="btn btn-primary" id="btnRetakeQuiz">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
            Retake Quiz
          </button>
          ${
            passed && chapter.chapter_number < 12
              ? `
            <button class="btn btn-success" id="btnNextChapterFromQuiz">
              Proceed to Chapter ${chapter.chapter_number + 1} &rarr;
            </button>
          `
              : ""
          }
        </div>
      </div>

      <!-- Detailed Question by Question Audit Review -->
      <div class="audit-review-section">
        <div class="audit-header">
          <h3>Question Review & Detailed Explanations</h3>
          <p>Review every question to understand correct answers and core Cloud Computing concepts.</p>
        </div>

        <div class="audit-list">
          ${(result.answerAudit || [])
            .map((aud, idx) => {
              const isCorrect = aud.is_correct;
              return `
              <div class="audit-card ${isCorrect ? "audit-correct" : "audit-wrong"}">
                <div class="audit-card-top">
                  <span class="audit-q-num">Item ${idx + 1}</span>
                  <span class="audit-status-badge ${isCorrect ? "status-correct" : "status-wrong"}">
                    ${isCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                </div>
                <h4 class="audit-q-text">${escapeHtml(aud.question_text)}</h4>

                <div class="audit-answers-row">
                  <div class="audit-ans-chip">
                    <span class="ans-lbl">Your Answer:</span>
                    <strong>Option ${aud.selected_option || "None"}</strong>
                  </div>
                  <div class="audit-ans-chip correct-chip">
                    <span class="ans-lbl">Correct Answer:</span>
                    <strong>Option ${aud.correct_option}</strong>
                  </div>
                </div>

                ${
                  aud.explanation
                    ? `
                  <div class="audit-explanation-box">
                    <strong>💡 Concept Explanation:</strong>
                    <p>${escapeHtml(aud.explanation)}</p>
                  </div>
                `
                    : ""
                }
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    </div>
  `;

  document.getElementById("btnRetakeQuiz")?.addEventListener("click", () => {
    state.quizSubmitted = false;
    state.quizResult = null;
    renderQuizIntro(container);
  });

  document.getElementById("btnNextChapterFromQuiz")?.addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("navigate_chapter", { detail: chapter.chapter_number + 1 }));
  });
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

