const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const News = require('../models/newsfeedModel');

// Add news for newsfeed
router.post("/post/news", async (req, res) => {
    const { newImage, newHeader, newCategory, newDescription } = req.body;

    // Input validation
    if (!newImage || !newHeader || !newCategory || !newDescription) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const news = new News({
            image: newImage,
            header: newHeader,
            category: newCategory,
            description: newDescription,
        });

        await news.save();
        res.status(201).send('News posted successfully!');
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Update newsfeed
router.put("/update/news/:id", async (req, res) => {
    let newsId = req.params.id;
    const { image, header, category, description } = req.body;

    // Input validation
    if (!image || !header || !category || !description) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const updateNews = {
        image,
        header,
        category,
        description
    };

    try {
        const updatedNews = await News.findByIdAndUpdate(newsId, updateNews, { new: true });
        if (!updatedNews) {
            return res.status(404).json({ message: "News not found." });
        }
        res.send('News updated successfully!');
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Get all news
router.get("/getallnews", async (req, res) => {
    try {
        const news = await News.find({});
        res.json(news); // Use res.json for proper JSON response
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Get current news
router.get("/getcurrentnews/:id", async (req, res) => {
    let newsId = req.params.id;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(newsId)) {
        return res.status(400).json({ message: "Invalid news ID format." });
    }

    try {
        const currentnews = await News.findById(newsId);
        if (!currentnews) {
            return res.status(404).json({ message: "News not found." });
        }
        res.json(currentnews); // Use res.json for proper JSON response
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Delete news
router.delete("/delete/news/:id", async (req, res) => {
    let newsId = req.params.id;

    try {
        const deletedNews = await News.findByIdAndDelete(newsId);
        if (!deletedNews) {
            return res.status(404).json({ message: "News not found." });
        }
        res.send('News Deleted Successfully');
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Exporting router module for use in other files
module.exports = router;
