import axios from 'axios';

/**
 * Vercel Serverless Function: api/chat.js
 * Handles Chatbot interactions using Gemini 1.5 Flash API with conversation history.
 */
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }

    const { history, message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, message: "Message is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ 
            success: false, 
            message: "Gemini API key is not configured on the server." 
        });
    }

    // System instruction to give the chatbot its identity
    const systemInstruction = {
        parts: [{
            text: `You are the official AI Assistant for WebzenTools. 
WebzenTools is a premium, free online platform offering over 100+ browser-based utilities.
Key categories include:
- Developer Tools (JSON Formatter, HTML/CSS/JS Editors, Base64, etc.)
- Image Tools (Compressor, Resizer, Background Remover, Upscaler, etc.)
- PDF & Document Tools (Merger, Splitter, Editor, Converter, etc.)
- AI Tools (Text Generator, Blog Writer, Code Explainer, etc.)
- Finance Tools (EMI Calculator, Currency Converter, etc.)
- SEO & Marketing Tools

Your primary goal is to help users find the right tools, explain how to use them, and provide general assistance related to development, productivity, and the platform. 
Always maintain a professional, helpful, and concise tone. 
Important: Emphasize that WebzenTools is 100% free, browser-based, secure (zero data uploads for most tools), and requires no registration.`
        }]
    };

    // Format history for Gemini API
    // Ensure history is an array and properly formatted
    const formattedHistory = Array.isArray(history) ? history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    })) : [];

    // Append the current message
    formattedHistory.push({
        role: 'user',
        parts: [{ text: message }]
    });

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                systemInstruction: systemInstruction,
                contents: formattedHistory
            }
        );

        const data = response.data;

        if (data.error) {
            throw new Error(data.error.message || "Gemini API error");
        }

        const reply = data.candidates[0].content.parts[0].text;

        return res.status(200).json({ success: true, reply });

    } catch (error) {
        console.error('Chat API Error:', error.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            message: error.response?.data?.error?.message || error.message || "Failed to generate chat response." 
        });
    }
}
