import axios from 'axios';

/**
 * Vercel Serverless Function: api/chat.js
 * Handles Chatbot interactions using a completely free third-party API (Pollinations.ai)
 * that does not require an API key.
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }

    const { history, message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, message: "Message is required." });
    }

    const systemInstructionText = `You are the official AI Assistant for WebzenTools. 
WebzenTools is a premium, free online platform offering over 100+ browser-based utilities.
Key categories include:
- Developer Tools (JSON Formatter, HTML/CSS/JS Editors, Base64, etc.)
- Image Tools (Compressor, Resizer, Background Remover, Upscaler, etc.)
- PDF & Document Tools (Merger, Splitter, Editor, Converter, etc.)
- AI Tools (Text Generator, Blog Writer, Code Explainer, etc.)
- Finance Tools (EMI Calculator, Currency Converter, etc.)
- SEO & Marketing Tools

Your primary goal is to help users find the right tools, explain how to use them, and provide general assistance. 
You must ALWAYS respond in JSON format. 
The JSON must have this exact structure:
{
  "reply": "Your helpful response formatted in markdown.",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}
The 'suggestions' array should contain 2-3 short, relevant follow-up questions or actions the user might want to take next based on your reply.`;

    // Map the history to the standard OpenAI format used by Pollinations
    const formattedHistory = Array.isArray(history) ? history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
    })) : [];

    // Add system instruction at the beginning
    const messagesPayload = [
        { role: 'system', content: systemInstructionText },
        ...formattedHistory,
        { role: 'user', content: message }
    ];

    try {
        // Use the completely free Pollinations API (no key required)
        const response = await axios.post(
            'https://text.pollinations.ai/',
            {
                messages: messagesPayload,
                jsonMode: true, // Tell the model to return JSON
                seed: Math.floor(Math.random() * 1000) // Ensure fresh responses
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // The API returns plain text, so we parse it
        const replyRaw = response.data;
        
        let parsed;
        try {
            // Sometimes it wraps the JSON in markdown code blocks
            const cleanStr = typeof replyRaw === 'string' ? replyRaw.replace(/```json|```/g, '').trim() : JSON.stringify(replyRaw);
            parsed = typeof replyRaw === 'object' ? replyRaw : JSON.parse(cleanStr);
        } catch(e) {
            console.error("Failed to parse JSON from AI", e);
            parsed = {
                reply: typeof replyRaw === 'string' ? replyRaw : JSON.stringify(replyRaw),
                suggestions: []
            };
        }

        return res.status(200).json({ 
            success: true, 
            reply: parsed.reply || parsed.text || "Here is your response.",
            suggestions: parsed.suggestions || []
        });

    } catch (error) {
        console.error('Chat API Error:', error.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            message: error.response?.data?.error || error.message || "Failed to generate chat response." 
        });
    }
}
