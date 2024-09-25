const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Order = require('../models/orderModel');
const stripe = require("stripe")("sk_test_51FfQBPHdYSqFNE7IJEw81G8DKDo4N94EVn2rMf4RSZsipha3JhUtLCf4lwdl3YgswTcSfMhsrfuUHlr5Ekdds5h900pSVlOeSb");

// Place order
router.post("/placeorder", async (req, res) => {
    const { token, subtotal, currentUser, cartItems, coordinates } = req.body;

    // Input validation
    if (!token || !subtotal || !currentUser || !cartItems || !coordinates) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });

        const payment = await stripe.charges.create({
            amount: subtotal * 100,
            currency: 'LKR',
            customer: customer.id,
            receipt_email: token.email,
        }, {
            idempotencyKey: uuidv4(),
        });

        if (payment) {
            const newOrder = new Order({
                name: currentUser.name,
                email: currentUser.email,
                userid: currentUser._id,
                orderItems: cartItems,
                coordinates: coordinates,
                orderAmount: subtotal,
                shippingAddress: {
                    street: token.card.address_line1,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    pincode: token.card.address_zip,
                },
                transactionId: payment.source.id,
            });

            await newOrder.save();
            res.status(201).send('Order placed successfully');
        } else {
            res.status(400).send('Payment Failed');
        }
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong: ' + error.message });
    }
});

// Get user orders
router.post("/getuserorders", async (req, res) => {
    const { userid } = req.body;

    // Input validation
    if (!userid) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        const orders = await Order.find({ userid: userid }).sort({ _id: -1 });
        res.json(orders);
    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong: ' + error.message });
    }
});

// Get all orders
router.get("/getallorders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Delete order
router.delete("/delete/Order/:id", async (req, res) => {
    let orderId = req.params.id;

    try {
        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.send('Order Deleted Successfully');
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get current order
router.get("/getcurrentorders/:id", async (req, res) => {
    let orderId = req.params.id;

    try {
        const currentOrder = await Order.findById(orderId);
        if (!currentOrder) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.json(currentOrder);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update order status
router.put("/update/order/status/:id", async (req, res) => {
    let orderId = req.params.id;
    const { isDelivered } = req.body;

    if (typeof isDelivered !== "boolean") {
        return res.status(400).json({ message: "isDelivered must be a boolean." });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { isDelivered }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.send('Order delivery request updated successfully');
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update refund request status
router.put("/update/order/refund/request/:id", async (req, res) => {
    let orderId = req.params.id;
    const { sendrefundStatus } = req.body;

    if (typeof sendrefundStatus !== "boolean") {
        return res.status(400).json({ message: "sendrefundStatus must be a boolean." });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { sendrefundStatus }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.send('Order refund request updated successfully');
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update order status from user
router.put("/update/order/refund/request/user/:id", async (req, res) => {
    let orderId = req.params.id;
    const { orderStatus } = req.body;

    if (!orderStatus) {
        return res.status(400).json({ message: "Order status is required." });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.send('Order refund request status updated successfully');
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update transaction status
router.put("/update/transactionstatus/:id", async (req, res) => {
    let salesId = req.params.id;
    const { isSuccessfull } = req.body;

    if (typeof isSuccessfull !== "boolean") {
        return res.status(400).json({ message: "isSuccessfull must be a boolean." });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(salesId, { isSuccessfull }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.send('Refund Status Updated Successfully');
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;
