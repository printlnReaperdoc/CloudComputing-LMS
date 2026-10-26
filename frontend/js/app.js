// LMS Main Controller & Coordinator
import { state } from "./state.js";
import { api } from "./api.js";
import { renderSlideViewer, attachKeyboardNav } from "./slides.js";
import { renderQuizWorkspace } from "./quiz.js";
import { renderTopicGradebook, renderMasterGradebook } from "./gradebook.js";
import { renderFacultyManager } from "./faculty.js";

// DOM Elements
const elCourseTitle = document.getElementById("courseTitle");
const elCourseCode = document.getElementById("courseCode");
const elCourseMetadata = document.getElementById("courseMetadata");
const elUserMenu = document.getElementById("userMenu");
const elSidebarChapters = document.getElementById("sidebarChapters");
const elWorkspaceTabs = document.getElementById("workspaceTabs");
const elWorkspaceContent = document.getElementById("workspaceContent");
const elStudentProgressBar = document.getElementById("studentProgressBar");
const elStudentProgressText = document.getElementById("studentProgressText");
const elAuthModal = document.getElementById("authModal");

// Module grouping definition for TOC
const MODULE_GROUPS = [
  { id: 1, title: "Module 1: Basics and Architecture", chapters: [1, 2, 3, 4] },
  { id: 2, title: "Module 2: Core Technologies", chapters: [5, 6, 7] },
  { id: 3, title: "Module 3: Security, Operations, and Platforms", chapters: [8, 9, 10, 11] },
  { id: 4, title: "Module 4: Advanced Topics", chapters: [12] }
];

async function init() {
  attachKeyboardNav();
  setupGlobalCustomEvents();

  // Load course metadata
  try {
    const courseRes = await api.getCourse();
    if (courseRes.success && courseRes.course) {
      state.setCourse(courseRes.course);
      renderHeaderCourse(courseRes.course);
    }
  } catch (err) {
    console.error("Failed to load course metadata:", err);
  }

  // Check existing auth session
  const token = api.getToken();
  if (token) {
    try {
      const meRes = await api.getMe();
      if (meRes.success && meRes.user) {
        state.setUser(meRes.user);
      }
    } catch (e) {
      console.warn("Session expired or invalid, clearing token...");
      api.setToken(null);
      state.setUser(null);
    }
  }

  // Load chapters
  await reloadChapters();

  // Load Chapter 1 by default
  await loadChapter(1);

  // Setup UI event listeners
  setupTabs();
  setupAuthModalHandlers();

  // State subscription to re-render
  state.subscribe((event, data) => {
    if (event === "user_changed") {
      renderUserMenu();
      reloadChapters();
      renderTabs();
    } else if (event === "active_chapter_changed") {
      renderActiveTabContent();
      renderSidebar();
    } else if (event === "tab_changed") {
      renderActiveTabContent();
    } else if (event === "slide_changed" || event === "notes_toggled" || event === "fullscreen_toggled") {
      if (state.activeTab === "slides") {
        renderSlideViewer(elWorkspaceContent);
      }
    } else if (event === "quiz_timer_tick") {
      updateTimerDisplay(data);
    } else if (event === "quiz_timer_expired") {
      alert("⏱️ Time limit has expired (10 minutes)! Auto-submitting assessment...");
      document.getElementById("btnFinalSubmit")?.click();
    }
  });

  renderUserMenu();
}

function renderHeaderCourse(course) {
  if (elCourseTitle) elCourseTitle.innerText = course.title;
  if (elCourseCode) elCourseCode.innerText = course.code;
  if (elCourseMetadata) {
    elCourseMetadata.innerHTML = `
      <span class="meta-pill">Term: ${course.term}</span>
      <span class="meta-pill">Level: ${course.year_level}</span>
      <span class="meta-pill">Elective: Professional Elective 4</span>
    `;
  }
}

