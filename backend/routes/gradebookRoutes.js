const express = require("express");
const router = express.Router();
const gradebookController = require("../controllers/gradebookController");
const { authenticate, requireAuth, requireFaculty } = require("../middleware/auth");

router.get("/topic/:chapterId", authenticate, requireFaculty, gradebookController.getTopicGradebook);
router.get("/topic/:chapterId/export", authenticate, requireFaculty, gradebookController.exportTopicCSV);

router.get("/master", authenticate, requireFaculty, gradebookController.getMasterGradebook);
router.get("/master/export", authenticate, requireFaculty, gradebookController.exportMasterCSV);

router.get("/report", authenticate, requireAuth, gradebookController.getStudentReport);
router.get("/report/:studentId", authenticate, requireAuth, gradebookController.getStudentReport);

module.exports = router;
