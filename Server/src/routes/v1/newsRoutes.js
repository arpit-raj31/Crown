import express from "express";
import { addNews, getAllNews, getNewsById, updateNews, deleteNews } from "../../controllers/newsController.js";

const router = express.Router();

// Route to add news
router.post("/add", addNews);

// Route to get all news
router.get("/", getAllNews);

// Route to get a specific news entry by ID
router.get("/:id", getNewsById);

// Route to update news by ID
router.put("/:id", updateNews);

// Route to delete news by ID
router.delete("/:id", deleteNews);

export default router;

