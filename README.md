# Cloud Computing (Elective 4) — Learning Management System (LMS)
**Course Code:** `ITEP413-T` | **Academic Level:** 4th Year, 1st Term (4-1)  
**System Architecture:** Production-Ready Full-Stack Web Application (Node.js, Express, MySQL / Standalone Persistent Engine, Modern Responsive SPA Frontend)

---

## 🌟 Executive Overview
This Learning Management System (LMS) is custom-engineered for the **Cloud Computing (ITEP413-T)** senior-year elective course. It comes **pre-loaded with interactive slide presentations, structured lesson guides, and assessment question banks for ALL 12 chapters across 4 modules**. 

Students and faculty can immediately explore presentations upon launching without needing manual file uploads.

---

## 🚀 Quick Start Guide

### 1. Start the Server
Navigate to the `backend/` folder and launch the Node.js application:
```bash
cd backend
npm start
```
The server will initialize the database, seed all curriculum content and demo users, and serve the web application at:
👉 **`http://localhost:3000`**

### 2. Dual Database Architecture
- **MySQL Mode:** Automatically connects to local MySQL (e.g., XAMPP, MariaDB, or Docker) using `.env` settings (`DB_HOST=localhost`, `DB_NAME=cloudcomputinglms`, `DB_USER=root`).
- **Standalone Persistent Mode:** If MySQL is offline or undergoing maintenance, the LMS automatically operates using a high-fidelity persistent JSON store (`backend/data/lms-db.json`) ensuring **zero downtime and immediate out-of-the-box functionality**.
- **Direct SQL Import:** For manual database setup, use the provided schema and seeder:
  - `backend/database OCT 25.sql` (Database & table schemas + views)
  - `backend/seed_data.sql` (Complete curriculum, users, and 240 questions in MySQL format)

---

## 👥 Demo Accounts & Roles

The system includes pre-configured accounts with realistic progress for testing:

| Role | Username | Password | Full Name | Demo State |
| :--- | :--- | :--- | :--- | :--- |
| **Faculty / Admin** | `faculty` | `faculty123` | Dr. Alan Turing | All 12 topics permanently unlocked, slide authoring, question bank editor, Master Gradebook |
| **Student (Ch 1 Passed)** | `student1` | `student123` | Juan Dela Cruz | Passed Ch 1 (90%) $\rightarrow$ Ch 2 Unlocked $\rightarrow$ Ch 3–12 Locked |
| **Student (Ch 2 Passed)** | `student2` | `student123` | Maria Santos | Passed Ch 1 (100%) & Ch 2 (85%) $\rightarrow$ Ch 3 Unlocked |
| **Student (Ch 1 Failed)** | `student3` | `student123` | Carlo Reyes | Scored 60% on Ch 1 $\rightarrow$ Status: FAILED $\rightarrow$ Ch 2 Locked (Needs Retake) |
| **Student (Completed)** | `student4` | `student123` | Ana Gomez | Passed all 12 chapters with honor standing $\rightarrow$ 🏆 Certified Graduate |

*You can also click **"🚀 Demo Switcher"** in the top navigation bar to switch between roles with a single click!*

---

## 📚 Curriculum Structure & Content Matrix

| Module | Chapter | Topic Title | Slides | Assessment |
| :--- | :--- | :--- | :---: | :---: |
| **Module 1: Basics and Architecture** | Chapter 1 | Introduction to Cloud Computing | 7 Slides | 20 MCQs |
| | Chapter 2 | Cloud Architecture and Core Concepts | 7 Slides | 20 MCQs |
| | Chapter 3 | Cloud Service Models (IaaS, PaaS, SaaS) | 7 Slides | 20 MCQs |
| | Chapter 4 | Cloud Deployment Models (Public, Private, Hybrid, Community) | 7 Slides | 20 MCQs |
| **Module 2: Core Technologies** | Chapter 5 | Virtualization Fundamentals | 7 Slides | 20 MCQs |
| | Chapter 6 | Cloud Storage and Data Management | 7 Slides | 20 MCQs |
| | Chapter 7 | Cloud Networking | 7 Slides | 20 MCQs |
| **Module 3: Security, Operations & Platforms** | Chapter 8 | Cloud Security and Privacy | 7 Slides | 20 MCQs |
| | Chapter 9 | Containers and Serverless Computing | 7 Slides | 20 MCQs |
| | Chapter 10 | Major Cloud Platforms (AWS, Azure, GCP) | 7 Slides | 20 MCQs |
| | Chapter 11 | Cloud Governance, Cost Management, and Ethics | 7 Slides | 20 MCQs |
| **Module 4: Advanced Topics** | Chapter 12 | Emerging Trends and Future of Cloud Computing | 7 Slides | 20 MCQs |
| **TOTALS** | **12 Chapters** | **Comprehensive Senior Cloud Curriculum** | **84 Slides** | **240 Questions** |

