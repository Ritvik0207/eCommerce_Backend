const express = require("express");
const {
  createAdmin,
  loginAdmin,
  getAdmins,
  verifyAdminEmail,
  updateAdmin,
  deleteAdmin,
  getTotalAdminCount,
} = require("../controller/admin.controller");
const router = express.Router();
router.post("/create", createAdmin);
router.post("/login", loginAdmin);
router.get("/", getAdmins);
router.post("/verify-email", verifyAdminEmail);
router.put("/update", updateAdmin);
router.delete("/:adminId", deleteAdmin);
router.get("/count", getTotalAdminCount);

module.exports = router;
