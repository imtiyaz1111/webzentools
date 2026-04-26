import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { 
    FaMagic, FaCopy, FaSyncAlt, FaImage, FaLightbulb, 
    FaCamera, FaPalette, FaExpand, FaDice, FaRocket 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './ImagePromptGenerator.css';
import aiService from '../../../../services/aiService.js';

const ImagePromptGenerator = () => {
    const [subject, setSubject] = useState('');
    const [style, setStyle] = useState('Photorealistic');
    const [lighting, setLighting] = useState('Cinematic Lighting');
    const [camera, setCamera] = useState('Wide Angle');
    const [artist, setArtist] = useState('None');
    const [ratio, setRatio] = useState('16:9');
    const [loading, setLoading] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState('');

    const styles = [
        { name: 'Photorealistic', icon: '📸' },
        { name: 'Cyberpunk', icon: '🤖' },
        { name: 'Digital Art', icon: '🎨' },
        { name: 'Oil Painting', icon: '🖼️' },
        { name: 'Anime', icon: '⛩️' },
        { name: '3D Render', icon: '🧊' },
        { name: 'Fantasy', icon: '🐉' },
        { name: 'Minimalist', icon: '⚪' }
    ];

    const lightings = [
        'Cinematic Lighting', 'Golden Hour', 'Moody / Dark', 
        'Studio Lighting', 'Volumetric Fog', 'Soft Sunlight', 'Neon Glow'
    ];

    const cameras = [
        'Wide Angle', 'Close-up Portrait', 'Drone View', 
        'Macro Shot', 'Fisheye Lens', 'Low Angle Shot'
    ];

    const artists = [
        'None', 'Van Gogh', 'Salvador Dali', 'Greg Rutkowski', 
        'Hayao Miyazaki', 'Wes Anderson', 'Zdzisław Beksiński'
    ];

    const aspectRatios = ['1:1', '16:9', '9:16', '4:3', '21:9'];

    const updatePrompt = useCallback((isAI = false) => {
        if (isAI) return; // Handled by AI function
        
        let prompt = subject || 'A beautiful landscape';
        if (style !== 'None') prompt += `, in ${style} style`;
        if (lighting !== 'None') prompt += `, ${lighting}`;
        if (camera !== 'None') prompt += `, ${camera}`;
        if (artist !== 'None') prompt += `, inspired by ${artist}`;
        if (ratio) prompt += ` --ar ${ratio}`;
        
        setGeneratedPrompt(prompt);
    }, [subject, style, lighting, camera, artist, ratio]);

    useEffect(() => {
        updatePrompt(false);
    }, [updatePrompt]);

    const expandWithAI = async () => {
        if (!subject) {
            toast.error('Please enter a subject first!');
            return;
        }

        setLoading(true);
        try {
            const promptRequest = `Expand this image prompt into a highly detailed, descriptive, and artistic masterpiece prompt for Midjourney/DALL-E. 
            Subject: ${subject}
            Style: ${style}
            Lighting: ${lighting}
            Camera: ${camera}
            Artist: ${artist}
            Aspect Ratio: ${ratio}
            Include descriptive adjectives, textures, and technical details. Output ONLY the final prompt.`;

            const result = await aiService.generateContent(promptRequest, 'text');
            setGeneratedPrompt(result);
            toast.success('AI Expansion complete!');
        } catch (err) {
            toast.error('AI Expansion failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const surpriseMe = () => {
        const randomSubjects = [
            'A futuristic city floating in the clouds',
            'A cybernetic samurai in a neon forest',
            'A cozy cottage in a giant mushroom forest',
            'An astronaut riding a glowing jellyfish through space',
            'A Victorian robot serving tea in a library',
            'An underwater kingdom made of crystals'
        ];
        const randomSubject = randomSubjects[Math.floor(Math.random() * randomSubjects.length)];
        setSubject(randomSubject);
        setStyle(styles[Math.floor(Math.random() * styles.length)].name);
        setLighting(lightings[Math.floor(Math.random() * lightings.length)]);
        setCamera(cameras[Math.floor(Math.random() * cameras.length)]);
        toast('Surprise! New idea generated.', { icon: '🎲' });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedPrompt);
        toast.success('Prompt copied to clipboard!');
    };

    return (
        <div className="image-prompt-generator py-4">
            <div className="prompt-card fade-in">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                            <FaImage size={24} />
                        </div>
                        <div>
                            <h2 className="h4 fw-bold mb-1">Image Prompt Master</h2>
                            <p className="text-muted mb-0 small">Create stunning visuals with precise AI prompts.</p>
                        </div>
                    </div>
                    <Button variant="light" className="rounded-pill px-3 shadow-sm" onClick={surpriseMe}>
                        <FaDice className="me-2" /> Surprise Me
                    </Button>
                </div>

                <Form>
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold text-dark small text-uppercase">What's the main subject?</Form.Label>
                        <Form.Control 
                            as="textarea"
                            rows={2}
                            placeholder="e.g. A majestic white wolf with glowing blue eyes..."
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="premium-input"
                        />
                    </Form.Group>

                    <div className="row">
                        <div className="col-lg-7">
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold text-dark small text-uppercase">Art Style</Form.Label>
                                <div className="style-grid">
                                    {styles.map(s => (
                                        <div 
                                            key={s.name}
                                            className={`style-item ${style === s.name ? 'selected' : ''}`}
                                            onClick={() => setStyle(s.name)}
                                        >
                                            <span className="style-icon">{s.icon}</span>
                                            <span className="small d-block">{s.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </Form.Group>
                        </div>
                        <div className="col-lg-5">
                            <div className="modifier-group h-100">
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small d-flex align-items-center gap-2">
                                        <FaLightbulb className="text-warning" /> Lighting
                                    </Form.Label>
                                    <Form.Select className="premium-input form-select-sm" value={lighting} onChange={(e) => setLighting(e.target.value)}>
                                        {lightings.map(l => <option key={l} value={l}>{l}</option>)}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small d-flex align-items-center gap-2">
                                        <FaCamera className="text-info" /> Camera
                                    </Form.Label>
                                    <Form.Select className="premium-input form-select-sm" value={camera} onChange={(e) => setCamera(e.target.value)}>
                                        {cameras.map(c => <option key={c} value={c}>{c}</option>)}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold small d-flex align-items-center gap-2">
                                        <FaPalette className="text-danger" /> Artist
                                    </Form.Label>
                                    <Form.Select className="premium-input form-select-sm" value={artist} onChange={(e) => setArtist(e.target.value)}>
                                        {artists.map(a => <option key={a} value={a}>{a}</option>)}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-0">
                                    <Form.Label className="fw-bold small">Aspect Ratio</Form.Label>
                                    <div className="d-flex gap-2">
                                        {aspectRatios.map(r => (
                                            <Button 
                                                key={r} 
                                                variant={ratio === r ? 'primary' : 'outline-light'}
                                                className={`py-1 px-2 small ${ratio === r ? '' : 'text-dark border-secondary border-opacity-25'}`}
                                                style={{ fontSize: '0.7rem' }}
                                                onClick={() => setRatio(r)}
                                            >
                                                {r}
                                            </Button>
                                        ))}
                                    </div>
                                </Form.Group>
                            </div>
                        </div>
                    </div>

                    <div className="prompt-output-container">
                        <div className="prompt-box">
                            {generatedPrompt}
                            <button className="copy-btn-float" onClick={(e) => { e.preventDefault(); copyToClipboard(); }}>
                                <FaCopy className="me-2" /> Copy
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 d-flex gap-3">
                        <Button 
                            className="btn-ai-expand flex-grow-1 d-flex align-items-center justify-content-center gap-2 pulse-ai"
                            onClick={expandWithAI}
                            disabled={loading}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : <FaRocket />}
                            {loading ? 'AI is Thinking...' : 'AI Super-Expand Prompt'}
                        </Button>
                        <Button 
                            variant="outline-secondary" 
                            className="rounded-4 px-4"
                            onClick={() => updatePrompt(false)}
                        >
                            <FaSyncAlt />
                        </Button>
                    </div>
                </Form>
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-6">
                    <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <FaExpand className="text-primary" /> Why use AI Expansion?
                        </h5>
                        <p className="text-muted small">
                            Basic prompts often yield generic results. Our AI expansion adds technical keywords like 
                            "octane render", "8k resolution", "volumetric lighting", and "hyper-detailed textures" 
                            that professional AI artists use to get stunning outputs.
                        </p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="p-4 bg-white rounded-4 shadow-sm border h-100">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                            <FaLightbulb className="text-warning" /> Prompting Tip
                        </h5>
                        <p className="text-muted small">
                            Midjourney works best with descriptive phrases separated by commas. 
                            Stable Diffusion loves technical tags, while DALL-E 3 prefers natural language descriptions. 
                            Our "Super-Expand" is optimized to work across all of them!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImagePromptGenerator;
