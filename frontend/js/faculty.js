// Faculty Authoring & Curriculum Management Tools
import { state } from "./state.js";
import { api } from "./api.js";

export async function renderFacultyManager(container) {
  const chapter = state.activeChapter;
  if (!chapter) return;

  if (state.user?.role !== "faculty") {
    container.innerHTML = `
      <div class="alert-error">
        Access Restricted: You must be logged in as Faculty to manage curriculum and author assessment items.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="faculty-workspace animate-fade-in">
      <div class="faculty-header-bar">
        <div>
          <h3>Faculty Management: Chapter ${chapter.chapter_number}</h3>
          <p class="text-muted">Author slide content, manage lesson summaries, and customize quiz question banks.</p>
        </div>
        <div class="faculty-actions-header">
          <button class="btn btn-warning btn-sm" id="btnResetDefaultQuiz">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
            Reset Default 20 Questions
          </button>
        </div>
      </div>

      <!-- Navigation Tabs inside Faculty Tools -->
      <div class="faculty-subtabs">
        <button class="subtab-btn active" data-subtab="slides-manager">Slide Deck Editor (${chapter.slides ? chapter.slides.length : 0} Slides)</button>
        <button class="subtab-btn" data-subtab="summary-manager">Lesson Summary & Objectives</button>
        <button class="subtab-btn" data-subtab="quiz-manager">Quiz Bank Authoring</button>
      </div>

      <div class="faculty-subtab-content" id="facultySubtabContent">
        <!-- Rendered dynamically below -->
      </div>
    </div>
  `;

  // Attach subtab switcher
  document.querySelectorAll(".subtab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".subtab-btn").forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      const target = e.currentTarget.dataset.subtab;
      loadSubtab(target);
    });
  });

  // Default load slides editor
  loadSubtab("slides-manager");

  // Reset default quiz handler
  document.getElementById("btnResetDefaultQuiz")?.addEventListener("click", async () => {
    const confirmReset = confirm(
      `Are you sure you want to reset Chapter ${chapter.chapter_number} quiz back to the default 20 pre-populated questions?`
    );
    if (!confirmReset) return;

    try {
      await api.resetQuiz(chapter.chapter_id);
      alert("Quiz successfully reset to default 20 curated questions!");
      loadSubtab("quiz-manager");
    } catch (err) {
      alert("Error resetting quiz: " + err.message);
    }
  });

  async function loadSubtab(subtab) {
    const subContainer = document.getElementById("facultySubtabContent");
    if (!subContainer) return;

    if (subtab === "slides-manager") {
      renderSlideManager(subContainer);
    } else if (subtab === "summary-manager") {
      renderSummaryManager(subContainer);
    } else if (subtab === "quiz-manager") {
      await renderQuizBankManager(subContainer);
    }
  }

  function renderSlideManager(subContainer) {
    const slides = chapter.slides || [];

    subContainer.innerHTML = `
      <div class="slide-manager-card">
        <div class="slide-manager-top">
          <h4>Interactive Slide Deck Items</h4>
          <button class="btn btn-primary btn-sm" id="btnAddNewSlide">+ Add New Slide</button>
        </div>

        <div class="slides-list">
          ${slides
            .map((s, idx) => {
              return `
              <div class="slide-edit-item" data-slide-idx="${idx}">
                <div class="slide-item-left">
                  <span class="slide-item-badge">Slide ${idx + 1}</span>
                  <div>
                    <strong>${escapeHtml(s.title)}</strong>
                    <div class="text-xs text-muted">${escapeHtml(s.subtitle || "No subtitle")}</div>
                  </div>
                </div>
                <div class="slide-item-actions">
                  <button class="btn btn-secondary btn-sm btn-edit-slide" data-idx="${idx}">Edit Slide</button>
                  <button class="btn btn-danger btn-sm btn-delete-slide" data-idx="${idx}">Delete</button>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>

        <!-- Custom Presentation Embed Section -->
        <div class="custom-embed-box mt-4">
          <h4>Custom Presentation Embed URL (Optional)</h4>
          <p class="text-xs text-muted">Override or complement the interactive deck with an external slide deck (e.g. Google Slides, PDF, OneDrive PPTX embed URL).</p>
          <div class="form-row">
            <input type="url" id="presentationUrlInput" class="form-control" placeholder="https://docs.google.com/presentation/d/.../embed" value="${escapeHtml(chapter.presentation_url || "")}">
            <button class="btn btn-secondary" id="btnSaveEmbedUrl">Save URL</button>
          </div>
        </div>
      </div>

      <!-- Slide Edit Modal / Form Container -->
      <div id="slideModalMount"></div>
    `;

    document.querySelectorAll(".btn-edit-slide").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.dataset.idx);
        openSlideEditModal(idx);
      });
    });

    document.querySelectorAll(".btn-delete-slide").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const idx = Number(e.currentTarget.dataset.idx);
        if (slides.length <= 1) {
          alert("Cannot delete the only slide in the deck.");
          return;
        }
        if (confirm(`Delete Slide ${idx + 1}?`)) {
          slides.splice(idx, 1);
          await api.updateChapter(chapter.chapter_id, { slides });
          chapter.slides = slides;
          state.setActiveChapter(chapter);
          renderSlideManager(subContainer);
        }
      });
    });

    document.getElementById("btnAddNewSlide")?.addEventListener("click", () => {
      openSlideEditModal(-1); // -1 = new slide
    });

    document.getElementById("btnSaveEmbedUrl")?.addEventListener("click", async () => {
      const url = document.getElementById("presentationUrlInput").value.trim();
      await api.updateChapter(chapter.chapter_id, { presentation_url: url });
      chapter.presentation_url = url;
      alert("Presentation URL saved!");
    });
  }

  function openSlideEditModal(slideIdx) {
    const slides = chapter.slides || [];
    const isNew = slideIdx === -1;
    const slide = isNew
      ? {
          title: "New Cloud Slide",
          subtitle: "Key Concepts",
          bullets: ["Point 1", "Point 2"],
          diagram: "",
          keyTakeaway: "",
          notes: ""
        }
      : slides[slideIdx];

    const modalMount = document.getElementById("slideModalMount");
    modalMount.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-card modal-lg">
          <div class="modal-header">
            <h3>${isNew ? "Add New Slide" : `Edit Slide ${slideIdx + 1}`}</h3>
            <button class="modal-close" id="btnCloseSlideModal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Slide Title *</label>
              <input type="text" id="editSlideTitle" class="form-control" value="${escapeHtml(slide.title)}">
            </div>
            <div class="form-group">
              <label>Subtitle / Category</label>
              <input type="text" id="editSlideSubtitle" class="form-control" value="${escapeHtml(slide.subtitle || "")}">
            </div>
            <div class="form-group">
              <label>Bullet Points (One per line) *</label>
              <textarea id="editSlideBullets" class="form-control" rows="4">${(slide.bullets || []).join("\n")}</textarea>
            </div>
            <div class="form-group">
              <label>Architecture Diagram / ASCII Art / Code Snippet</label>
              <textarea id="editSlideDiagram" class="form-control font-mono" rows="4">${escapeHtml(slide.diagram || "")}</textarea>
            </div>
            <div class="form-group">
              <label>Key Takeaway</label>
              <input type="text" id="editSlideTakeaway" class="form-control" value="${escapeHtml(slide.keyTakeaway || "")}">
            </div>
            <div class="form-group">
              <label>Presenter Notes (Faculty Only)</label>
              <textarea id="editSlideNotes" class="form-control" rows="2">${escapeHtml(slide.notes || "")}</textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btnCancelSlideModal">Cancel</button>
            <button class="btn btn-primary" id="btnSaveSlideModal">Save Slide Changes</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btnCloseSlideModal")?.addEventListener("click", () => {
      modalMount.innerHTML = "";
    });
    document.getElementById("btnCancelSlideModal")?.addEventListener("click", () => {
      modalMount.innerHTML = "";
    });

    document.getElementById("btnSaveSlideModal")?.addEventListener("click", async () => {
      const title = document.getElementById("editSlideTitle").value.trim();
      const subtitle = document.getElementById("editSlideSubtitle").value.trim();
      const bulletsRaw = document.getElementById("editSlideBullets").value.trim();
      const diagram = document.getElementById("editSlideDiagram").value;
      const keyTakeaway = document.getElementById("editSlideTakeaway").value.trim();
      const notes = document.getElementById("editSlideNotes").value.trim();

      if (!title || !bulletsRaw) {
        alert("Title and at least one bullet point are required.");
        return;
      }

      const bullets = bulletsRaw.split("\n").map((b) => b.trim()).filter(Boolean);
      const updatedSlide = {
        title,
        subtitle,
        bullets,
        diagram,
        keyTakeaway,
        notes
      };

      if (isNew) {
        slides.push(updatedSlide);
      } else {
        slides[slideIdx] = updatedSlide;
      }

      try {
        await api.updateChapter(chapter.chapter_id, { slides });
        chapter.slides = slides;
        state.setActiveChapter(chapter);
        modalMount.innerHTML = "";
        alert("Slide saved successfully!");
        renderSlideManager(document.getElementById("facultySubtabContent"));
      } catch (err) {
        alert("Error updating slide: " + err.message);
      }
    });
  }

  function renderSummaryManager(subContainer) {
    subContainer.innerHTML = `
      <div class="summary-manager-card">
        <h4>Lesson Overview & Learning Objectives</h4>
        <div class="form-group">
          <label>Learning Objectives (One per line)</label>
          <textarea id="editObjectives" class="form-control" rows="4">${(chapter.objectives || []).join("\n")}</textarea>
        </div>
        <div class="form-group">
          <label>Detailed Markdown Summary Text</label>
          <textarea id="editSummaryText" class="form-control font-mono" rows="12">${escapeHtml(chapter.summary_text || "")}</textarea>
        </div>
        <button class="btn btn-primary" id="btnSaveSummary">Save Lesson Materials</button>
      </div>
    `;

    document.getElementById("btnSaveSummary")?.addEventListener("click", async () => {
      const objRaw = document.getElementById("editObjectives").value.trim();
      const summary_text = document.getElementById("editSummaryText").value.trim();
      const objectives = objRaw.split("\n").map((o) => o.trim()).filter(Boolean);

      try {
        await api.updateChapter(chapter.chapter_id, { objectives, summary_text });
        chapter.objectives = objectives;
        chapter.summary_text = summary_text;
        state.setActiveChapter(chapter);
        alert("Lesson overview and objectives updated!");
      } catch (err) {
        alert("Error saving lesson summary: " + err.message);
      }
    });
  }

  async function renderQuizBankManager(subContainer) {
    subContainer.innerHTML = `<div class="loading-spinner">Loading Question Bank...</div>`;

    try {
      const res = await api.getQuizForFaculty(chapter.chapter_id);
      const quiz = res.quiz;
      const questions = quiz.questions || [];

      subContainer.innerHTML = `
        <div class="quiz-manager-card">
          <div class="quiz-manager-top">
            <div>
              <h4>Question Bank (${questions.length} Items)</h4>
              <p class="text-xs text-muted">Passing threshold: 75% | Exam limit: 10 minutes | Current total questions: ${questions.length}</p>
            </div>
            <div class="btn-group">
              <button class="btn btn-primary btn-sm" id="btnAddNewQuestion">+ Add Question</button>
              <button class="btn btn-secondary btn-sm" id="btnBulkImport">📂 Bulk Import (JSON/CSV)</button>
            </div>
          </div>

          <div class="faculty-questions-list">
            ${questions
              .map((q, idx) => {
                return `
                <div class="faculty-q-item">
                  <div class="faculty-q-head">
                    <span class="q-num-pill">Item ${idx + 1}</span>
                    <span class="correct-badge">Correct: Option ${q.correct_option}</span>
                    <div class="q-actions">
                      <button class="btn-icon btn-edit-q" data-qid="${q.question_id}" title="Edit Question">✏️</button>
                      <button class="btn-icon btn-del-q" data-qid="${q.question_id}" title="Delete Question">🗑️</button>
                    </div>
                  </div>
                  <h5 class="faculty-q-text">${escapeHtml(q.question_text)}</h5>
                  <div class="faculty-options-grid">
                    <div class="f-opt ${q.correct_option === "A" ? "f-opt-correct" : ""}">A: ${escapeHtml(q.option_a)}</div>
                    <div class="f-opt ${q.correct_option === "B" ? "f-opt-correct" : ""}">B: ${escapeHtml(q.option_b)}</div>
                    <div class="f-opt ${q.correct_option === "C" ? "f-opt-correct" : ""}">C: ${escapeHtml(q.option_c)}</div>
                    <div class="f-opt ${q.correct_option === "D" ? "f-opt-correct" : ""}">D: ${escapeHtml(q.option_d)}</div>
                  </div>
                  ${q.explanation ? `<div class="f-explanation"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div>` : ""}
                </div>
              `;
              })
              .join("")}
          </div>
        </div>

        <div id="questionModalMount"></div>
      `;

      // Event listeners for add/edit/delete
      document.getElementById("btnAddNewQuestion")?.addEventListener("click", () => {
        openQuestionModal(null);
      });

      document.querySelectorAll(".btn-edit-q").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const qid = Number(e.currentTarget.dataset.qid);
          const found = questions.find((q) => q.question_id === qid);
          if (found) openQuestionModal(found);
        });
      });

      document.querySelectorAll(".btn-del-q").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const qid = Number(e.currentTarget.dataset.qid);
          if (confirm("Are you sure you want to delete this question?")) {
            await api.deleteQuestion(qid);
            renderQuizBankManager(subContainer);
          }
        });
      });

      document.getElementById("btnBulkImport")?.addEventListener("click", () => {
        openBulkImportModal();
      });
    } catch (err) {
      subContainer.innerHTML = `<div class="alert-error">Failed to load quiz bank: ${err.message}</div>`;
    }
  }

  function openQuestionModal(existingQ) {
    const isEdit = Boolean(existingQ);
    const mount = document.getElementById("questionModalMount");

    mount.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-card modal-lg">
          <div class="modal-header">
            <h3>${isEdit ? "Edit Quiz Question" : "Add New Assessment Question"}</h3>
            <button class="modal-close" id="btnCloseQModal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Question Text *</label>
              <textarea id="qText" class="form-control" rows="3">${escapeHtml(existingQ ? existingQ.question_text : "")}</textarea>
            </div>
            <div class="form-row">
              <div class="form-group col-6">
                <label>Option A *</label>
                <input type="text" id="qOptA" class="form-control" value="${escapeHtml(existingQ ? existingQ.option_a : "")}">
              </div>
              <div class="form-group col-6">
                <label>Option B *</label>
                <input type="text" id="qOptB" class="form-control" value="${escapeHtml(existingQ ? existingQ.option_b : "")}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-6">
                <label>Option C *</label>
                <input type="text" id="qOptC" class="form-control" value="${escapeHtml(existingQ ? existingQ.option_c : "")}">
              </div>
              <div class="form-group col-6">
                <label>Option D *</label>
                <input type="text" id="qOptD" class="form-control" value="${escapeHtml(existingQ ? existingQ.option_d : "")}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-4">
                <label>Correct Option *</label>
                <select id="qCorrect" class="form-control">
                  <option value="A" ${existingQ?.correct_option === "A" ? "selected" : ""}>Option A</option>
                  <option value="B" ${existingQ?.correct_option === "B" ? "selected" : ""}>Option B</option>
                  <option value="C" ${existingQ?.correct_option === "C" ? "selected" : ""}>Option C</option>
                  <option value="D" ${existingQ?.correct_option === "D" ? "selected" : ""}>Option D</option>
                </select>
              </div>
              <div class="form-group col-8">
                <label>Pedagogical Explanation</label>
                <input type="text" id="qExp" class="form-control" placeholder="Explaining why this option is correct" value="${escapeHtml(existingQ ? existingQ.explanation || "" : "")}">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btnCancelQModal">Cancel</button>
            <button class="btn btn-primary" id="btnSaveQModal">Save Question</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btnCloseQModal")?.addEventListener("click", () => {
      mount.innerHTML = "";
    });
    document.getElementById("btnCancelQModal")?.addEventListener("click", () => {
      mount.innerHTML = "";
    });

    document.getElementById("btnSaveQModal")?.addEventListener("click", async () => {
      const question_text = document.getElementById("qText").value.trim();
      const option_a = document.getElementById("qOptA").value.trim();
      const option_b = document.getElementById("qOptB").value.trim();
      const option_c = document.getElementById("qOptC").value.trim();
      const option_d = document.getElementById("qOptD").value.trim();
      const correct_option = document.getElementById("qCorrect").value;
      const explanation = document.getElementById("qExp").value.trim();

      if (!question_text || !option_a || !option_b || !option_c || !option_d) {
        alert("Question text and all four options are required.");
        return;
      }

      const payload = { question_text, option_a, option_b, option_c, option_d, correct_option, explanation };

      try {
        if (isEdit) {
          await api.updateQuestion(existingQ.question_id, payload);
        } else {
          await api.addQuestion(chapter.chapter_id, payload);
        }
        mount.innerHTML = "";
        alert("Question saved successfully!");
        renderQuizBankManager(document.getElementById("facultySubtabContent"));
      } catch (err) {
        alert("Error saving question: " + err.message);
      }
    });
  }

  function openBulkImportModal() {
    const mount = document.getElementById("questionModalMount");

    mount.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-card modal-lg">
          <div class="modal-header">
            <h3>Bulk Import Quiz Questions (JSON / CSV Format)</h3>
            <button class="modal-close" id="btnCloseImportModal">&times;</button>
          </div>
          <div class="modal-body">
            <p class="text-sm">Paste a JSON array of question objects, or upload a JSON/CSV file.</p>
            <div class="form-group">
              <label>Choose File (.json / .csv)</label>
              <input type="file" id="importFileInput" accept=".json,.csv" class="form-control">
            </div>
            <div class="form-group">
              <label>Or Paste Raw JSON Data</label>
              <textarea id="rawJsonInput" class="form-control font-mono" rows="8" placeholder='[
  {
    "question_text": "What does VPC stand for?",
    "option_a": "Virtual Private Cloud",
    "option_b": "Virtual Public Connection",
    "option_c": "Variable Protocol",
    "option_d": "Verified Personal Computer",
    "correct_option": "A",
    "explanation": "VPC provides isolated cloud networks."
  }
]'></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="btnCancelImport">Cancel</button>
            <button class="btn btn-primary" id="btnExecuteImport">Import Questions</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById("btnCloseImportModal")?.addEventListener("click", () => (mount.innerHTML = ""));
    document.getElementById("btnCancelImport")?.addEventListener("click", () => (mount.innerHTML = ""));

    document.getElementById("importFileInput")?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        document.getElementById("rawJsonInput").value = event.target.result;
      };
      reader.readAsText(file);
    });

    document.getElementById("btnExecuteImport")?.addEventListener("click", async () => {
      const raw = document.getElementById("rawJsonInput").value.trim();
      if (!raw) {
        alert("Please paste or upload question data.");
        return;
      }

      let parsedItems = [];
      try {
        parsedItems = JSON.parse(raw);
        if (!Array.isArray(parsedItems)) {
          throw new Error("JSON must be an array of question objects.");
        }
      } catch (err) {
        alert("Invalid JSON format: " + err.message);
        return;
      }

      try {
        const res = await api.importQuestions(chapter.chapter_id, parsedItems);
        alert(res.message);
        mount.innerHTML = "";
        renderQuizBankManager(document.getElementById("facultySubtabContent"));
      } catch (err) {
        alert("Import failed: " + err.message);
      }
    });
  }
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