---

## 🛠️ Feature Modules Implemented

### **Module A: Authentication & User Roles**
- Registration and Login with role selection (`Student` vs. `Faculty`).
- Cryptographic password hashing (`PBKDF2` with salt) and signed authorization tokens.
- Role-based UI customization (Student view vs. Faculty authoring controls).

### **Module B: Course Header & Dashboard Overview**
- Persistent banner displaying Course Name, Code (`ITEP413-T`), Term (`1st Term`), and Level (`4th Year 4-1`).
- Real-time student progress bar tracking completion percentage across the 12 chapters.
- User profile pill with role badge and logout action.

### **Module C: Navigation & Table of Contents (TOC)**
- Dynamic hierarchical sidebar grouped by the 4 modules.
- **Sequential Unlocking Logic:** Chapter 1 is unlocked by default. For students, Chapter $N+1$ unlocks **only after passing Chapter $N$ with a score $\ge 75\%$**.
- Status indicators: 🔒 Locked, 🔓 Unlocked, ✅ Passed, and ⚠️ Retake Required.
- **Faculty View:** All 12 topics permanently unlocked for testing and content management.

### **Module D: Immediate Presentation & Topic Viewer**
- **Instant Interactive Slide Viewer:** Deck format with Previous/Next controls, keyboard arrows (`←`/`→`), slide counter, slide jumping pills, fullscreen mode (`F`), and presenter notes (`N`).
- Pre-loaded with actual technical content: Core concepts, bullet points, architecture diagrams, and key takeaways.
- **Lesson Summary & Study Guide:** Rich text guide with Learning Objectives, deep architectural explanations, and checklists.
- **Faculty Slide Authoring:** Edit slide text, add new slides, reorder, delete, and embed custom external presentation URLs.

### **Module E: Quiz & Assessment System**
- **20 Multiple-Choice Questions per Chapter:** 240 questions in total pre-loaded with technical explanations.
- **Active Countdown Timer:** 10 minutes (600s) per attempt with visual pulsing alert when $< 2$ minutes remain, and automatic submission at 00:00.
- **Passing Threshold:** $75\%$ (minimum 15 / 20 correct).
- **Gating Logic:**
  - Score $< 75\%$: Marked as **FAILED**. Chapter $N+1$ remains locked. Prompted to review slides and retake.
  - Score $\ge 75\%$: Marked as **PASSED**. Score recorded and Chapter $N+1$ automatically unlocks.
- **Full Review Mode:** Detailed post-exam review highlighting student choices, correct answers, and pedagogical concept explanations.
- **Faculty Quiz Tools:** Inline question creation, editing, deletion, bulk JSON/CSV import, and a 1-click **Reset Default 20 Questions** button.

### **Module F: Topic-Level Gradebook & Exports**
- Filtered table showing student attempts, timestamps, scores, percentages, and pass/fail states.
- Dynamic sorting by **Surname** (alphabetical) or **Score** (descending/ascending).
- Export options:
  - 🖨️ **Print:** Formatted print view
  - 📄 **PDF:** Print-to-PDF layout
  - 📊 **Spreadsheet (.CSV):** Direct download formatted for Excel/Sheets

### **Module G: Global Analytics & Master Gradebook**
- Unified matrix displaying all students across all 12 chapter quizzes.
- Summary KPI Cards: Total Enrolled, Curriculum Length, Class Overall Average %, and Certified Graduates.
- Progress bars and completion badges (e.g. 🏆 Certified Graduate for passing all 12 chapters).
- Global export actions via Print, PDF, and `.CSV` download.

---

## 💻 Tech Stack
- **Backend:** Node.js, Express 5, MySQL2 (Dual-engine: MySQL + Standalone Persistent Store)
- **Frontend:** Vanilla ES6+ Modules, HTML5, CSS3 Custom Properties (No heavy frontend framework dependencies)
- **Typography:** Inter, JetBrains Mono
- **Print & PDF:** Dedicated `@media print` print-optimized stylesheets

