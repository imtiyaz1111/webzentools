import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { FaMusic, FaExchangeAlt, FaCloudUploadAlt, FaDownload, FaSyncAlt, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaPlay, FaPause } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

const AudioConverter = () => {
    const [ffmpeg, setFfmpeg] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [convertedUrl, setConvertedUrl] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, converting, finished, error
    const [logs, setLogs] = useState([]);
    
    // Settings
    const [targetFormat, setTargetFormat] = useState('mp3');
    const [bitrate, setBitrate] = useState('192k');
    const [isPlaying, setIsPlaying] = useState(false);

    const fileInputRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        loadFFmpeg();
        return () => {
            if (audioPreview) URL.revokeObjectURL(audioPreview);
            if (convertedUrl) URL.revokeObjectURL(convertedUrl);
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
            toast.error('Failed to load audio processor.');
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('audio/')) {
                toast.error('Please select a valid audio file.');
                return;
            }
            setAudioFile(file);
            setConvertedUrl(null);
            setProgress(0);
            setStatus('idle');
            
            if (audioPreview) URL.revokeObjectURL(audioPreview);
            setAudioPreview(URL.createObjectURL(file));
        }
    };

    const convertAudio = async () => {
        if (!audioFile || !ffmpeg) return;

        try {
            setIsConverting(true);
            setStatus('converting');
            setProgress(0);

            const inputExt = audioFile.name.split('.').pop();
            const inputName = `input.${inputExt}`;
            const outputName = `output.${targetFormat}`;

            await ffmpeg.writeFile(inputName, await fetchFile(audioFile));

            // Conversion command
            const args = ['-i', inputName, '-b:a', bitrate, outputName];
            await ffmpeg.exec(args);

            const data = await ffmpeg.readFile(outputName);
            const mimeType = targetFormat === 'mp3' ? 'audio/mpeg' : `audio/${targetFormat}`;
            const blob = new Blob([data.buffer], { type: mimeType });
            const url = URL.createObjectURL(blob);
            
            setConvertedUrl(url);
            setStatus('finished');
            toast.success('Conversion completed!');
        } catch (error) {
            console.error('Conversion error:', error);
            setStatus('error');
            toast.error('An error occurred during conversion.');
        } finally {
            setIsConverting(false);
        }
    };

    const downloadAudio = () => {
        if (convertedUrl) {
            const fileName = audioFile.name.substring(0, audioFile.name.lastIndexOf('.')) || audioFile.name;
            saveAs(convertedUrl, `${fileName}.${targetFormat}`);
        }
    };

    const reset = () => {
        setAudioFile(null);
        if (audioPreview) URL.revokeObjectURL(audioPreview);
        setAudioPreview(null);
        setConvertedUrl(null);
        setProgress(0);
        setStatus('idle');
        setLogs([]);
    };

    const togglePreview = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
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
                            background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)'
                        }}>
                            <FaExchangeAlt className="text-white fs-3" />
                        </div>
                        <h2 className="fw-bold mb-2">Premium Audio Converter</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Convert your audio files between MP3, WAV, AAC, and more. 
                            Studio-quality transcoding right in your browser with privacy guaranteed.
                        </p>
                    </div>

                    {!loaded && status === 'loading' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm glass-card border-dashed">
                            <div className="spinner-border text-success mb-3" role="status"></div>
                            <h4 className="fw-semibold">Initializing Transcoder...</h4>
                            <p className="text-muted">Setting up high-performance audio codecs.</p>
                        </div>
                    ) : status === 'error' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm bg-danger-soft border-danger">
                            <FaExclamationTriangle className="text-danger fs-1 mb-3" />
                            <h4 className="fw-semibold text-danger">Processing Error</h4>
                            <p className="text-muted mb-4">We couldn't load the conversion engine. Please check your internet connection.</p>
                            <button className="btn btn-success rounded-pill px-4" onClick={loadFFmpeg}>
                                <FaSyncAlt className="me-2" /> Retry
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg overflow-hidden position-relative">
                            <div className="position-absolute" style={{ bottom: '-60px', left: '-60px', width: '260px', height: '260px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
                            
                            <div className="position-relative" style={{ zIndex: 1 }}>
                                {!audioFile ? (
                                    <div 
                                        className="drop-zone py-5 text-center rounded-4 mb-4"
                                        onClick={() => fileInputRef.current.click()}
                                        onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#10b981'; }}
                                        onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const file = e.dataTransfer.files[0];
                                            handleFileChange({ target: { files: [file] } });
                                        }}
                                    >
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="d-none" />
                                        <FaCloudUploadAlt className="fs-1 text-success mb-3" />
                                        <h4 className="fw-bold">Upload Audio to Convert</h4>
                                        <p className="text-muted">Supports MP3, WAV, AAC, OGG, M4A, etc.</p>
                                    </div>
                                ) : (
                                    <div className="row g-4">
                                        <div className="col-md-5">
                                            <div className="audio-preview-card p-4 rounded-4 bg-dark-soft border border-secondary-subtle text-center mb-3">
                                                <div className="d-inline-flex align-items-center justify-content-center mb-3 rounded-circle bg-success-soft p-4" style={{ width: '80px', height: '80px' }}>
                                                    <FaMusic className="text-success fs-2" />
                                                </div>
                                                <h6 className="fw-bold text-truncate mb-1">{audioFile.name}</h6>
                                                <p className="text-muted small mb-3">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                
                                                <audio ref={audioRef} src={audioPreview} onEnded={() => setIsPlaying(false)} className="d-none" />
                                                <button 
                                                    className="btn btn-outline-success rounded-pill px-4 py-2"
                                                    onClick={togglePreview}
                                                >
                                                    {isPlaying ? <FaPause className="me-2" /> : <FaPlay className="me-2" />} 
                                                    {isPlaying ? 'Pause' : 'Play Preview'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="col-md-7">
                                            {status === 'idle' && (
                                                <div className="settings-panel p-4 rounded-4 bg-dark-soft border border-secondary-subtle">
                                                    <h5 className="fw-bold mb-4 d-flex align-items-center text-success">
                                                        <FaExchangeAlt className="me-2" /> Conversion Options
                                                    </h5>
                                                    
                                                    <div className="row g-3 mb-4">
                                                        <div className="col-12">
                                                            <label className="form-label small text-muted">Output Format</label>
                                                            <div className="d-flex flex-wrap gap-2">
                                                                {['mp3', 'wav', 'aac', 'ogg', 'm4a'].map(fmt => (
                                                                    <button 
                                                                        key={fmt}
                                                                        className={`btn rounded-pill px-3 py-2 text-uppercase fw-bold small transition-all ${targetFormat === fmt ? 'btn-success' : 'btn-outline-secondary'}`}
                                                                        onClick={() => setTargetFormat(fmt)}
                                                                    >
                                                                        {fmt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="col-12 mt-4">
                                                            <label className="form-label small text-muted">Audio Quality (Bitrate)</label>
                                                            <div className="d-flex gap-2">
                                                                {[
                                                                    { val: '128k', label: 'Basic' },
                                                                    { val: '192k', label: 'Standard' },
                                                                    { val: '320k', label: 'Insane' }
                                                                ].map(br => (
                                                                    <button 
                                                                        key={br.val}
                                                                        className={`btn flex-fill rounded-3 py-2 small transition-all ${bitrate === br.val ? 'btn-success' : 'btn-outline-secondary'}`}
                                                                        onClick={() => setBitrate(br.val)}
                                                                    >
                                                                        {br.label} <span className="opacity-50 ms-1">({br.val})</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="d-grid gap-2 pt-2">
                                                        <button 
                                                            className="btn btn-success btn-lg rounded-pill py-3 fw-bold shadow-lg"
                                                            onClick={convertAudio}
                                                        >
                                                            Convert Now
                                                        </button>
                                                        <button className="btn btn-link text-muted text-decoration-none" onClick={reset}>
                                                            Change File
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {status === 'converting' && (
                                                <div className="p-4 rounded-4 text-center bg-dark-soft border border-secondary-subtle">
                                                    <div className="progress mb-4 rounded-pill" style={{ height: '15px', background: 'rgba(255, 255, 255, 0.1)' }}>
                                                        <div 
                                                            className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                                                            role="progressbar" 
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <h3 className="fw-bold mb-2 text-success">{progress}%</h3>
                                                    <p className="text-muted mb-4">Transcoding to {targetFormat.toUpperCase()}... Please stay on this page.</p>
                                                    
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
                                                <div className="p-4 rounded-4 text-center bg-dark-soft border border-secondary-subtle">
                                                    <FaCheckCircle className="text-success display-4 mb-3" />
                                                    <h4 className="fw-bold mb-2">Ready to Save!</h4>
                                                    <p className="text-muted mb-4">Your audio has been successfully converted to {targetFormat.toUpperCase()}.</p>
                                                    
                                                    <div className="d-grid gap-3">
                                                        <button 
                                                            className="btn btn-success btn-lg rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center shadow-lg"
                                                            onClick={downloadAudio}
                                                        >
                                                            <FaDownload className="me-2" /> Download Converted File
                                                        </button>
                                                        <button className="btn btn-outline-secondary rounded-pill py-2" onClick={reset}>
                                                            Convert Another
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

                    {/* Feature Highlights */}
                    <div className="row g-4 mt-5">
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100">
                                <FaExchangeAlt className="text-success fs-3 mb-3" />
                                <h6 className="fw-bold">Universal Formats</h6>
                                <p className="text-muted small mb-0">Seamlessly switch between MP3, WAV, AAC, and more without any quality loss.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100">
                                <FaInfoCircle className="text-primary fs-3 mb-3" />
                                <h6 className="fw-bold">Privacy First</h6>
                                <p className="text-muted small mb-0">Your files are processed 100% locally in your browser. No uploads to any server.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100">
                                <FaSyncAlt className="text-info fs-3 mb-3" />
                                <h6 className="fw-bold">Studio Quality</h6>
                                <p className="text-muted small mb-0">Select high-bitrate settings (up to 320kbps) for professional-grade audio results.</p>
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
                    border-color: #10b981;
                    background: rgba(255, 255, 255, 0.05);
                }
                .bg-dark-soft { background: rgba(0, 0, 0, 0.2); }
                .bg-success-soft { background: rgba(16, 185, 129, 0.1); }
                .bg-danger-soft { background: rgba(239, 68, 68, 0.1); }
                .transition-all { transition: all 0.3s ease; }
                .btn-success:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(16, 185, 129, 0.3);
                }
            `}} />
        </div>
    );
};

export default AudioConverter;
