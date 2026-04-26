import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * AI Service for communicating with the backend /api/ai endpoint.
 */
const aiService = {
    /**
     * Generates content using Gemini AI via the backend proxy.
     * @param {string} prompt - The prompt for the AI.
     * @param {string} type - The expected response type ('text' or 'json').
     * @returns {Promise<any>} - The generated data.
     */
    async generateContent(prompt, type = 'text') {
        try {
            const response = await axios.post('/api/ai', { prompt, type });
            
            if (response.data && response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Failed to generate content.');
            }
        } catch (error) {
            console.error('AI Service Error:', error);
            
            // Helpful message for local development
            if (error.response && (error.response.status === 404 || error.response.status === 502)) {
                const msg = "AI API Gateway error. If developing locally, please use 'vercel dev'.";
                toast.error(msg);
                throw new Error(msg);
            }

            const errorMsg = error.response?.data?.message || error.message || 'An error occurred during AI generation.';
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }
    }
};

export default aiService;
