const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
const paymentRoutes = require('./routes/payment.routes');
const chatbotRoutes = require("./routes/chatbot.routes");
const captainChatRoutes = require("./routes/captainChat.routes");
const rideHistoryRoutes = require("./routes/rideHistory.routes");


connectToDb();
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('AutoVelo Backend Run');
});
app.use('/users', userRoutes);

app.use('/captains', captainRoutes);

app.use('/maps', mapsRoutes);

app.use('/rides', rideRoutes);
app.use('/payment', paymentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/captain-ai", captainChatRoutes);
app.use("/ride-history", rideHistoryRoutes);
module.exports = app;