function renderUserMenu() {
  if (!elUserMenu) return;

  if (state.user) {
    const isFaculty = state.user.role === "faculty";
    elUserMenu.innerHTML = `
      <div class="user-profile-badge">
        <div class="user-avatar ${isFaculty ? "avatar-faculty" : "avatar-student"}">
          ${state.user.first_name[0]}${state.user.surname[0]}
        </div>
        <div class="user-info-text">
          <div class="user-full-name">${escapeHtml(state.user.first_name)} ${escapeHtml(state.user.surname)}</div>
          <span class="role-badge ${isFaculty ? "badge-faculty" : "badge-student"}">
            ${isFaculty ? "FACULTY / ADMIN" : "STUDENT"}
          </span>
        </div>
        <button class="btn btn-secondary btn-xs ml-2" id="btnLogout" title="Log Out">Log Out</button>
      </div>
    `;

    document.getElementById("btnLogout")?.addEventListener("click", () => {
      if (!window.confirm("Are you sure you want to log out?")) return;

      api.setToken(null);
      state.setUser(null);
    });
  } else {
    elUserMenu.innerHTML = `
      <div class="user-guest-menu">
        <button class="btn btn-secondary btn-sm" id="btnQuickDemo">🚀 Demo Switcher</button>
        <button class="btn btn-primary btn-sm" id="btnLoginOpen">Log In / Register</button>
      </div>
    `;

    document.getElementById("btnLoginOpen")?.addEventListener("click", () => {
      openAuthModal();
    });

    document.getElementById("btnQuickDemo")?.addEventListener("click", () => {
      openAuthModal(true); // open with quick switcher tab
    });
  }
}

async function reloadChapters() {
  try {
    const res = await api.getChapters();
    if (res.success && res.chapters) {
      state.setChapters(res.chapters);
      renderSidebar();
      renderStudentProgress(res.chapters);
    }
  } catch (err) {
    console.error("Failed to reload chapters:", err);
  }
}

function renderStudentProgress(chapters) {
  if (!elStudentProgressBar || !elStudentProgressText) return;

  if (!state.user || state.user.role === "faculty") {
    elStudentProgressBar.parentElement.style.display = "none";
    return;
  }

  elStudentProgressBar.parentElement.style.display = "flex";
  const completedCount = chapters.filter((c) => c.is_completed).length;
  const pct = Math.round((completedCount / 12) * 100);

  elStudentProgressBar.style.width = `${pct}%`;
  elStudentProgressText.innerText = `${completedCount}/12 Chapters Completed (${pct}%)`;
}

