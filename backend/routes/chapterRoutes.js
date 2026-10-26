const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapterController");
const { authenticate, requireFaculty } = require("../middleware/auth");

router.get("/", authenticate, chapterController.getChapters);
router.get("/:id", authenticate, chapterController.getChapter);
router.put("/:id", authenticate, requireFaculty, chapterController.updateChapter);

module.exports = router;

