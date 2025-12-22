import express from "express";
import { addItem, getItems, deleteItem } from "../controllers/lostFound.controller.js";
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.get("/getItems", getItems);

router.post("/addItem", isAuthenticated, addItem);

router.delete("/deleteItem/:id", isAuthenticated, deleteItem);

export default router;
