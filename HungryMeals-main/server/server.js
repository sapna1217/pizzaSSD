const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const helmet = require('helmet');

// Import models
const Pizza = require('./models/PizzaModel');
const User = require('./models/userModel');
const Admin = require('./models/adminModel');
const Feedback = require('./models/feedbackModel');
const Notification = require('./models/notificationModel');
const Delivery = require('./models/deliveryModel');
const Driver = require('./models/driverModel');
const News = require('./models/newsfeedModel');
const Jobs = require('./models/jobsModel');
const Applications = require('./models/JobApplyModel');
const Refund = require('./models/refundModel');
const Stocks = require('./models/stocksModel');

// Initialize app
const app = express();
app.use(helmet());
app.use(helmet.noSniff());


// Static files (for future extensions or uploads)
app.use(express.static(path.join(__dirname, 'public')));
const db = require('./db');

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());




// Import routes
const pizzaRoute = require('./routes/pizzasRoute');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const ordersRoute = require('./routes/ordersRoute');
const feedbackRoute = require('./routes/feedbackRoute');
const notificationRoute = require('./routes/notificationRoute');
const deliveryRoute = require('./routes/deliveryRoute');
const ticketRoute = require('./routes/ticketRoute');
const newsfeedRoute = require('./routes/newsfeedRoute');
const jobsRoute = require('./routes/jobsRoute');
const JobApplyRoute = require('./routes/JobApplyRoute');
const refundRoute = require('./routes/refundRoute');
const stocksRoute = require('./routes/stocksRoute');
const stockspurchaseRoute = require('./routes/stocksPurchaseRoute');

// Route handling
app.use('/api/pizzas/', pizzaRoute);
app.use('/api/feedback/', feedbackRoute);
app.use('/api/users/', userRoute);
app.use('/api/admins/', adminRoute);
app.use('/api/orders/', ordersRoute);
app.use('/api/delivery/', deliveryRoute);
app.use('/api/tickets/', ticketRoute);
app.use('/api/notifications/', notificationRoute);
app.use('/api/newsfeed/', newsfeedRoute);
app.use('/api/jobportal/', jobsRoute);
app.use('/api/jobapply/', JobApplyRoute);
app.use('/api/refunds/', refundRoute);
app.use('/api/stocks/', stocksRoute);
app.use('/api/stockspurchase', stockspurchaseRoute);


// Test route
app.get("/", (req, res) => {
  res.send("Server Working!");
});

// Start server
const port = process.env.PORT || 8070;
app.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
