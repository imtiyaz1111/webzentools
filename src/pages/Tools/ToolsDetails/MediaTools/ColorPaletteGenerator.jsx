import React, { useState, useEffect, useRef } from 'react';
import { FaPalette, FaSyncAlt, FaLock, FaUnlock, FaCopy, FaImage, FaDownload, FaCode, FaCheckCircle, FaTrashAlt, FaMagic, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ColorPaletteGenerator = () => {
    const [colors, setColors] = useState([]);
    const [harmony, setHarmony] = useState('random');
    const [history, setHistory] = useState([]);
    const fileInputRef = useRef(null);

    const generateRandomHex = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();

    const hsvToHex = (h, s, v) => {
        let r, g, b;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0').toUpperCase();
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const generatePalette = (mode = harmony) => {
        let newColors = [];
        const baseH = Math.random();
        const baseS = 0.5 + Math.random() * 0.4;
        const baseV = 0.8 + Math.random() * 0.2;

        if (mode === 'random') {
            newColors = Array(5).fill(0).map((_, i) => {
                if (colors[i]?.locked) return colors[i];
                return { hex: generateRandomHex(), locked: false };
            });
        } else {
            const offsets = {
                analogous: [0, 0.05, 0.1, -0.05, -0.1],
                complementary: [0, 0.5, 0, 0.5, 0.05],
                triadic: [0, 0.33, 0.66, 0.05, 0.38],
                monochromatic: [0, 0, 0, 0, 0]
            }[mode];

            newColors = Array(5).fill(0).map((_, i) => {
                if (colors[i]?.locked) return colors[i];
                let h = (baseH + (offsets[i] || 0)) % 1;
                let s = baseS;
                let v = baseV;
                if (mode === 'monochromatic') {
                    v = 0.2 + (i * 0.18);
                    s = baseS - (i * 0.05);
                }
                return { hex: hsvToHex(h, s, v), locked: false };
            });
        }

        if (colors.length > 0) setHistory(prev => [colors.map(c => c.hex), ...prev.slice(0, 9)]);
        setColors(newColors);
    };

    useEffect(() => {
        generatePalette('random');
        
        const handleSpace = (e) => {
            if (e.code === 'Space' && e.target === document.body) {
                e.preventDefault();
                generatePalette();
            }
        };
        window.addEventListener('keydown', handleSpace);
        return () => window.removeEventListener('keydown', handleSpace);
    }, []);

    const toggleLock = (index) => {
        const newColors = [...colors];
        newColors[index].locked = !newColors[index].locked;
        setColors(newColors);
    };

    const copyToClipboard = (text, msg = 'Color copied!') => {
        navigator.clipboard.writeText(text);
        toast.success(msg);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                const colorMap = {};
                
                // Sample every 50th pixel for performance
                for (let i = 0; i < pixels.length; i += 200) {
                    const r = pixels[i];
                    const g = pixels[i+1];
                    const b = pixels[i+2];
                    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
                    colorMap[hex] = (colorMap[hex] || 0) + 1;
                }

                const sortedColors = Object.entries(colorMap)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(c => ({ hex: c[0], locked: false }));

                setColors(sortedColors);
                toast.success('Palette extracted from image!');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const exportAsCSS = () => {
        const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n');
        copyToClipboard(`:root {\n${css}\n}`, 'CSS Variables copied!');
    };

    const getLuminance = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-12">
                    {/* Hero Header */}
                    <div className="text-center mb-5 p-4 rounded-4 shadow-lg overflow-hidden position-relative" style={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                            boxShadow: '0 8px 16px rgba(236, 72, 153, 0.2)'
                        }}>
                            <FaPalette className="text-white fs-3" />
                        </div>
                        <h2 className="fw-bold mb-2">Color Palette Generator</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Create stunning color schemes in seconds. Extract from images, use professional harmony modes, 
                            and export to your favorite design tools.
                        </p>
                        <div className="mt-3">
                            <span className="badge bg-dark-soft border border-secondary-subtle text-muted px-3 py-2 rounded-pill small">
                                Tip: Press <kbd className="mx-1 bg-dark text-white border-0">Space</kbd> to generate!
                            </span>
                        </div>
                    </div>

                    {/* Main Palette Display */}
                    <div className="palette-container rounded-4 shadow-2xl overflow-hidden d-flex mb-5 border border-secondary-subtle" style={{ height: '450px' }}>
                        {colors.map((color, index) => (
                            <div 
                                key={index} 
                                className="flex-fill h-100 position-relative d-flex flex-column align-items-center justify-content-center transition-all color-column"
                                style={{ backgroundColor: color.hex, color: getLuminance(color.hex) > 0.5 ? '#000' : '#fff' }}
                            >
                                <div className="action-buttons d-flex flex-column gap-3 opacity-0 transition-all">
                                    <button 
                                        className="btn btn-link p-2 rounded-circle hover-bg text-inherit" 
                                        onClick={() => toggleLock(index)}
                                        title={color.locked ? 'Unlock Color' : 'Lock Color'}
                                    >
                                        {color.locked ? <FaLock /> : <FaUnlock className="opacity-50" />}
                                    </button>
                                    <button 
                                        className="btn btn-link p-2 rounded-circle hover-bg text-inherit"
                                        onClick={() => copyToClipboard(color.hex)}
                                        title="Copy HEX"
                                    >
                                        <FaCopy />
                                    </button>
                                </div>
                                
                                <div className="mt-5 text-center">
                                    <h4 className="fw-bold font-monospace mb-0 cursor-pointer" onClick={() => copyToClipboard(color.hex)}>
                                        {color.hex}
                                    </h4>
                                    <div className="small opacity-50 text-uppercase fw-bold mt-1">Color {index + 1}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="glass-card p-4 rounded-4 shadow-lg mb-5 border border-secondary-subtle">
                        <div className="row g-4 align-items-center">
                            <div className="col-lg-4">
                                <div className="d-flex gap-2">
                                    <button className="btn btn-primary btn-lg rounded-pill px-4 flex-fill d-flex align-items-center justify-content-center shadow-lg" onClick={() => generatePalette()}>
                                        <FaSyncAlt className="me-2" /> Generate
                                    </button>
                                    <button className="btn btn-outline-secondary btn-lg rounded-pill px-4" onClick={() => fileInputRef.current.click()} title="Extract from Image">
                                        <FaImage />
                                    </button>
                                    <input type="file" ref={fileInputRef} className="d-none" accept="image/*" onChange={handleImageUpload} />
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="input-group">
                                    <span className="input-group-text bg-transparent border-0 text-muted"><FaMagic /></span>
                                    <select 
                                        className="form-select bg-dark border-secondary-subtle text-white rounded-pill shadow-none"
                                        value={harmony}
                                        onChange={(e) => {
                                            setHarmony(e.target.value);
                                            generatePalette(e.target.value);
                                        }}
                                    >
                                        <option value="random">Random Mode</option>
                                        <option value="analogous">Analogous</option>
                                        <option value="complementary">Complementary</option>
                                        <option value="triadic">Triadic</option>
                                        <option value="monochromatic">Monochromatic</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="d-flex gap-2 justify-content-lg-end">
                                    <button className="btn btn-dark border-secondary-subtle rounded-pill px-4 fw-bold" onClick={exportAsCSS}>
                                        <FaCode className="me-2" /> Copy CSS
                                    </button>
                                    <button className="btn btn-dark border-secondary-subtle rounded-pill px-4 fw-bold" onClick={() => copyToClipboard(JSON.stringify(colors.map(c => c.hex)), 'JSON Copied!')}>
                                        <FaDownload className="me-2" /> JSON
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Design Mockup Preview */}
                    <div className="row g-4 mb-5">
                        <div className="col-md-6">
                            <div className="glass-card p-5 rounded-4 border border-secondary-subtle h-100 position-relative overflow-hidden" style={{ backgroundColor: colors[0]?.hex }}>
                                <div className="position-relative" style={{ zIndex: 1, color: getLuminance(colors[0]?.hex || '#000') > 0.5 ? '#000' : '#fff' }}>
                                    <h2 className="fw-bold mb-4">Design Preview</h2>
                                    <p className="mb-4 opacity-75">See how your palette works on real UI components. The background uses your primary color.</p>
                                    <div className="d-flex gap-3 flex-wrap">
                                        <button className="btn px-4 py-2 rounded-pill border-0 shadow-lg fw-bold" style={{ backgroundColor: colors[1]?.hex, color: getLuminance(colors[1]?.hex || '#000') > 0.5 ? '#000' : '#fff' }}>
                                            Primary Action
                                        </button>
                                        <button className="btn px-4 py-2 rounded-pill border-0 shadow-lg fw-bold" style={{ backgroundColor: colors[2]?.hex, color: getLuminance(colors[2]?.hex || '#000') > 0.5 ? '#000' : '#fff' }}>
                                            Secondary
                                        </button>
                                        <div className="p-3 rounded-4 shadow-lg border-0 d-inline-block" style={{ backgroundColor: colors[3]?.hex, color: getLuminance(colors[3]?.hex || '#000') > 0.5 ? '#000' : '#fff' }}>
                                            <FaCheckCircle className="fs-3" />
                                        </div>
                                    </div>
                                </div>
                                <div className="position-absolute" style={{ bottom: '-20px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', backgroundColor: colors[4]?.hex, opacity: 0.3 }}></div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="glass-card p-4 rounded-4 border border-secondary-subtle h-100">
                                <h5 className="fw-bold mb-4">Generation History</h5>
                                {history.length === 0 ? (
                                    <div className="text-center py-5 opacity-25">
                                        <FaPalette className="display-4 mb-2" />
                                        <p>No history yet</p>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-3">
                                        {history.map((palette, i) => (
                                            <div key={i} className="d-flex rounded-3 overflow-hidden shadow-sm cursor-pointer border border-secondary-subtle transition-all history-item" style={{ height: '50px' }} onClick={() => setColors(palette.map(hex => ({ hex, locked: false })))}>
                                                {palette.map((hex, j) => (
                                                    <div key={j} className="flex-fill h-100" style={{ backgroundColor: hex }} title={hex}></div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .glass-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                }
                .bg-dark-soft { background: rgba(0, 0, 0, 0.2); }
                .success-soft { background: rgba(16, 185, 129, 0.1); }
                .transition-all { transition: all 0.3s ease; }
                .color-column:hover .action-buttons { opacity: 1; transform: translateY(-10px); }
                .hover-bg:hover { background: rgba(255, 255, 255, 0.2); }
                .text-inherit { color: inherit; }
                .cursor-pointer { cursor: pointer; }
                .history-item:hover { transform: scale(1.02); }
                kbd { padding: 2px 4px; border-radius: 4px; font-size: 0.8em; }
                .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
            `}} />
        </div>
    );
};

export default ColorPaletteGenerator;
