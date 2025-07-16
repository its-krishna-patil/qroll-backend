const fs = require("fs");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

async function generateCSV(sessionId) {
  try {
    const records = await Attendance.find({ sessionId }).populate("studentId");
    const rows = records.map(
      (r) => `${r.studentId.name},${r.studentId.email},${r.timestamp.toISOString()}`
    );
    const content = "Name,Email,Time\n" + rows.join("\n");
    fs.writeFileSync("report.csv", content);
    console.log("✅ report.csv generated successfully");
  } catch (err) {
    console.error("❌ Error generating CSV:", err.message);
  }
}

module.exports = generateCSV;