const axios = require('axios');

// Simple AI reply (replace later with Gemini/OpenAI)
exports.captainChat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const msg = message.toLowerCase();
        let reply = "";

        // 👋 Greeting
        if (msg.includes("hi") || msg.includes("hello")) {
            reply = "👋 Hello Captain! How can I assist you today?";
        }
        // 💰 Earnings
        else if (msg.includes("earning") || msg.includes("income") || msg.includes("money")) {
            reply = "💰 You can check today's earnings in your dashboard.";
        }
        // 🚗 Ride related
        else if (msg.includes("ride") || msg.includes("trip")) {
            reply = "📍 You will receive ride requests based on your location. Stay online to get rides!";
        }
        // 🗺️ Navigation
        else if (msg.includes("navigate") || msg.includes("map") || msg.includes("direction")) {
            reply = "🗺️ Use the in-app map for navigation. It updates in real-time!";
        }
        // ❌ Cancel
        else if (msg.includes("cancel")) {
            reply = "❌ You can cancel a ride from the ride screen, but frequent cancellations may affect your rating.";
        }
        // 🔧 Help / Support
        else if (msg.includes("help") || msg.includes("support") || msg.includes("issue")) {
            reply = "🔧 Support: Please describe your issue clearly and we'll help you out.";
        }
        // 📊 Rating
        else if (msg.includes("rating") || msg.includes("review")) {
            reply = "⭐ Your rating is based on rider feedback. Keep providing great service!";
        }
        // 💬 Default
        else {
            reply = "🤖 I can help with earnings, rides, navigation, and support. Try asking something like 'How are my earnings?'";
        }

        res.json({ reply });

    } catch (error) {
        console.error("Captain Chat Error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
