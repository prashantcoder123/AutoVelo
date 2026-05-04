module.exports.chatWithAI = async (req, res) => {
    const { message } = req.body;

    const msg = message.toLowerCase();

    try {
        // 👋 Greeting
        if (msg.includes("hi") || msg.includes("hello")) {
            return res.json({
                reply: "👋 Hi! I can help you book rides, check fares, or track drivers."
            });
        }

        // 🚗 Book Ride Intent
        if (msg.includes("book")) {
            return res.json({
                reply: "🚗 Sure! Please enter pickup and destination to book your ride."
            });
        }

        // 💰 Fare
        if (msg.includes("fare") || msg.includes("price")) {
            return res.json({
                reply: "💰 Please enter pickup and destination to calculate fare."
            });
        }

        // 📍 Driver location
        if (msg.includes("where is driver") || msg.includes("track")) {
            return res.json({
                reply: "📍 You can track your driver on the map in real-time."
            });
        }

        // 🚕 Vehicle types
        if (msg.includes("auto") || msg.includes("bike") || msg.includes("car")) {
            return res.json({
                reply: "🚕 Available options: Auto, Bike, Mini, Sedan."
            });
        }

        // ❌ Cancel ride
        if (msg.includes("cancel")) {
            return res.json({
                reply: "❌ You can cancel your ride from the ride screen."
            });
        }

        // 💬 Default response
        return res.json({
            reply: "🤖 I can help with booking rides, fares, and tracking. Try asking something like 'Book a ride'."
        });

    } catch (error) {
        res.json({
            reply: "⚠️ Something went wrong"
        });
    }
};