import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { FaVideo, FaMusic, FaCloudUploadAlt, FaDownload, FaSyncAlt, FaTimes, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

const VideoToMP3 = () => {
    const [ffmpeg, setFfmpeg] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [mp3Url, setMp3Url] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, converting, finished, error
    const [logs, setLogs] = useState([]);
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadFFmpeg();
        return () => {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            if (mp3Url) URL.revokeObjectURL(mp3Url);
        };
    }, []);

    const loadFFmpeg = async () => {
        try {
            setStatus('loading');
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
            const ffmpegInstance = new FFmpeg();
            
            ffmpegInstance.on('log', ({ message }) => {
                setLogs(prev => [...prev.slice(-5), message]);
                // console.log(message);
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
            toast.error('Failed to load video processor. Please refresh or try a modern browser.');
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
            setMp3Url(null);
            setProgress(0);
            setStatus('idle');
            
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const convertToMp3 = async () => {
        if (!videoFile || !ffmpeg) return;

        try {
            setIsConverting(true);
            setStatus('converting');
            setProgress(0);

            const inputName = 'input.mp4';
            const outputName = 'output.mp3';

            await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

            // Extract audio command: 
            // -i: input
            // -vn: disable video
            // -ab: audio bitrate
            // -ar: audio rate
            await ffmpeg.exec([
                '-i', inputName,
                '-vn',
                '-acodec', 'libmp3lame',
                '-ab', '192k',
                '-ar', '44100',
                outputName
            ]);

            const data = await ffmpeg.readFile(outputName);
            const blob = new Blob([data.buffer], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            
            setMp3Url(url);
            setStatus('finished');
            toast.success('Conversion completed successfully!');
        } catch (error) {
            console.error('Conversion error:', error);
            setStatus('error');
            toast.error('An error occurred during conversion.');
        } finally {
            setIsConverting(false);
        }
    };

    const downloadMp3 = () => {
        if (mp3Url) {
            saveAs(mp3Url, `${videoFile.name.split('.')[0]}.mp3`);
        }
    };

    const reset = () => {
        setVideoFile(null);
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
        setMp3Url(null);
        setProgress(0);
        setStatus('idle');
        setLogs([]);
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
                            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                            boxShadow: '0 8px 16px rgba(236, 72, 153, 0.2)'
                        }}>
                            <FaVideo className="text-white fs-3" />
                        </div>
                        <h2 className="fw-bold mb-2">Video to MP3 Converter</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Extract high-quality audio from any video file directly in your browser. 
                            Private, fast, and secure – your files never leave your device.
                        </p>
                    </div>

                    {!loaded && status === 'loading' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm" style={{ 
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px dashed rgba(255, 255, 255, 0.1)'
                        }}>
                            <div className="spinner-border text-primary mb-3" role="status"></div>
                            <h4 className="fw-semibold">Initializing Video Processor...</h4>
                            <p className="text-muted">This may take a few seconds on the first load.</p>
                        </div>
                    ) : status === 'error' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm" style={{ 
                            background: 'rgba(239, 68, 68, 0.05)',
                            border: '1px solid rgba(239, 68, 68, 0.2)'
                        }}>
                            <FaExclamationTriangle className="text-danger fs-1 mb-3" />
                            <h4 className="fw-semibold text-danger">Processor Error</h4>
                            <p className="text-muted mb-4">We couldn't load the conversion engine. Please check your internet connection and ensure your browser is up to date.</p>
                            <button className="btn btn-primary rounded-pill px-4" onClick={loadFFmpeg}>
                                <FaSyncAlt className="me-2" /> Retry Initialization
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg overflow-hidden position-relative">
                            {/* Background Elements */}
                            <div className="position-absolute" style={{ top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
                            
                            <div className="position-relative" style={{ zIndex: 1 }}>
                                {!videoFile ? (
                                    <div 
                                        className="drop-zone py-5 text-center rounded-4 mb-4"
                                        style={{ 
                                            border: '2px dashed rgba(255, 255, 255, 0.1)',
                                            background: 'rgba(255, 255, 255, 0.02)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => fileInputRef.current.click()}
                                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#ec4899'; }}
                                        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const file = e.dataTransfer.files[0];
                                            handleFileChange({ target: { files: [file] } });
                                        }}
                                    >
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            onChange={handleFileChange} 
                                            accept="video/*" 
                                            className="d-none" 
                                        />
                                        <FaCloudUploadAlt className="fs-1 text-primary mb-3" style={{ opacity: 0.8 }} />
                                        <h4 className="fw-bold">Drop your video here</h4>
                                        <p className="text-muted">or click to browse from your computer</p>
                                        <div className="mt-4">
                                            <span className="badge bg-dark-soft text-muted px-3 py-2 rounded-pill mx-1 border border-secondary-subtle">MP4</span>
                                            <span className="badge bg-dark-soft text-muted px-3 py-2 rounded-pill mx-1 border border-secondary-subtle">MOV</span>
                                            <span className="badge bg-dark-soft text-muted px-3 py-2 rounded-pill mx-1 border border-secondary-subtle">AVI</span>
                                            <span className="badge bg-dark-soft text-muted px-3 py-2 rounded-pill mx-1 border border-secondary-subtle">MKV</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row g-4 align-items-center">
                                        <div className="col-md-5">
                                            <div className="video-preview-wrapper rounded-4 overflow-hidden shadow-lg border border-secondary-subtle">
                                                <video 
                                                    src={videoPreview} 
                                                    controls 
                                                    className="w-100 d-block" 
                                                    style={{ maxHeight: '300px', backgroundColor: '#000' }}
                                                />
                                            </div>
                                            <div className="mt-3 p-3 rounded-3 bg-dark-soft border border-secondary-subtle">
                                                <div className="d-flex align-items-center mb-1">
                                                    <FaVideo className="text-primary me-2" />
                                                    <span className="text-truncate fw-semibold">{videoFile.name}</span>
                                                </div>
                                                <div className="small text-muted">
                                                    {(videoFile.size / (1024 * 1024)).toFixed(2)} MB • {videoFile.type}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-7">
                                            <div className="p-4 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                {status === 'idle' && (
                                                    <div className="text-center py-4">
                                                        <h5 className="fw-bold mb-3">Ready to Convert</h5>
                                                        <p className="text-muted small mb-4">Click the button below to start extracting the audio track as a high-quality 192kbps MP3.</p>
                                                        <div className="d-grid gap-2">
                                                            <button 
                                                                className="btn btn-primary btn-lg rounded-pill shadow-lg py-3 px-5 transition-all"
                                                                onClick={convertToMp3}
                                                                disabled={!loaded}
                                                            >
                                                                <FaSyncAlt className={`me-2 ${isConverting ? 'fa-spin' : ''}`} />
                                                                Start Conversion
                                                            </button>
                                                            <button className="btn btn-link text-muted text-decoration-none" onClick={reset}>
                                                                <FaTimes className="me-1" /> Choose different file
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}

                                                {status === 'converting' && (
                                                    <div className="py-4 text-center">
                                                        <div className="progress mb-4 rounded-pill" style={{ height: '12px', background: 'rgba(255, 255, 255, 0.1)' }}>
                                                            <div 
                                                                className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                                                                role="progressbar" 
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <h4 className="fw-bold mb-2">{progress}%</h4>
                                                        <p className="text-muted">Converting video to MP3... Please stay on this page.</p>
                                                        
                                                        <div className="mt-4 text-start p-3 rounded bg-dark border border-secondary-subtle" style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                                            <code className="small text-success">
                                                                {logs.map((log, i) => (
                                                                    <div key={i} className="text-truncate"> {log}</div>
                                                                ))}
                                                            </code>
                                                        </div>
                                                    </div>
                                                )}

                                                {status === 'finished' && (
                                                    <div className="py-3 text-center">
                                                        <div className="mb-4">
                                                            <FaCheckCircle className="text-success display-4 mb-3" />
                                                            <h4 className="fw-bold">Conversion Successful!</h4>
                                                            <p className="text-muted">Your MP3 file is ready for download.</p>
                                                        </div>
                                                        
                                                        <div className="d-grid gap-3">
                                                            <button 
                                                                className="btn btn-success btn-lg rounded-pill shadow-lg py-3 px-5 d-flex align-items-center justify-content-center"
                                                                onClick={downloadMp3}
                                                            >
                                                                <FaDownload className="me-2" /> Download MP3
                                                            </button>
                                                            <button className="btn btn-outline-secondary rounded-pill py-2" onClick={reset}>
                                                                <FaSyncAlt className="me-2" /> Convert Another
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Features Section */}
                    <div className="row g-4 mt-5">
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 h-100" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <div className="text-primary mb-3 fs-3"><FaMusic /></div>
                                <h5 className="fw-bold">192kbps Quality</h5>
                                <p className="text-muted small mb-0">High-bitrate audio extraction ensures clear sound quality for your music and podcasts.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 h-100" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <div className="text-success mb-3 fs-3"><FaCheckCircle /></div>
                                <h5 className="fw-bold">Zero Uploads</h5>
                                <p className="text-muted small mb-0">Processing happens entirely in your browser. No data is sent to any server, ensuring 100% privacy.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 h-100" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <div className="text-info mb-3 fs-3"><FaCloudUploadAlt /></div>
                                <h5 className="fw-bold">Universal Formats</h5>
                                <p className="text-muted small mb-0">Supports MP4, MOV, AVI, MKV, and most popular video formats for seamless extraction.</p>
                            </div>
                        </div>
                    </div>

                    {/* SEO Information */}
                    <div className="mt-5 p-4 p-md-5 rounded-4" style={{ 
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <h3 className="fw-bold mb-4">Frequently Asked Questions</h3>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <h5 className="fw-bold text-primary">Is it free to use?</h5>
                                <p className="text-muted">Yes, our Video to MP3 converter is 100% free with no hidden charges, watermarks, or registration required.</p>
                            </div>
                            <div className="col-md-6">
                                <h5 className="fw-bold text-primary">Is my privacy protected?</h5>
                                <p className="text-muted">Absolutely. We use WASM technology to process your files locally. Your videos are never uploaded to any server.</p>
                            </div>
                            <div className="col-md-6">
                                <h5 className="fw-bold text-primary">What formats are supported?</h5>
                                <p className="text-muted">You can extract audio from MP4, WebM, MOV, AVI, MKV, and many other common video container formats.</p>
                            </div>
                            <div className="col-md-6">
                                <h5 className="fw-bold text-primary">How long does it take?</h5>
                                <p className="text-muted">The speed depends on your device's CPU and the length of the video. Most conversions take just a few seconds.</p>
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
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .drop-zone:hover {
                    background: rgba(255, 255, 255, 0.05) !important;
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                }
                .bg-dark-soft {
                    background: rgba(0, 0, 0, 0.2);
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
                }
                .btn-success:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
                }
            `}} />
        </div>
    );
};

export default VideoToMP3;
