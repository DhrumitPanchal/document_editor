const express = require("express");

const {
  createNewDoc,
  updateDoc,
  getallDoc,
  getSingleDocData,
  ShareDoc,
} = require("../controllers/document");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();
router.post("/create", authenticateUser, createNewDoc);
router.put("/update/:id", authenticateUser, updateDoc);
router.get("/all", authenticateUser, getallDoc);
router.put("/share/:id", authenticateUser, ShareDoc);
router.get("/:id", authenticateUser, getSingleDocData);

module.exports = router;
