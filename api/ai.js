import axios from 'axios';

/**
 * Vercel Serverless Function: api/ai.js
 * Securely handles Gemini AI requests using the server-side API key.
 */
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
    }

    const { prompt, type } = req.body;

    if (!prompt) {
        return res.status(400).json({ success: false, message: "Prompt is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ 
            success: false, 
            message: "Gemini API key is not configured on the server. Please add GEMINI_API_KEY to environment variables." 
        });
    }

    try {
        // Call Gemini API
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );

        const data = response.data;

        if (data.error) {
            throw new Error(data.error.message || "Gemini API error");
        }

        let result = data.candidates[0].content.parts[0].text;

        // If the request expected JSON, we try to extract it from the AI response
        if (type === 'json') {
            try {
                // Remove markdown code blocks if present
                const jsonStr = result.replace(/```json|```/g, '').trim();
                // Sometimes AI adds text before or after the JSON, let's try to find the JSON structure
                const startIdx = jsonStr.indexOf('[');
                const endIdx = jsonStr.lastIndexOf(']');
                const startObjIdx = jsonStr.indexOf('{');
                const endObjIdx = jsonStr.lastIndexOf('}');

                let cleanJson;
                if (startIdx !== -1 && (startObjIdx === -1 || startIdx < startObjIdx)) {
                    cleanJson = jsonStr.substring(startIdx, endIdx + 1);
                } else if (startObjIdx !== -1) {
                    cleanJson = jsonStr.substring(startObjIdx, endObjIdx + 1);
                } else {
                    cleanJson = jsonStr;
                }

                result = JSON.parse(cleanJson);
            } catch (e) {
                console.warn("Failed to parse AI response as JSON:", e);
                // Fallback to returning raw text if JSON parsing fails
            }
        }

        return res.status(200).json({ success: true, data: result });

    } catch (error) {
        console.error('AI API Error:', error.response?.data || error.message);
        return res.status(500).json({ 
            success: false, 
            message: error.response?.data?.error?.message || error.message || "Failed to generate content from AI." 
        });
    }
}
