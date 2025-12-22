import express from "express";
import {
  getUserAttendance,
  getSubjectAttendance,
  upsertAttendance,
  deleteSubjectForUser,
  clearAllAttendance,
  addSubject,
} from "../controllers/attendance.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/getAttendance", (req, res) =>
  getUserAttendance({ ...req, params: { userId: req.user._id } }, res)
);

router.get("/getSubjectAttendance/:subject", (req, res) =>
  getSubjectAttendance(
    { ...req, params: { userId: req.id, subject: req.params.subject } },
    res
  )
);
router.delete("/deleteSubject/:subject", isAuthenticated, deleteSubjectForUser);

router.delete("/clearAll", isAuthenticated, clearAllAttendance);

router.post("/updateAttendance", isAuthenticated, (req, res) => {
  upsertAttendance(req, res); // userId will come from req.user._id inside upsertAttendance
});

router.post("/addSubject", isAuthenticated, addSubject);


export default router;
