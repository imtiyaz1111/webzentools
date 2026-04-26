import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { FaCloudDownloadAlt, FaDownload, FaSyncAlt, FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaPlay, FaVideo } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';
import { Settings } from 'lucide-react';

const VideoDownloader = () => {
    const [ffmpeg, setFfmpeg] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [outputUrl, setOutputUrl] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, processing, finished, error
    const [logs, setLogs] = useState([]);

    // Settings
    const [targetFormat, setTargetFormat] = useState('mp4');
    const [targetResolution, setTargetResolution] = useState('720'); // height
    const [quality] = useState('23'); // CRF: lower is better quality (18-28 is typical)

    const fileInputRef = useRef(null);

    useEffect(() => {
        loadFFmpeg();
    }, []);

    useEffect(() => {
        return () => {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
        };
    }, [videoPreview]);

    useEffect(() => {
        return () => {
            if (outputUrl) URL.revokeObjectURL(outputUrl);
        };
    }, [outputUrl]);

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
            toast.error('Failed to load processing engine.');
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
            setOutputUrl(null);
            setProgress(0);
            setStatus('idle');
            
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const processVideo = async () => {
        if (!videoFile || !ffmpeg) return;

        try {
            setIsProcessing(true);
            setStatus('processing');
            setProgress(0);

            const inputExt = videoFile.name.split('.').pop();
            const inputName = `input.${inputExt}`;
            const outputName = `output.${targetFormat}`;

            await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

            // Transcoding command
            // Scale: -1:height maintains aspect ratio
            const args = [
                '-i', inputName,
                '-vf', `scale=-1:${targetResolution}`,
                '-c:v', targetFormat === 'webm' ? 'libvpx-vp9' : 'libx264',
                '-crf', quality,
                '-preset', 'veryfast',
                '-c:a', targetFormat === 'webm' ? 'libopus' : 'aac',
                outputName
            ];

            await ffmpeg.exec(args);

            const data = await ffmpeg.readFile(outputName);
            const mimeType = targetFormat === 'mp4' ? 'video/mp4' : `video/${targetFormat}`;
            const blob = new Blob([data.buffer], { type: mimeType });
            const url = URL.createObjectURL(blob);
            
            setOutputUrl(url);
            setStatus('finished');
            toast.success('Video processed successfully!');
        } catch (error) {
            console.error('Processing error:', error);
            setStatus('error');
            toast.error('An error occurred during video processing.');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadVideo = () => {
        if (outputUrl) {
            const fileName = videoFile.name.substring(0, videoFile.name.lastIndexOf('.')) || videoFile.name;
            saveAs(outputUrl, `${fileName}_${targetResolution}p.${targetFormat}`);
        }
    };

    const reset = () => {
        setVideoFile(null);
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
        setOutputUrl(null);
        setProgress(0);
        setStatus('idle');
        setLogs([]);
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Header */}
                    <div className="text-center mb-5 p-4 rounded-4 shadow-lg overflow-hidden position-relative" style={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
                        }}>
                            <FaCloudDownloadAlt className="text-white fs-3" />
                        </div>
                        <h2 className="fw-bold mb-2">Video Format Downloader</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Transcode and download your videos in any format and resolution. 
                            Professional quality with local-first security.
                        </p>
                    </div>

                    {!loaded && status === 'loading' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm glass-card border-dashed">
                            <div className="spinner-border text-primary mb-3" role="status"></div>
                            <h4 className="fw-semibold">Loading Core...</h4>
                            <p className="text-muted">Preparing advanced video processing tools.</p>
                        </div>
                    ) : status === 'error' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm bg-danger-soft border-danger">
                            <FaExclamationTriangle className="text-danger fs-1 mb-3" />
                            <h4 className="fw-semibold text-danger">Engine Error</h4>
                            <p className="text-muted mb-4">We couldn't initialize the video engine. Please refresh the page.</p>
                            <button className="btn btn-primary rounded-pill px-4" onClick={loadFFmpeg}>
                                <FaSyncAlt className="me-2" /> Retry
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg overflow-hidden position-relative">
                            <div className="position-absolute" style={{ top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
                            
                            <div className="position-relative" style={{ zIndex: 1 }}>
                                {!videoFile ? (
                                    <div 
                                        className="drop-zone py-5 text-center rounded-4 mb-4"
                                        onClick={() => fileInputRef.current.click()}
                                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#3b82f6'; }}
                                        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const file = e.dataTransfer.files[0];
                                            handleFileChange({ target: { files: [file] } });
                                        }}
                                    >
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="d-none" />
                                        <FaVideo className="fs-1 text-primary mb-3" />
                                        <h4 className="fw-bold">Upload Video to Format</h4>
                                        <p className="text-muted">Supports MP4, WebM, MOV, AVI, and more</p>
                                    </div>
                                ) : (
                                    <div className="video-editor">
                                        <div className="row g-4 mb-4">
                                            <div className="col-md-6">
                                                <div className="preview-panel p-3 rounded-4 bg-black border border-secondary-subtle shadow-inner">
                                                    <video src={videoPreview} controls className="w-100 rounded-3 shadow-lg" />
                                                    <div className="mt-3 text-center small text-muted">
                                                        <span className="fw-bold text-white">{videoFile.name}</span>
                                                        <br />
                                                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
                                                <div className="settings-panel p-4 rounded-4 bg-dark-soft border border-secondary-subtle">
                                                    <h5 className="fw-bold mb-4 d-flex align-items-center">
                                                        <Settings  className="text-primary me-2" /> Download Settings
                                                    </h5>

                                                    <div className="mb-3">
                                                        <label className="form-label small text-muted">Output Format</label>
                                                        <div className="d-flex gap-2">
                                                            {['mp4', 'webm', 'avi', 'mkv'].map(fmt => (
                                                                <button 
                                                                    key={fmt}
                                                                    className={`btn flex-fill rounded-3 py-2 text-uppercase fw-bold small transition-all ${targetFormat === fmt ? 'btn-primary shadow-glow' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setTargetFormat(fmt)}
                                                                >
                                                                    {fmt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="form-label small text-muted">Resolution (Downscaling)</label>
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {[
                                                                { l: '1080p', v: '1080' },
                                                                { l: '720p', v: '720' },
                                                                { l: '480p', v: '480' },
                                                                { l: '360p', v: '360' }
                                                            ].map(res => (
                                                                <button 
                                                                    key={res.v}
                                                                    className={`btn rounded-pill px-3 py-1 small transition-all ${targetResolution === res.v ? 'btn-info text-white fw-bold shadow-glow' : 'btn-outline-secondary'}`}
                                                                    onClick={() => setTargetResolution(res.v)}
                                                                >
                                                                    {res.l}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="d-grid gap-2">
                                                        {status === 'idle' && (
                                                            <>
                                                                <button 
                                                                    className="btn btn-primary btn-lg rounded-pill py-3 fw-bold shadow-lg"
                                                                    onClick={processVideo}
                                                                >
                                                                    Start Transcoding
                                                                </button>
                                                                <button className="btn btn-link text-muted text-decoration-none small" onClick={reset}>
                                                                    Upload Different Video
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {status === 'processing' && (
                                            <div className="text-center p-5 rounded-4 bg-dark-soft border border-secondary-subtle animate-fade-in">
                                                <div className="progress mb-4 rounded-pill" style={{ height: '15px', background: 'rgba(255, 255, 255, 0.1)' }}>
                                                    <div 
                                                        className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                                                        role="progressbar" 
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                                <h3 className="fw-bold mb-2">{progress}%</h3>
                                                <p className="text-muted">Preparing your video download... Processing frames.</p>
                                                
                                                <div className="text-start mt-4 p-3 rounded bg-dark border border-secondary-subtle overflow-auto" style={{ maxHeight: '100px' }}>
                                                    <code className="small text-info opacity-75">
                                                        {logs.map((log, i) => (
                                                            <div key={i} className="text-truncate">{log}</div>
                                                        ))}
                                                    </code>
                                                </div>
                                            </div>
                                        )}

                                        {status === 'finished' && (
                                            <div className="text-center p-5 rounded-4 bg-dark-soft border border-secondary-subtle animate-scale-in">
                                                <div className="d-inline-flex align-items-center justify-content-center mb-4 rounded-circle bg-success-soft p-4" style={{ width: '80px', height: '80px' }}>
                                                    <FaCheckCircle className="text-success display-4" />
                                                </div>
                                                <h4 className="fw-bold mb-2">Transcoding Successful!</h4>
                                                <p className="text-muted mb-4">Your video is ready to download in {targetFormat.toUpperCase()} at {targetResolution}p.</p>
                                                
                                                <div className="d-grid gap-3 max-width-400 mx-auto">
                                                    <button 
                                                        className="btn btn-success btn-lg rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center shadow-lg"
                                                        onClick={downloadVideo}
                                                    >
                                                        <FaDownload className="me-2" /> Download Video
                                                    </button>
                                                    <button className="btn btn-outline-secondary rounded-pill py-2" onClick={reset}>
                                                        Convert Another
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Features */}
                    <div className="row g-4 mt-5">
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100">
                                <FaPlay className="text-primary fs-3 mb-3" />
                                <h6 className="fw-bold">Fast Playback</h6>
                                <p className="text-muted small mb-0">Optimize your videos for web playback by converting to MP4 or WebM.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100">
                                <Settings className="text-info fs-3 mb-3" />
                                <h6 className="fw-bold">Resolution Control</h6>
                                <p className="text-muted small mb-0">Downscale 4K or 1080p videos to 720p or 480p to save space while maintaining quality.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100">
                                <FaInfoCircle className="text-success fs-3 mb-3" />
                                <h6 className="fw-bold">Private & Secure</h6>
                                <p className="text-muted small mb-0">Processing happens locally. No files are uploaded to our servers—your privacy is our priority.</p>
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
                    border-color: #3b82f6;
                    background: rgba(255, 255, 255, 0.05);
                }
                .bg-dark-soft { background: rgba(0, 0, 0, 0.2); }
                .bg-success-soft { background: rgba(16, 185, 129, 0.1); }
                .bg-danger-soft { background: rgba(239, 68, 68, 0.1); }
                .shadow-glow { box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
                .max-width-400 { max-width: 400px; }
                .animate-fade-in { animation: fadeIn 0.5s ease; }
                .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .transition-all { transition: all 0.3s ease; }
            `}} />
        </div>
    );
};

export default VideoDownloader;
