const express = require("express");
const router = express.Router();
const Pizza = require('../models/PizzaModel');

// Add new foods
router.post("/add/food", async (req, res) => {
    const { newName, newVarients, newPrices, newImage, newIsBeverage, newIsVegetarian, newIsNonVeg, newDescription } = req.body;

    // Input validation
    if (!newName || !newVarients || !newPrices || !newImage || newIsBeverage === undefined || newIsVegetarian === undefined || newIsNonVeg === undefined || !newDescription) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const food = new Pizza({
            name: newName,
            image: newImage,
            isBeverage: newIsBeverage,
            isVegetarian: newIsVegetarian,
            isNonVeg: newIsNonVeg,
            description: newDescription,
            varients: newVarients,
            prices: newPrices,
        });

        await food.save();
        res.status(201).json({ message: 'Food added successfully!' });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding food: ' + error.message });
    }
});

// Get all foods
router.get("/getallpizzas", async (req, res) => {
    try {
        const pizzas = await Pizza.find({});
        res.json(pizzas);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching pizzas: ' + error.message });
    }
});

// Get current food
router.get("/getcurrentfood/:id", async (req, res) => {
    const foodId = req.params.id;
    try {
        const currentFood = await Pizza.findById(foodId);
        if (!currentFood) {
            return res.status(404).json({ message: "Food not found." });
        }
        res.json(currentFood);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching food: ' + error.message });
    }
});

// Update foods
router.put("/update/food/:id", async (req, res) => {
    const foodId = req.params.id;
    const { name, varients, prices, image, isBeverage, isVegetarian, isNonVeg, description } = req.body;

    try {
        const updateFoods = {
            name,
            image,
            isBeverage,
            isVegetarian,
            isNonVeg,
            description,
            varients,
            prices,
        };

        const updatedFood = await Pizza.findByIdAndUpdate(foodId, updateFoods, { new: true });
        if (!updatedFood) {
            return res.status(404).json({ message: "Food not found." });
        }
        res.json({ message: 'Food updated successfully!' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating food: ' + error.message });
    }
});

// Delete foods
router.delete("/delete/food/:id", async (req, res) => {
    const foodId = req.params.id;

    try {
        const deletedFood = await Pizza.findByIdAndDelete(foodId);
        if (!deletedFood) {
            return res.status(404).json({ message: "Food not found." });
        }
        res.json({ message: 'Food deleted successfully!' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting food: ' + error.message });
    }
});

module.exports = router;
