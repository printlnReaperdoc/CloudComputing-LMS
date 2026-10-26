// Global LMS Reactive State Store

export const state = {
  user: null,
  course: null,
  chapters: [],
  activeChapterId: 1,
  activeChapter: null,
  activeTab: "slides", // 'slides' | 'summary' | 'quiz' | 'gradebook' | 'faculty'
  currentSlideIndex: 0,
  showPresenterNotes: false,
  isFullscreenSlide: false,

  // Active quiz session
  quiz: null,
  quizAnswers: {},
  quizTimerSeconds: 600, // 10 minutes (600s)
  quizTimerInterval: null,
  quizSubmitted: false,
  quizResult: null,

  // Listeners
  listeners: [],

  subscribe(fn) {
    this.listeners.push(fn);
  },

  notify(event, data) {
    this.listeners.forEach((fn) => {
      try {
        fn(event, data, this);
      } catch (e) {
        console.error("State listener error:", e);
      }
    });
  },

  setUser(user) {
    this.user = user;
    this.notify("user_changed", user);
  },

  setCourse(course) {
    this.course = course;
    this.notify("course_changed", course);
  },

  setChapters(chapters) {
    this.chapters = chapters;
    this.notify("chapters_changed", chapters);
  },

  setActiveChapter(chapter) {
    this.activeChapter = chapter;
    this.activeChapterId = chapter ? chapter.chapter_id : 1;
    this.currentSlideIndex = 0;
    this.quiz = null;
    this.quizAnswers = {};
    this.quizSubmitted = false;
    this.quizResult = null;
    this.stopQuizTimer();
    this.notify("active_chapter_changed", chapter);
  },

  setActiveTab(tab) {
    this.activeTab = tab;
    this.notify("tab_changed", tab);
  },

  setSlideIndex(index) {
    if (!this.activeChapter || !this.activeChapter.slides) return;
    const max = this.activeChapter.slides.length - 1;
    this.currentSlideIndex = Math.max(0, Math.min(index, max));
    this.notify("slide_changed", this.currentSlideIndex);
  },

  togglePresenterNotes() {
    this.showPresenterNotes = !this.showPresenterNotes;
    this.notify("notes_toggled", this.showPresenterNotes);
  },

  toggleFullscreenSlide() {
    this.isFullscreenSlide = !this.isFullscreenSlide;
    this.notify("fullscreen_toggled", this.isFullscreenSlide);
  },

  // Quiz methods
  startQuiz(quiz) {
    this.quiz = quiz;
    this.quizAnswers = {};
    this.quizSubmitted = false;
    this.quizResult = null;
    this.quizTimerSeconds = (quiz.time_limit_minutes || 10) * 60;
    this.startQuizTimer();
    this.notify("quiz_started", quiz);
  },

  setQuizAnswer(questionId, selectedOption) {
    this.quizAnswers[questionId] = selectedOption;
    this.notify("quiz_answered", { questionId, selectedOption });
  },

  startQuizTimer() {
    this.stopQuizTimer();
    this.quizTimerInterval = setInterval(() => {
      if (this.quizTimerSeconds > 0) {
        this.quizTimerSeconds--;
        this.notify("quiz_timer_tick", this.quizTimerSeconds);
      } else {
        this.stopQuizTimer();
        this.notify("quiz_timer_expired");
      }
    }, 1000);
  },

  stopQuizTimer() {
    if (this.quizTimerInterval) {
      clearInterval(this.quizTimerInterval);
      this.quizTimerInterval = null;
    }
  },

  setQuizResult(result) {
    this.stopQuizTimer();
    this.quizSubmitted = true;
    this.quizResult = result;
    this.notify("quiz_submitted", result);
  }
};

