const { db } = require("../config/db");

exports.getCourse = async (req, res) => {
  try {
    const course = await db.getCourse();
    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error("getCourse error:", error);
    res.status(500).json({ success: false, message: "Failed to retrieve course metadata." });
  }
};

