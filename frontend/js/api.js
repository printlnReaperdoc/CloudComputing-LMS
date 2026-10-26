// LMS API Client
const API_BASE = "/api";

export const api = {
  getToken() {
    return localStorage.getItem("lms_token");
  },

  setToken(token) {
    if (token) {
      localStorage.setItem("lms_token", token);
    } else {
      localStorage.removeItem("lms_token");
    }
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("text/csv")) {
        return response.blob();
      }

      // Guard: Ensure response is JSON before calling response.json()
      if (!contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(
          `Server returned non-JSON response (${response.status}): ${text.slice(0, 100)}`
        );
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Auth
  login(username, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
  },

  register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });
  },

  getMe() {
    return this.request("/auth/me");
  },

  // Course & Chapters
  getCourse() {
    return this.request("/course");
  },

  getChapters() {
    return this.request("/chapters");
  },

  getChapter(id) {
    return this.request(`/chapters/${id}`);
  },

  updateChapter(id, data) {
    return this.request(`/chapters/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  },

  // Quiz
  getQuiz(chapterId) {
    return this.request(`/quiz/${chapterId}`);
  },

  getQuizForFaculty(chapterId) {
    return this.request(`/quiz/${chapterId}/faculty`);
  },

  submitQuizAttempt(chapterId, answers, timeTakenSeconds) {
    return this.request(`/quiz/${chapterId}/attempt`, {
      method: "POST",
      body: JSON.stringify({ answers, timeTakenSeconds })
    });
  },

  addQuestion(chapterId, qData) {
    return this.request(`/quiz/${chapterId}/questions`, {
      method: "POST",
      body: JSON.stringify(qData)
    });
  },

  updateQuestion(questionId, qData) {
    return this.request(`/quiz/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(qData)
    });
  },

  deleteQuestion(questionId) {
    return this.request(`/quiz/questions/${questionId}`, {
      method: "DELETE"
    });
  },

  resetQuiz(chapterId) {
    return this.request(`/quiz/${chapterId}/reset`, {
      method: "POST"
    });
  },

  importQuestions(chapterId, items) {
    return this.request(`/quiz/${chapterId}/import`, {
      method: "POST",
      body: JSON.stringify({ items })
    });
  },

  // Gradebooks
  getTopicGradebook(chapterId, sortBy = "surname", order = "asc") {
    return this.request(`/gradebook/topic/${chapterId}?sortBy=${sortBy}&order=${order}`);
  },

  getMasterGradebook() {
    return this.request("/gradebook/master");
  },

  getStudentReport(studentId = null) {
    const ep = studentId ? `/gradebook/report/${studentId}` : "/gradebook/report";
    return this.request(ep);
  },

  getTopicCSVUrl(chapterId, sortBy = "surname", order = "asc") {
    return `/api/gradebook/topic/${chapterId}/export?sortBy=${sortBy}&order=${order}`;
  },

  getMasterCSVUrl() {
    return `/api/gradebook/master/export`;
  }
};

