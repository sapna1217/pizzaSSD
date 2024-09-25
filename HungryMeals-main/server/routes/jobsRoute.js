const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Jobs = require('../models/jobsModel');

// Add new jobs
router.post("/post/jobs", async (req, res) => {
    const { jobtitle, category, description, salary, location } = req.body;

    // Input validation (basic example)
    if (!jobtitle || !category || !description || !salary || !location) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Creating a new job object and saving it in the database
        const newJobs = new Jobs({ jobtitle, category, description, salary, location });
        await newJobs.save();  // Ensure to await the save operation
        res.status(201).send('Job posted successfully!');

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Get all job details
router.get("/getalljobs", async (req, res) => {
    try {
        const jobs = await Jobs.find({});
        res.json(jobs); // Use res.json to ensure proper JSON response

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Update job details
router.put("/update/jobs/:id", async (req, res) => {
    let jobId = req.params.id;
    const { jobtitle, category, description, salary, location } = req.body;

    // Input validation
    if (!jobtitle || !category || !description || !salary || !location) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const updateJobs = {
        jobtitle,
        category,
        description,
        salary,
        location
    };

    try {
        const updatedJob = await Jobs.findByIdAndUpdate(jobId, updateJobs, { new: true });
        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found." });
        }
        res.send('Job details updated successfully!');

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Delete job
router.delete("/delete/jobs/:id", async (req, res) => {
    let jobId = req.params.id;

    try {
        const deletedJob = await Jobs.findByIdAndDelete(jobId);
        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found." });
        }
        res.send('Job Deleted Successfully');
        
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Get current job by ID
router.get("/getcurrentjobs/:id", async (req, res) => {
    let jobsId = req.params.id;

    // Validate ObjectId
    if (!mongoose.isValidObjectId(jobsId)) {
        return res.status(400).json({ message: "Invalid job ID format." });
    }

    try {
        const currentjobs = await Jobs.findById(jobsId);
        if (!currentjobs) {
            return res.status(404).json({ message: "Job not found." });
        }
        res.json(currentjobs); // Use res.json to ensure proper JSON response

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
});

// Exporting router module for use in other files
module.exports = router;
