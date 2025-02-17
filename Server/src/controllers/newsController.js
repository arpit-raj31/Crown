import News from "../models/News.js";

// Create a new news entry
export const addNews = async (req, res) => {
  try {
    const { title, subContent, link, newstype, newsImpact, newsTime } = req.body;

    if (!title || !subContent || !newstype || !newsImpact || !newsTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const news = new News({ title, subContent, link, newstype, newsImpact, newsTime });
    await news.save();

    res.status(201).json({ message: "News added successfully!", data: news });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while adding news.", error: error.message });
  }
};

// Get all news
export const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }); // Sort by latest news
    res.status(200).json({ data: news });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching news.", error: error.message });
  }
};

// Get a single news entry by ID
export const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ message: "News not found." });
    }

    res.status(200).json({ data: news });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching news.", error: error.message });
  }
};

// Update a news entry by ID
export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subContent, link, newstype, newsImpact, newsTime } = req.body;

    if (!title || !subContent || !newstype || !newsImpact || !newsTime) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updatedNews = await News.findByIdAndUpdate(
      id,
      { title, subContent, link, newstype, newsImpact, newsTime },
      { new: true }
    );

    if (!updatedNews) {
      return res.status(404).json({ message: "News not found." });
    }

    res.status(200).json({ message: "News updated successfully!", data: updatedNews });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating news.", error: error.message });
  }
};

// Delete a news entry by ID
export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({ message: "News not found." });
    }

    res.status(200).json({ message: "News deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting news.", error: error.message });
  }
};
