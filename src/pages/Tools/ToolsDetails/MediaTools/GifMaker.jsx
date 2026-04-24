import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { FaVideo, FaMagic, FaCloudUploadAlt, FaDownload, FaSyncAlt, FaTimes, FaCheckCircle, FaExclamationTriangle, FaClock, FaExpandArrowsAlt } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

const GifMaker = () => {
    const [ffmpeg, setFfmpeg] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [gifUrl, setGifUrl] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, converting, finished, error
    const [logs, setLogs] = useState([]);
    
    // Settings
    const [startTime, setStartTime] = useState(0);
    const [duration, setDuration] = useState(5);
    const [fps, setFps] = useState(10);
    const [width, setWidth] = useState(480);
    const [videoDuration, setVideoDuration] = useState(0);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        loadFFmpeg();
        return () => {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            if (gifUrl) URL.revokeObjectURL(gifUrl);
        };
    }, []);

    const loadFFmpeg = async () => {
        try {
            setStatus('loading');
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
            const ffmpegInstance = new FFmpeg();
            
            ffmpegInstance.on('log', ({ message }) => {
                setLogs(prev => [...prev.slice(-5), message]);
            });

            ffmpegInstance.on('progress', ({ progress }) => {
                setProgress(Math.round(progress * 100));
            });

            await ffmpegInstance.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            setFfmpeg(ffmpegInstance);
            setLoaded(true);
            setStatus('idle');
        } catch (error) {
            console.error('FFmpeg load error:', error);
            setStatus('error');
            toast.error('Failed to load GIF engine.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('video/')) {
                toast.error('Please select a valid video file.');
                return;
            }
            setVideoFile(file);
            setGifUrl(null);
            setProgress(0);
            setStatus('idle');
            
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const onVideoLoaded = (e) => {
        setVideoDuration(e.target.duration);
        if (e.target.duration < 5) setDuration(e.target.duration);
    };

    const createGif = async () => {
        if (!videoFile || !ffmpeg) return;

        try {
            setIsConverting(true);
            setStatus('converting');
            setProgress(0);

            const inputName = 'input.mp4';
            const outputName = 'output.gif';

            await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

            // High Quality GIF Command:
            // 1. Generate palette for better colors
            // 2. Use palette to generate GIF
            await ffmpeg.exec([
                '-i', inputName,
                '-ss', startTime.toString(),
                '-t', duration.toString(),
                '-vf', `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`,
                '-f', 'gif',
                outputName
            ]);

            const data = await ffmpeg.readFile(outputName);
            const blob = new Blob([data.buffer], { type: 'image/gif' });
            const url = URL.createObjectURL(blob);
            
            setGifUrl(url);
            setStatus('finished');
            toast.success('GIF created successfully!');
        } catch (error) {
            console.error('GIF error:', error);
            setStatus('error');
            toast.error('An error occurred while creating GIF.');
        } finally {
            setIsConverting(false);
        }
    };

    const downloadGif = () => {
        if (gifUrl) {
            saveAs(gifUrl, `${videoFile.name.split('.')[0]}.gif`);
        }
    };

    const reset = () => {
        setVideoFile(null);
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
        setGifUrl(null);
        setProgress(0);
        setStatus('idle');
        setLogs([]);
        setStartTime(0);
        setDuration(5);
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Hero Section */}
                    <div className="text-center mb-5 p-4 rounded-4" style={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                            boxShadow: '0 8px 16px rgba(245, 158, 11, 0.2)'
                        }}>
                            <FaMagic className="text-white fs-3" />
                        </div>
                        <h2 className="fw-bold mb-2">High Quality GIF Maker</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Convert video clips into stunning animated GIFs. 
                            Professional quality with advanced palette optimization, right in your browser.
                        </p>
                    </div>

                    {!loaded && status === 'loading' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm glass-card border-dashed">
                            <div className="spinner-border text-warning mb-3" role="status"></div>
                            <h4 className="fw-semibold">Loading GIF Engine...</h4>
                            <p className="text-muted">Initializing specialized color processors.</p>
                        </div>
                    ) : status === 'error' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm bg-danger-soft border-danger">
                            <FaExclamationTriangle className="text-danger fs-1 mb-3" />
                            <h4 className="fw-semibold text-danger">Engine Error</h4>
                            <p className="text-muted mb-4">Failed to initialize the GIF processor. Please refresh the page.</p>
                            <button className="btn btn-warning rounded-pill px-4" onClick={loadFFmpeg}>
                                <FaSyncAlt className="me-2" /> Retry
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg overflow-hidden position-relative">
                            <div className="position-absolute" style={{ top: '-80px', right: '-80px', width: '280px', height: '280px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
                            
                            <div className="position-relative" style={{ zIndex: 1 }}>
                                {!videoFile ? (
                                    <div 
                                        className="drop-zone py-5 text-center rounded-4 mb-4"
                                        onClick={() => fileInputRef.current.click()}
                                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#f59e0b'; }}
                                        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const file = e.dataTransfer.files[0];
                                            handleFileChange({ target: { files: [file] } });
                                        }}
                                    >
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="d-none" />
                                        <FaCloudUploadAlt className="fs-1 text-warning mb-3" />
                                        <h4 className="fw-bold">Upload Video to Convert</h4>
                                        <p className="text-muted">MP4, WEBM, MOV supported</p>
                                    </div>
                                ) : (
                                    <div className="row g-4 align-items-start">
                                        <div className="col-md-5">
                                            <div className="video-preview-wrapper rounded-4 overflow-hidden shadow-lg border border-secondary-subtle mb-3 bg-black">
                                                {status === 'finished' ? (
                                                    <img src={gifUrl} alt="Generated GIF" className="w-100 d-block" />
                                                ) : (
                                                    <video 
                                                        ref={videoRef}
                                                        src={videoPreview} 
                                                        controls 
                                                        className="w-100 d-block" 
                                                        style={{ maxHeight: '300px' }}
                                                        onLoadedMetadata={onVideoLoaded}
                                                    />
                                                )}
                                            </div>
                                            
                                            <div className="p-3 rounded-3 bg-dark-soft border border-secondary-subtle">
                                                <div className="d-flex align-items-center justify-content-between mb-1">
                                                    <span className="small text-muted">File:</span>
                                                    <span className="small fw-bold text-truncate ms-2">{videoFile.name}</span>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span className="small text-muted">Video Length:</span>
                                                    <span className="small fw-bold">{videoDuration.toFixed(1)}s</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-7">
                                            {status === 'idle' && (
                                                <div className="p-4 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <h5 className="fw-bold mb-4 d-flex align-items-center text-warning">
                                                        <FaClock className="me-2" /> GIF Settings
                                                    </h5>
                                                    
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-6">
                                                            <label className="form-label small text-muted">Start Time (s)</label>
                                                            <input 
                                                                type="number" 
                                                                className="form-control bg-dark border-secondary-subtle text-white rounded-3 shadow-none"
                                                                value={startTime}
                                                                onChange={(e) => setStartTime(Math.max(0, Math.min(videoDuration, Number(e.target.value))))}
                                                                step="0.1"
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="form-label small text-muted">Duration (s)</label>
                                                            <input 
                                                                type="number" 
                                                                className="form-control bg-dark border-secondary-subtle text-white rounded-3 shadow-none"
                                                                value={duration}
                                                                onChange={(e) => setDuration(Math.max(0.1, Math.min(videoDuration - startTime, Number(e.target.value))))}
                                                                step="0.1"
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="form-label small text-muted">FPS (Smoothness)</label>
                                                            <select 
                                                                className="form-select bg-dark border-secondary-subtle text-white rounded-3 shadow-none"
                                                                value={fps}
                                                                onChange={(e) => setFps(Number(e.target.value))}
                                                            >
                                                                <option value="5">5 FPS (Basic)</option>
                                                                <option value="10">10 FPS (Standard)</option>
                                                                <option value="15">15 FPS (Smooth)</option>
                                                                <option value="20">20 FPS (Pro)</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="form-label small text-muted">Width (px)</label>
                                                            <select 
                                                                className="form-select bg-dark border-secondary-subtle text-white rounded-3 shadow-none"
                                                                value={width}
                                                                onChange={(e) => setWidth(Number(e.target.value))}
                                                            >
                                                                <option value="320">320px (Mobile)</option>
                                                                <option value="480">480px (Medium)</option>
                                                                <option value="640">640px (High)</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="d-grid gap-2">
                                                        <button 
                                                            className="btn btn-warning btn-lg rounded-pill py-3 fw-bold shadow-lg"
                                                            onClick={createGif}
                                                            disabled={!loaded}
                                                        >
                                                            <FaMagic className="me-2" /> Generate GIF
                                                        </button>
                                                        <button className="btn btn-link text-muted text-decoration-none" onClick={reset}>
                                                            Choose different video
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {status === 'converting' && (
                                                <div className="p-4 rounded-4 text-center" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <div className="progress mb-4 rounded-pill" style={{ height: '15px', background: 'rgba(255, 255, 255, 0.1)' }}>
                                                        <div 
                                                            className="progress-bar progress-bar-striped progress-bar-animated bg-warning" 
                                                            role="progressbar" 
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <h3 className="fw-bold mb-2 text-warning">{progress}%</h3>
                                                    <p className="text-muted mb-4">Generating high-quality palette and encoding GIF...</p>
                                                    
                                                    <div className="text-start p-3 rounded bg-dark border border-secondary-subtle overflow-auto" style={{ maxHeight: '120px' }}>
                                                        <code className="small text-warning">
                                                            {logs.map((log, i) => (
                                                                <div key={i} className="text-truncate"> {log}</div>
                                                            ))}
                                                        </code>
                                                    </div>
                                                </div>
                                            )}

                                            {status === 'finished' && (
                                                <div className="p-4 rounded-4 text-center" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <FaCheckCircle className="text-success display-4 mb-3" />
                                                    <h4 className="fw-bold mb-2">GIF Ready!</h4>
                                                    <p className="text-muted mb-4">Your animated GIF is ready for download.</p>
                                                    
                                                    <div className="d-grid gap-3">
                                                        <button 
                                                            className="btn btn-warning btn-lg rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center shadow-lg"
                                                            onClick={downloadGif}
                                                        >
                                                            <FaDownload className="me-2" /> Download GIF
                                                        </button>
                                                        <button className="btn btn-outline-secondary rounded-pill py-2" onClick={reset}>
                                                            Create Another
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Pro Tips */}
                    <div className="row g-4 mt-5">
                        <div className="col-md-6">
                            <div className="p-4 rounded-4 glass-card h-100">
                                <div className="d-flex align-items-center mb-3 text-warning">
                                    <FaMagic className="me-2" /> <h5 className="fw-bold mb-0">Advanced Optimization</h5>
                                </div>
                                <p className="text-muted small mb-0">We use a two-pass encoding process to generate a custom color palette for every GIF, ensuring the highest possible color accuracy even with 256 colors.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-4 rounded-4 glass-card h-100">
                                <div className="d-flex align-items-center mb-3 text-warning">
                                    <FaExpandArrowsAlt className="me-2" /> <h5 className="fw-bold mb-0">Quality Control</h5>
                                </div>
                                <p className="text-muted small mb-0">Higher FPS and resolution results in smoother animations but larger file sizes. We recommend 10 FPS and 480px for standard web use.</p>
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
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .border-dashed {
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                }
                .drop-zone {
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.02);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .drop-zone:hover {
                    border-color: #f59e0b;
                    background: rgba(255, 255, 255, 0.05);
                }
                .bg-dark-soft { background: rgba(0, 0, 0, 0.2); }
                .bg-danger-soft { background: rgba(239, 68, 68, 0.1); }
                .transition-all { transition: all 0.3s ease; }
            `}} />
        </div>
    );
};

export default GifMaker;
