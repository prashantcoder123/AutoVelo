import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const userText = message;

        const userMsg = {
            sender: "user",
            text: userText
        };

        // ✅ Add user message
        setChat(prev => [...prev, userMsg]);

        // ✅ Clear input
        setMessage("");

        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/chatbot/chat`,
                { message: userText }
            );

            const botMsg = {
                sender: "bot",
                text: res.data.reply
            };

            // ✅ Append bot message (NOT replace)
            setChat(prev => [...prev, botMsg]);

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            {/* 🔵 Floating Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={styles.button}
            >
                💬
            </div>

            {/* 💬 Chat Box */}
            {isOpen && (
                <div style={styles.chatContainer}>
                    <div style={styles.header}>
                        User Assistant
                        <span onClick={() => setIsOpen(false)} style={styles.close}>✖</span>
                    </div>

                    <div style={styles.chatBox}>
                        {chat.map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    textAlign: msg.sender === "user" ? "right" : "left",
                                    margin: "5px 0"
                                }}
                            >
                                <span style={{
                                    background: msg.sender === "user" ? "#007bff" : "#eee",
                                    color: msg.sender === "user" ? "#fff" : "#000",
                                    padding: "6px 10px",
                                    borderRadius: "10px",
                                    display: "inline-block"
                                }}>
                                    {msg.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div style={styles.inputBox}>
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type..."
                            style={styles.input}
                        />
                        <button onClick={sendMessage} style={styles.sendBtn}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {
    button: {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "#000",
        color: "#fff",
        fontSize: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 9999
    },
    chatContainer: {
        position: "fixed",
        bottom: "90px",
        right: "20px",
        width: "265px",
        height: "380px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        zIndex: 9999
    },
    header: {
        background: "#000",
        color: "#fff",
        padding: "10px",
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        display: "flex",
        justifyContent: "space-between"
    },
    close: {
        cursor: "pointer"
    },
    chatBox: {
        flex: 1,
        padding: "10px",
        overflowY: "auto"
    },
    inputBox: {
        display: "flex",
        borderTop: "1px solid #ccc"
    },
    input: {
        flex: 1,
        padding: "8px",
        border: "none",
        outline: "none"
    },
    sendBtn: {
        padding: "8px 12px",
        background: "#000",
        color: "#fff",
        border: "none",
        cursor: "pointer"
    }
};

export default ChatBot;