function renderSidebar() {
  if (!elSidebarChapters) return;

  const chapters = state.chapters;
  const activeId = state.activeChapterId;
  const isFaculty = state.user?.role === "faculty";

  let html = "";

  MODULE_GROUPS.forEach((mod) => {
    html += `
      <div class="toc-module-group">
        <div class="toc-module-header">${escapeHtml(mod.title)}</div>
        <div class="toc-chapter-list">
    `;

    mod.chapters.forEach((chNum) => {
      const ch = chapters.find((c) => c.chapter_number === chNum);
      if (!ch) return;

      const isCurrent = ch.chapter_id === activeId && state.activeTab !== "master-gradebook";
      const isLocked = !isFaculty && !ch.is_unlocked;
      const isCompleted = ch.is_completed;

      let iconHtml = "📖";
      let statusClass = "toc-unlocked";

      if (isLocked) {
        iconHtml = "🔒";
        statusClass = "toc-locked";
      } else if (isCompleted) {
        iconHtml = "✅";
        statusClass = "toc-completed";
      } else if (ch.highest_score > 0 && !isCompleted) {
        iconHtml = "⚠️"; // Failed attempt, retake needed
        statusClass = "toc-retake";
      }

      html += `
        <button class="toc-chapter-btn ${statusClass} ${isCurrent ? "active" : ""}" 
                data-chapter-id="${ch.chapter_id}" 
                ${isLocked ? "disabled title='Pass Chapter " + (chNum - 1) + " quiz to unlock'" : ""}>
          <span class="toc-icon">${iconHtml}</span>
          <div class="toc-details">
            <span class="toc-ch-num">Chapter ${chNum}</span>
            <span class="toc-ch-title">${escapeHtml(ch.chapter_title)}</span>
          </div>
          ${isCompleted ? `<span class="toc-badge-pct">${ch.highest_score}%</span>` : ""}
        </button>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  // Master Gradebook Link at bottom of sidebar
  html += `
    <div class="toc-footer-section">
      <button class="toc-master-btn ${state.activeTab === "master-gradebook" ? "active" : ""}" id="btnOpenMasterGradebook">
        <span class="toc-icon">📊</span>
        <div class="toc-details">
          <span class="toc-ch-num">Global Analytics</span>
          <span class="toc-ch-title">Master Gradebook Matrix</span>
        </div>
      </button>
    </div>
  `;

  elSidebarChapters.innerHTML = html;

  // Chapter buttons click
  elSidebarChapters.querySelectorAll(".toc-chapter-btn:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const chId = Number(e.currentTarget.dataset.chapterId);
      if (state.activeTab === "master-gradebook") {
        state.setActiveTab("slides");
      }
      await loadChapter(chId);
    });
  });

  // Master Gradebook button click
  document.getElementById("btnOpenMasterGradebook")?.addEventListener("click", () => {
    state.setActiveTab("master-gradebook");
  });
}

async function loadChapter(chapterId) {
  try {
    const res = await api.getChapter(chapterId);
    if (res.success && res.chapter) {
      state.setActiveChapter(res.chapter);
    }
  } catch (err) {
    alert("Could not load chapter: " + err.message);
  }
}

function setupTabs() {
  renderTabs();
}

function renderTabs() {
  if (!elWorkspaceTabs) return;

  const isFaculty = state.user?.role === "faculty";
  const tabs = [
    { id: "slides", label: "🖥️ Slide Presentation", desc: "Interactive Deck" },
    { id: "summary", label: "📖 Lesson Summary", desc: "Study Guide" },
    { id: "quiz", label: "📝 20-Item Quiz", desc: "Assessment" },
    { id: "gradebook", label: "📊 Topic Gradebook", desc: "Student Records" }
  ];

  if (isFaculty) {
    tabs.push({ id: "faculty", label: "⚙️ Faculty Tools", desc: "Authoring" });
  }

  elWorkspaceTabs.innerHTML = tabs
    .map((t) => {
      const isActive = state.activeTab === t.id;
      return `
      <button class="tab-btn ${isActive ? "active" : ""}" data-tab="${t.id}">
        <span class="tab-label">${t.label}</span>
        <span class="tab-desc">${t.desc}</span>
      </button>
    `;
    })
    .join("");

  elWorkspaceTabs.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const target = e.currentTarget.dataset.tab;
      state.setActiveTab(target);
      renderTabs();
    });
  });
}

function renderActiveTabContent() {
  if (!elWorkspaceContent) return;

  // If in master gradebook mode
  if (state.activeTab === "master-gradebook") {
    renderMasterGradebook(elWorkspaceContent);
    return;
  }

  const chapter = state.activeChapter;
  if (!chapter) {
    elWorkspaceContent.innerHTML = `<div class="empty-state">Select a chapter from the Table of Contents to begin.</div>`;
    return;
  }

  if (state.activeTab === "slides") {
    renderSlideViewer(elWorkspaceContent);
  } else if (state.activeTab === "summary") {
    renderSummaryView(elWorkspaceContent, chapter);
  } else if (state.activeTab === "quiz") {
    renderQuizWorkspace(elWorkspaceContent);
  } else if (state.activeTab === "gradebook") {
    renderTopicGradebook(elWorkspaceContent);
  } else if (state.activeTab === "faculty") {
    renderFacultyManager(elWorkspaceContent);
  }
}

function renderSummaryView(container, chapter) {
  container.innerHTML = `
    <div class="summary-document-container animate-fade-in">
      <div class="summary-doc-header">
        <span class="doc-badge">${escapeHtml(chapter.module_title)}</span>
        <h1 class="doc-title">Chapter ${chapter.chapter_number}: ${escapeHtml(chapter.chapter_title)}</h1>
      </div>

      <!-- Learning Objectives Box -->
      <div class="objectives-card">
        <h3>🎯 Learning Objectives</h3>
        <ul class="objectives-list">
          ${(chapter.objectives || []).map((o) => `<li>${escapeHtml(o)}</li>`).join("")}
        </ul>
      </div>

      <!-- Formatted Lesson Text -->
      <div class="summary-markdown-body">
        ${formatMarkdown(chapter.summary_text)}
      </div>

      <!-- Action Footer: Jump to Quiz -->
      <div class="summary-footer-box">
        <div>
          <h4>Ready to test your knowledge?</h4>
          <p>Take the 20-item chapter quiz to unlock the next chapter.</p>
        </div>
        <button class="btn btn-primary" id="btnGoToQuizFromSummary">
          Take Chapter ${chapter.chapter_number} Quiz &rarr;
        </button>
      </div>
    </div>
  `;

  document.getElementById("btnGoToQuizFromSummary")?.addEventListener("click", () => {
    state.setActiveTab("quiz");
    renderTabs();
  });
}

function formatMarkdown(text) {
  if (!text) return "<p>No lesson summary available.</p>";

  // Basic markdown parser for headings, lists, bold, blockquotes, code blocks
  return text
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (block.startsWith("### ")) {
        return `<h3>${escapeHtml(block.substring(4))}</h3>`;
      }
      if (block.startsWith("> ")) {
        return `<blockquote>${escapeHtml(block.substring(2))}</blockquote>`;
      }
      if (block.startsWith("- ") || block.startsWith("* ")) {
        const items = block
          .split("\n")
          .map((l) => `<li>${formatInline(l.replace(/^[-*]\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      if (/^\d+\.\s/.test(block)) {
        const items = block
          .split("\n")
          .map((l) => `<li>${formatInline(l.replace(/^\d+\.\s+/, ""))}</li>`)
          .join("");
        return `<ol>${items}</ol>`;
      }
      return `<p>${formatInline(block)}</p>`;
    })
    .join("");
}

function formatInline(str) {
  return escapeHtml(str)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function updateTimerDisplay(secondsLeft) {
  const display = document.getElementById("timerDisplay");
  if (!display) return;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  display.querySelector(".timer-digits").innerText = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  if (secondsLeft < 120) {
    display.classList.add("timer-warning", "pulse-anim");
  }
}

// Auth Modal
function openAuthModal(startWithDemo = false) {
  if (!elAuthModal) return;
  elAuthModal.classList.add("active");
  renderAuthModalContent(startWithDemo);
}

function closeAuthModal() {
  if (!elAuthModal) return;
  elAuthModal.classList.remove("active");
}

function setupAuthModalHandlers() {
  if (!elAuthModal) return;
  elAuthModal.addEventListener("click", (e) => {
    if (e.target !== elAuthModal) return;

    // Keep the dialog open when a text selection ends outside the modal.
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) return;

    closeAuthModal();
  });
}

function renderAuthModalContent(startWithDemo = false) {
  const modalBox = elAuthModal.querySelector(".modal-card");
  if (!modalBox) return;

  modalBox.innerHTML = `
    <div class="modal-header">
      <div class="auth-tabs-row">
        <button class="auth-tab ${!startWithDemo ? "active" : ""}" id="tabAuthLogin">Sign In</button>
        <button class="auth-tab" id="tabAuthRegister">Register</button>
        <button class="auth-tab ${startWithDemo ? "active" : ""}" id="tabAuthDemo">🚀 Quick Demo Switcher</button>
      </div>
      <button class="modal-close" id="btnCloseAuthModal">&times;</button>
    </div>
    <div class="modal-body" id="authModalBody">
      <!-- Injected below -->
    </div>
  `;

  document.getElementById("btnCloseAuthModal")?.addEventListener("click", closeAuthModal);

  const tabLogin = document.getElementById("tabAuthLogin");
  const tabReg = document.getElementById("tabAuthRegister");
  const tabDemo = document.getElementById("tabAuthDemo");

  tabLogin?.addEventListener("click", () => {
    setActiveAuthTab(tabLogin);
    renderLoginForm();
  });

  tabReg?.addEventListener("click", () => {
    setActiveAuthTab(tabReg);
    renderRegisterForm();
  });

  tabDemo?.addEventListener("click", () => {
    setActiveAuthTab(tabDemo);
    renderDemoSwitcher();
  });

  if (startWithDemo) {
    renderDemoSwitcher();
  } else {
    renderLoginForm();
  }

  function setActiveAuthTab(activeTab) {
    [tabLogin, tabReg, tabDemo].forEach((t) => t.classList.remove("active"));
    activeTab.classList.add("active");
  }

  function renderLoginForm() {
    const body = document.getElementById("authModalBody");
    body.innerHTML = `
      <form id="formLogin" class="auth-form">
        <div class="form-group">
          <label>Username</label>
          <input type="text" id="loginUsername" class="form-control" placeholder="e.g. faculty or student1" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" id="loginPassword" class="form-control" placeholder="••••••••" required>
        </div>
        <div id="loginError" class="auth-error-msg"></div>
        <button type="submit" class="btn btn-primary btn-block mt-3" id="btnSubmitLogin">Sign In</button>
      </form>
    `;

    document.getElementById("formLogin")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const u = document.getElementById("loginUsername").value.trim();
      const p = document.getElementById("loginPassword").value;
      const errEl = document.getElementById("loginError");
      errEl.innerText = "";

      try {
        const res = await api.login(u, p);
        if (res.success && res.token) {
          api.setToken(res.token);
          state.setUser(res.user);
          closeAuthModal();
        }
      } catch (err) {
        errEl.innerText = err.message || "Invalid credentials.";
      }
    });
  }

  function renderRegisterForm() {
    const body = document.getElementById("authModalBody");
    body.innerHTML = `
      <form id="formRegister" class="auth-form">
        <div class="form-row">
          <div class="form-group col-6">
            <label>First Name *</label>
            <input type="text" id="regFirstName" class="form-control" placeholder="Juan" required>
          </div>
          <div class="form-group col-6">
            <label>Surname *</label>
            <input type="text" id="regSurname" class="form-control" placeholder="Dela Cruz" required>
          </div>
        </div>
        <div class="form-group">
          <label>Username *</label>
          <input type="text" id="regUsername" class="form-control" placeholder="jdelacruz" required>
        </div>
        <div class="form-group">
          <label>Password (Min 6 chars) *</label>
          <input type="password" id="regPassword" class="form-control" placeholder="••••••••" required>
        </div>
        <div class="form-group">
          <label>Role Selection *</label>
          <select id="regRole" class="form-control">
            <option value="student">Student (Sequential Unlocking & Quizzes)</option>
            <option value="faculty">Faculty / Admin (Content Author & Master Gradebook)</option>
          </select>
        </div>
        <div id="regError" class="auth-error-msg"></div>
        <button type="submit" class="btn btn-primary btn-block mt-3" id="btnSubmitRegister">Register Account</button>
      </form>
    `;

    document.getElementById("formRegister")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const first_name = document.getElementById("regFirstName").value.trim();
      const surname = document.getElementById("regSurname").value.trim();
      const username = document.getElementById("regUsername").value.trim();
      const password = document.getElementById("regPassword").value;
      const role = document.getElementById("regRole").value;
      const errEl = document.getElementById("regError");
      errEl.innerText = "";

      try {
        const res = await api.register({ first_name, surname, username, password, role });
        if (res.success && res.token) {
          api.setToken(res.token);
          state.setUser(res.user);
          closeAuthModal();
        }
      } catch (err) {
        errEl.innerText = err.message || "Registration failed.";
      }
    });
  }

  function renderDemoSwitcher() {
    const body = document.getElementById("authModalBody");
    body.innerHTML = `
      <div class="demo-accounts-list">
        <p class="text-sm text-muted">Click any pre-configured demo account to instantly switch session:</p>
        
        <div class="demo-btn-card" data-username="faculty" data-password="faculty123">
          <div class="demo-card-head">
            <strong>Dr. Alan Turing</strong>
            <span class="badge-role-faculty">Faculty / Admin</span>
          </div>
          <div class="text-xs text-muted">All 12 topics permanently unlocked | Slide authoring | Master Gradebook management</div>
        </div>

        <div class="demo-btn-card" data-username="student1" data-password="student123">
          <div class="demo-card-head">
            <strong>Juan Dela Cruz</strong>
            <span class="badge-student">Student</span>
          </div>
          <div class="text-xs text-muted">Passed Chapter 1 (90%) | Chapter 2 is Unlocked | Chapters 3-12 Locked</div>
        </div>

        <div class="demo-btn-card" data-username="student2" data-password="student123">
          <div class="demo-card-head">
            <strong>Maria Santos</strong>
            <span class="badge-student">Student</span>
          </div>
          <div class="text-xs text-muted">Passed Ch 1 (100%) & Ch 2 (85%) | Chapter 3 Unlocked</div>
        </div>

        <div class="demo-btn-card" data-username="student3" data-password="student123">
          <div class="demo-card-head">
            <strong>Carlo Reyes</strong>
            <span class="badge-student">Student</span>
          </div>
          <div class="text-xs text-muted">Failed Ch 1 (60%) | Chapter 2 is Locked | Needs Retake</div>
        </div>

        <div class="demo-btn-card" data-username="student4" data-password="student123">
          <div class="demo-card-head">
            <strong>Ana Gomez</strong>
            <span class="badge-certified">Star Graduate</span>
          </div>
          <div class="text-xs text-muted">Passed ALL 12 Chapters | 100% Curriculum Completed | Honor Certified</div>
        </div>
      </div>
    `;

    body.querySelectorAll(".demo-btn-card").forEach((card) => {
      card.addEventListener("click", async () => {
        const u = card.dataset.username;
        const p = card.dataset.password;
        try {
          const res = await api.login(u, p);
          if (res.success && res.token) {
            api.setToken(res.token);
            state.setUser(res.user);
            closeAuthModal();
          }
        } catch (err) {
          alert("Demo login error: " + err.message);
        }
      });
    });
  }
}

function setupGlobalCustomEvents() {
  window.addEventListener("open_auth_modal", () => {
    openAuthModal();
  });

  window.addEventListener("navigate_chapter", async (e) => {
    const chNum = e.detail;
    const targetCh = state.chapters.find((c) => c.chapter_number === chNum);
    if (targetCh) {
      state.setActiveTab("slides");
      await loadChapter(targetCh.chapter_id);
      renderTabs();
    }
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

// Start application
window.addEventListener("DOMContentLoaded", init);
