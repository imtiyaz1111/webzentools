import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { FaVideo, FaCompress, FaCloudUploadAlt, FaDownload, FaSyncAlt, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaFileVideo } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

const VideoCompressor = () => {
    const [ffmpeg, setFfmpeg] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [compressedUrl, setCompressedUrl] = useState(null);
    const [compressedSize, setCompressedSize] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, loading, compressing, finished, error
    const [logs, setLogs] = useState([]);
    const [quality, setQuality] = useState('medium'); // small, medium, high
    
    const fileInputRef = useRef(null);

    const qualitySettings = {
        small: { crf: '32', preset: 'faster', label: 'Smallest Size', desc: 'Lower quality, fastest compression' },
        medium: { crf: '28', preset: 'medium', label: 'Balanced', desc: 'Good balance of quality and size' },
        high: { crf: '23', preset: 'slow', label: 'High Quality', desc: 'Best quality, larger file, slower' }
    };

    useEffect(() => {
        loadFFmpeg();
        return () => {
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
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
            toast.error('Failed to load video processor.');
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
            setCompressedUrl(null);
            setProgress(0);
            setStatus('idle');
            
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const compressVideo = async () => {
        if (!videoFile || !ffmpeg) return;

        try {
            setIsCompressing(true);
            setStatus('compressing');
            setProgress(0);

            const inputName = 'input.mp4';
            const outputName = 'output.mp4';

            await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

            const settings = qualitySettings[quality];

            // Compression command:
            // -i: input
            // -vcodec libx264: use H.264 codec
            // -crf: Constant Rate Factor (0-51, lower is better quality, 23-28 is standard)
            // -preset: compression speed/efficiency trade-off
            // -acodec copy: copy audio without re-encoding to save time
            await ffmpeg.exec([
                '-i', inputName,
                '-vcodec', 'libx264',
                '-crf', settings.crf,
                '-preset', settings.preset,
                '-acodec', 'aac',
                '-b:a', '128k',
                outputName
            ]);

            const data = await ffmpeg.readFile(outputName);
            const blob = new Blob([data.buffer], { type: 'video/mp4' });
            const url = URL.createObjectURL(blob);
            
            setCompressedUrl(url);
            setCompressedSize(blob.size);
            setStatus('finished');
            toast.success('Compression completed!');
        } catch (error) {
            console.error('Compression error:', error);
            setStatus('error');
            toast.error('An error occurred during compression.');
        } finally {
            setIsCompressing(false);
        }
    };

    const downloadVideo = () => {
        if (compressedUrl) {
            saveAs(compressedUrl, `compressed_${videoFile.name}`);
        }
    };

    const reset = () => {
        setVideoFile(null);
        if (videoPreview) URL.revokeObjectURL(videoPreview);
        setVideoPreview(null);
        setCompressedUrl(null);
        setProgress(0);
        setStatus('idle');
        setLogs([]);
    };

    const formatSize = (bytes) => {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const compressionRatio = videoFile && compressedSize 
        ? Math.round((1 - (compressedSize / videoFile.size)) * 100)
        : 0;

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
                            background: 'linear-gradient(135deg, #3b82f6, #2dd4bf)',
                            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
                        }}>
                            <FaCompress className="text-white fs-3" />
                        </div>
                        <h2 className="fw-bold mb-2">Video Compressor</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Reduce video file size without quality loss. All processing happens in your browser, 
                            meaning your files never leave your device.
                        </p>
                    </div>

                    {!loaded && status === 'loading' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm glass-card border-dashed">
                            <div className="spinner-border text-primary mb-3" role="status"></div>
                            <h4 className="fw-semibold">Initializing Video Engine...</h4>
                            <p className="text-muted">Preparing the compressor for action.</p>
                        </div>
                    ) : status === 'error' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm bg-danger-soft border-danger">
                            <FaExclamationTriangle className="text-danger fs-1 mb-3" />
                            <h4 className="fw-semibold text-danger">Processor Error</h4>
                            <p className="text-muted mb-4">We couldn't load the compression engine. Please check your internet connection.</p>
                            <button className="btn btn-primary rounded-pill px-4" onClick={loadFFmpeg}>
                                <FaSyncAlt className="me-2" /> Retry Initialization
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg overflow-hidden position-relative">
                            <div className="position-absolute" style={{ bottom: '-50px', left: '-50px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(45, 212, 191, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
                            
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
                                        <FaCloudUploadAlt className="fs-1 text-primary mb-3" />
                                        <h4 className="fw-bold">Upload Video to Compress</h4>
                                        <p className="text-muted">Drag & drop or click to choose a file</p>
                                        <div className="mt-4">
                                            <span className="badge bg-dark-soft text-muted px-3 py-2 rounded-pill mx-1 border border-secondary-subtle">MP4</span>
                                            <span className="badge bg-dark-soft text-muted px-3 py-2 rounded-pill mx-1 border border-secondary-subtle">MOV</span>
                                            <span className="badge bg-dark-soft text-muted px-3 py-2 rounded-pill mx-1 border border-secondary-subtle">AVI</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row g-4 align-items-start">
                                        <div className="col-md-5">
                                            <div className="video-preview-wrapper rounded-4 overflow-hidden shadow-lg border border-secondary-subtle mb-3">
                                                <video 
                                                    src={status === 'finished' ? compressedUrl : videoPreview} 
                                                    controls 
                                                    className="w-100 d-block" 
                                                    style={{ maxHeight: '300px', backgroundColor: '#000' }}
                                                />
                                            </div>
                                            
                                            <div className="p-3 rounded-3 bg-dark-soft border border-secondary-subtle">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="small text-muted">Original:</span>
                                                    <span className="fw-bold">{formatSize(videoFile.size)}</span>
                                                </div>
                                                {status === 'finished' && (
                                                    <>
                                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                                            <span className="small text-muted">Compressed:</span>
                                                            <span className="fw-bold text-success">{formatSize(compressedSize)}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary-subtle">
                                                            <span className="small text-muted">Reduced By:</span>
                                                            <span className="badge bg-success-soft text-success rounded-pill px-3">{compressionRatio}%</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-7">
                                            {status === 'idle' && (
                                                <div className="p-4 rounded-4" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <h5 className="fw-bold mb-4 d-flex align-items-center">
                                                        <FaSyncAlt className="me-2 text-primary" /> Compression Settings
                                                    </h5>
                                                    
                                                    <div className="row g-3 mb-4">
                                                        {Object.entries(qualitySettings).map(([key, value]) => (
                                                            <div className="col-12" key={key}>
                                                                <div 
                                                                    className={`p-3 rounded-3 border transition-all cursor-pointer ${quality === key ? 'border-primary bg-primary-soft' : 'border-secondary-subtle bg-transparent'}`}
                                                                    onClick={() => setQuality(key)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                                        <span className={`fw-bold ${quality === key ? 'text-primary' : ''}`}>{value.label}</span>
                                                                        {quality === key && <FaCheckCircle className="text-primary" />}
                                                                    </div>
                                                                    <div className="small text-muted">{value.desc}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="d-grid gap-2">
                                                        <button 
                                                            className="btn btn-primary btn-lg rounded-pill py-3"
                                                            onClick={compressVideo}
                                                        >
                                                            Compress Now
                                                        </button>
                                                        <button className="btn btn-link text-muted text-decoration-none" onClick={reset}>
                                                            Change File
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {status === 'compressing' && (
                                                <div className="p-4 rounded-4 text-center" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <div className="progress mb-4 rounded-pill" style={{ height: '15px', background: 'rgba(255, 255, 255, 0.1)' }}>
                                                        <div 
                                                            className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                                                            role="progressbar" 
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <h3 className="fw-bold mb-2">{progress}%</h3>
                                                    <p className="text-muted mb-4">Compressing your video... Please wait.</p>
                                                    
                                                    <div className="text-start p-3 rounded bg-dark border border-secondary-subtle overflow-auto" style={{ maxHeight: '120px' }}>
                                                        <code className="small text-success">
                                                            {logs.map((log, i) => (
                                                                <div key={i} className="text-truncate">{log}</div>
                                                            ))}
                                                        </code>
                                                    </div>
                                                </div>
                                            )}

                                            {status === 'finished' && (
                                                <div className="p-4 rounded-4 text-center" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                    <FaCheckCircle className="text-success display-4 mb-3" />
                                                    <h4 className="fw-bold mb-2">Ready for Download!</h4>
                                                    <p className="text-muted mb-4">Your video has been successfully compressed.</p>
                                                    
                                                    <div className="d-grid gap-3">
                                                        <button 
                                                            className="btn btn-success btn-lg rounded-pill py-3 d-flex align-items-center justify-content-center"
                                                            onClick={downloadVideo}
                                                        >
                                                            <FaDownload className="me-2" /> Download Compressed Video
                                                        </button>
                                                        <button className="btn btn-outline-secondary rounded-pill py-2" onClick={reset}>
                                                            Compress Another
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

                    {/* Features & Help */}
                    <div className="row g-4 mt-5">
                        <div className="col-md-4 text-center">
                            <div className="p-4 rounded-4 glass-card h-100">
                                <FaFileVideo className="text-primary fs-3 mb-3" />
                                <h6 className="fw-bold">Smart Compression</h6>
                                <p className="text-muted small">Advanced algorithms maintain high visual quality while drastically reducing file size.</p>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="p-4 rounded-4 glass-card h-100">
                                <FaInfoCircle className="text-success fs-3 mb-3" />
                                <h6 className="fw-bold">Private & Secure</h6>
                                <p className="text-muted small">No servers involved. Your sensitive videos stay right on your device throughout the process.</p>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="p-4 rounded-4 glass-card h-100">
                                <FaDownload className="text-info fs-3 mb-3" />
                                <h6 className="fw-bold">Fast Downloads</h6>
                                <p className="text-muted small">Once processing is complete, download your optimized video instantly at the click of a button.</p>
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
                .bg-primary-soft { background: rgba(59, 130, 246, 0.1); }
                .bg-success-soft { background: rgba(16, 185, 129, 0.1); }
                .bg-danger-soft { background: rgba(239, 68, 68, 0.1); }
                .cursor-pointer { cursor: pointer; }
                .transition-all { transition: all 0.3s ease; }
            `}} />
        </div>
    );
};

export default VideoCompressor;
