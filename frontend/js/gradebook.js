// Gradebook & Global Analytics Component
import { state } from "./state.js";
import { api } from "./api.js";

let topicSortBy = "surname";
let topicOrder = "asc";

export async function renderTopicGradebook(container) {
  const chapter = state.activeChapter;
  if (!chapter) return;

  container.innerHTML = `<div class="loading-spinner">Loading topic gradebook...</div>`;

  try {
    const res = await api.getTopicGradebook(chapter.chapter_id, topicSortBy, topicOrder);
    const records = res.records || [];

    container.innerHTML = `
      <div class="gradebook-container animate-fade-in">
        <!-- Top Toolbar & Export Actions -->
        <div class="gradebook-header-toolbar">
          <div>
            <h3 class="gb-title">Topic Gradebook: Chapter ${chapter.chapter_number}</h3>
            <p class="gb-subtitle">${escapeHtml(chapter.chapter_title)} — Passing Mark: 75% (15/20 items)</p>
          </div>

          <div class="export-actions-group">
            <button class="btn btn-secondary btn-sm" id="btnPrintTopic">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Print Report
            </button>
            <button class="btn btn-secondary btn-sm" id="btnPdfTopic">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Export PDF
            </button>
            <a href="${api.getTopicCSVUrl(chapter.chapter_id, topicSortBy, topicOrder)}" download class="btn btn-primary btn-sm" id="btnExportCsv">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download Spreadsheet (.CSV)
            </a>
          </div>
        </div>

        <!-- Sorting Controls -->
        <div class="sorting-bar">
          <span class="sorting-label">Sort Records By:</span>
          <button class="sort-chip ${topicSortBy === "surname" ? "active" : ""}" id="sortSurname">
            Surname ${topicSortBy === "surname" ? (topicOrder === "asc" ? "▲ (A-Z)" : "▼ (Z-A)") : ""}
          </button>
          <button class="sort-chip ${topicSortBy === "score" ? "active" : ""}" id="sortScore">
            Score ${topicSortBy === "score" ? (topicOrder === "desc" ? "▼ (High-Low)" : "▲ (Low-High)") : ""}
          </button>
        </div>

        <!-- Table View -->
        <div class="table-responsive-wrapper">
          <table class="data-table" id="topicTableToPrint">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Surname</th>
                <th>First Name</th>
                <th>Score (20 Items)</th>
                <th>Percentage</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Last Timestamp</th>
              </tr>
            </thead>
            <tbody>
              ${
                records.length === 0
                  ? `<tr><td colspan="8" class="text-center">No student records found for this topic.</td></tr>`
                  : records
                      .map((r) => {
                        const statusClass = r.has_passed
                          ? "status-pill-pass"
                          : r.total_attempts > 0
                          ? "status-pill-fail"
                          : "status-pill-pending";
                        const statusText = r.has_passed
                          ? "PASSED"
                          : r.total_attempts > 0
                          ? "FAILED"
                          : "NOT ATTEMPTED";
                        const dateFormatted = r.last_attempt_at
                          ? new Date(r.last_attempt_at).toLocaleString()
                          : "—";
                        return `
                    <tr>
                      <td><code>#${r.student_id}</code></td>
                      <td><strong>${escapeHtml(r.surname)}</strong></td>
                      <td>${escapeHtml(r.first_name)}</td>
                      <td>${r.total_attempts > 0 ? `${r.highest_score} / 20` : "—"}</td>
                      <td>
                        <strong>${r.total_attempts > 0 ? `${r.highest_percentage}%` : "—"}</strong>
                      </td>
                      <td>
                        <span class="status-pill ${statusClass}">${statusText}</span>
                      </td>
                      <td>${r.total_attempts}</td>
                      <td><small class="text-muted">${dateFormatted}</small></td>
                    </tr>
                  `;
                      })
                      .join("")
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Sorting button click handlers
    document.getElementById("sortSurname")?.addEventListener("click", () => {
      if (topicSortBy === "surname") {
        topicOrder = topicOrder === "asc" ? "desc" : "asc";
      } else {
        topicSortBy = "surname";
        topicOrder = "asc";
      }
      renderTopicGradebook(container);
    });

    document.getElementById("sortScore")?.addEventListener("click", () => {
      if (topicSortBy === "score") {
        topicOrder = topicOrder === "desc" ? "asc" : "desc";
      } else {
        topicSortBy = "score";
        topicOrder = "desc";
      }
      renderTopicGradebook(container);
    });

    document.getElementById("btnPrintTopic")?.addEventListener("click", () => {
      window.print();
    });

    document.getElementById("btnPdfTopic")?.addEventListener("click", () => {
      window.print();
    });
  } catch (err) {
    container.innerHTML = `<div class="alert-error">Failed to load topic gradebook: ${err.message}</div>`;
  }
}

// Master Gradebook Full Page View
export async function renderMasterGradebook(container) {
  container.innerHTML = `<div class="loading-spinner">Loading Global Master Gradebook...</div>`;

  try {
    const res = await api.getMasterGradebook();
    const summary = res.summary || {};
    const matrix = res.matrix || [];
    const course = res.course || state.course || {};

    container.innerHTML = `
      <div class="master-gb-container animate-fade-in">
        <!-- Global KPI Analytics Summary Cards -->
        <div class="kpi-cards-grid">
          <div class="kpi-card">
            <div class="kpi-icon">👥</div>
            <div class="kpi-data">
              <div class="kpi-num">${summary.totalStudents || 0}</div>
              <div class="kpi-label">Enrolled Students</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">📚</div>
            <div class="kpi-data">
              <div class="kpi-num">12 Chapters</div>
              <div class="kpi-label">Curriculum Length</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">📈</div>
            <div class="kpi-data">
              <div class="kpi-num">${summary.classAverage || 0}%</div>
              <div class="kpi-label">Class Total Average</div>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-icon">🎓</div>
            <div class="kpi-data">
              <div class="kpi-num">${summary.certifiedGraduates || 0}</div>
              <div class="kpi-label">Certified (12/12 Completed)</div>
            </div>
          </div>
        </div>

        <!-- Master Gradebook Table Header Actions -->
        <div class="master-header-bar">
          <div>
            <h2 class="master-title">Course Master Gradebook Matrix</h2>
            <p class="master-subtitle">${escapeHtml(course.code)}: ${escapeHtml(course.title)} — ${escapeHtml(course.year_level)}, ${escapeHtml(course.term)}</p>
          </div>

          <div class="export-actions-group">
            <button class="btn btn-secondary btn-sm" id="btnPrintMaster">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              Print Master Matrix
            </button>
            <button class="btn btn-secondary btn-sm" id="btnPdfMaster">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Export PDF
            </button>
            <a href="${api.getMasterCSVUrl()}" download class="btn btn-primary btn-sm">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download Master (.CSV)
            </a>
          </div>
        </div>

        <!-- Master Matrix Table -->
        <div class="table-responsive-wrapper">
          <table class="data-table master-table" id="masterTableToPrint">
            <thead>
              <tr>
                <th class="sticky-col">Student Name</th>
                ${Array.from({ length: 12 }, (_, i) => `<th>Ch ${i + 1}</th>`).join("")}
                <th>Passed</th>
                <th>Progress</th>
                <th>Average</th>
                <th>Badge</th>
              </tr>
            </thead>
            <tbody>
              ${matrix
                .map((stu) => {
                  return `
                <tr>
                  <td class="sticky-col">
                    <strong>${escapeHtml(stu.surname)}, ${escapeHtml(stu.first_name)}</strong>
                    <div class="text-xs text-muted">ID #${stu.student_id}</div>
                  </td>
                  ${Array.from({ length: 12 }, (_, i) => {
                    const chNum = i + 1;
                    const chData = stu.chapterScores[chNum];
                    if (!chData || chData.attempts === 0) {
                      return `<td class="text-muted text-center">—</td>`;
                    }
                    const badgeClass = chData.passed ? "cell-pass" : "cell-fail";
                    return `
                      <td class="text-center ${badgeClass}" title="Ch ${chNum}: ${chData.score}/20 (${chData.percentage}%)">
                        <strong>${chData.percentage}%</strong>
                      </td>
                    `;
                  }).join("")}
                  <td><strong>${stu.totalPassed} / 12</strong></td>
                  <td style="min-width: 110px;">
                    <div class="progress-track">
                      <div class="progress-fill" style="width: ${stu.completionRate}%;"></div>
                    </div>
                    <span class="text-xs">${stu.completionRate}%</span>
                  </td>
                  <td><strong>${stu.averagePercentage}%</strong></td>
                  <td>
                    ${
                      stu.isCompletedAll
                        ? `<span class="badge-certified">🏆 Certified</span>`
                        : `<span class="badge-in-progress">⏳ ${stu.totalPassed}/12 Done</span>`
                    }
                  </td>
                </tr>
              `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    document.getElementById("btnPrintMaster")?.addEventListener("click", () => {
      window.print();
    });

    document.getElementById("btnPdfMaster")?.addEventListener("click", () => {
      window.print();
    });
  } catch (err) {
    container.innerHTML = `<div class="alert-error">Failed to load Master Gradebook: ${err.message}</div>`;
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

