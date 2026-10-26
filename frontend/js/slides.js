// Interactive Slide Presentation Component
import { state } from "./state.js";

export function renderSlideViewer(container) {
  const chapter = state.activeChapter;
  if (!chapter || !chapter.slides || chapter.slides.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📂</div>
        <h3>No Slide Deck Available</h3>
        <p>No presentation slides have been loaded for this chapter.</p>
      </div>
    `;
    return;
  }

  const slides = chapter.slides;
  const currentIdx = state.currentSlideIndex;
  const slide = slides[currentIdx];
  const totalSlides = slides.length;

  container.innerHTML = `
    <div class="slide-deck-container ${state.isFullscreenSlide ? "fullscreen-active" : ""}" id="slideDeckContainer">
      <!-- Slide Top Controls Bar -->
      <div class="slide-header-bar">
        <div class="slide-header-left">
          <span class="slide-badge">Chapter ${chapter.chapter_number} Presentation</span>
          <span class="slide-title-chip">${escapeHtml(slide.title)}</span>
        </div>
        <div class="slide-header-right">
          <button class="btn-icon ${state.showPresenterNotes ? "active" : ""}" id="btnToggleNotes" title="Toggle Presenter Notes (N)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span class="btn-text-sm">Notes</span>
          </button>
          <button class="btn-icon" id="btnToggleFullscreen" title="Toggle Fullscreen (F)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
            <span class="btn-text-sm">${state.isFullscreenSlide ? "Exit" : "Fullscreen"}</span>
          </button>
        </div>
      </div>

      <!-- Main Slide Viewport (16:9 Aspect Ratio) -->
      <div class="slide-viewport">
        <div class="slide-card-face">
          <!-- Slide Title & Subtitle Header -->
          <div class="slide-hero">
            <div class="slide-number-indicator">SLIDE ${currentIdx + 1} OF ${totalSlides}</div>
            <h2 class="slide-main-title">${escapeHtml(slide.title)}</h2>
            ${slide.subtitle ? `<h4 class="slide-subtitle">${escapeHtml(slide.subtitle)}</h4>` : ""}
          </div>

          <!-- Slide Body Content -->
          <div class="slide-content-grid">
            <div class="slide-bullets-column">
              <ul class="slide-bullets-list">
                ${(slide.bullets || [])
                  .map((b) => `<li><span class="bullet-dot"></span><span>${escapeHtml(b)}</span></li>`)
                  .join("")}
              </ul>
            </div>

            ${
              slide.diagram
                ? `
              <div class="slide-diagram-column">
                <div class="slide-diagram-card">
                  <div class="diagram-tag">Architecture Diagram / Model</div>
                  <pre class="ascii-diagram"><code>${escapeHtml(slide.diagram)}</code></pre>
                </div>
              </div>
            `
                : ""
            }
          </div>

          <!-- Slide Footer Takeaway -->
          ${
            slide.keyTakeaway
              ? `
            <div class="slide-takeaway-banner">
              <span class="takeaway-pill">Key Takeaway</span>
              <p class="takeaway-text">${escapeHtml(slide.keyTakeaway)}</p>
            </div>
          `
              : ""
          }
        </div>
      </div>

      <!-- Presenter Notes Drawer -->
      ${
        state.showPresenterNotes
          ? `
        <div class="presenter-notes-drawer animate-fade-in">
          <div class="notes-header">
            <span class="notes-title">📝 Faculty Presenter Notes</span>
            <button class="notes-close" id="btnCloseNotes">&times;</button>
          </div>
          <div class="notes-body">
            <p>${escapeHtml(slide.notes || "No presenter notes provided for this slide.")}</p>
          </div>
        </div>
      `
          : ""
      }

      <!-- Bottom Navigation Controls -->
      <div class="slide-bottom-toolbar">
        <div class="toolbar-nav-group">
          <button class="btn btn-secondary" id="btnPrevSlide" ${currentIdx === 0 ? "disabled" : ""}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Previous
          </button>
          <div class="slide-counter-display">
            <strong>${currentIdx + 1}</strong> / ${totalSlides}
          </div>
          <button class="btn btn-primary" id="btnNextSlide" ${currentIdx === totalSlides - 1 ? "disabled" : ""}>
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>

        <!-- Thumbnail / Slide Jump Navigator -->
        <div class="slide-dots-rail">
          ${slides
            .map(
              (_, i) => `
            <button class="slide-dot-pill ${i === currentIdx ? "active" : ""}" data-slide-index="${i}" title="Jump to Slide ${i + 1}">
              ${i + 1}
            </button>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  // Attach event handlers
  document.getElementById("btnPrevSlide")?.addEventListener("click", () => {
    state.setSlideIndex(state.currentSlideIndex - 1);
  });

  document.getElementById("btnNextSlide")?.addEventListener("click", () => {
    state.setSlideIndex(state.currentSlideIndex + 1);
  });

  document.getElementById("btnToggleNotes")?.addEventListener("click", () => {
    state.togglePresenterNotes();
  });

  document.getElementById("btnCloseNotes")?.addEventListener("click", () => {
    state.togglePresenterNotes();
  });

  document.getElementById("btnToggleFullscreen")?.addEventListener("click", () => {
    state.toggleFullscreenSlide();
  });

  document.querySelectorAll(".slide-dot-pill").forEach((pill) => {
    pill.addEventListener("click", (e) => {
      const idx = Number(e.currentTarget.dataset.slideIndex);
      state.setSlideIndex(idx);
    });
  });
}

// Global Keyboard Navigation Handler
let keyNavAttached = false;
export function attachKeyboardNav() {
  if (keyNavAttached) return;
  keyNavAttached = true;

  window.addEventListener("keydown", (e) => {
    // Only handle if active tab is 'slides' and not typing in an input
    if (state.activeTab !== "slides") return;
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      state.setSlideIndex(state.currentSlideIndex + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      state.setSlideIndex(state.currentSlideIndex - 1);
    } else if (e.key === "f" || e.key === "F") {
      state.toggleFullscreenSlide();
    } else if (e.key === "n" || e.key === "N") {
      state.togglePresenterNotes();
    } else if (e.key === "Escape" && state.isFullscreenSlide) {
      state.toggleFullscreenSlide();
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

