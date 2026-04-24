import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { FaCircle, FaStop, FaVideo, FaMicrophone, FaMicrophoneSlash, FaDownload, FaSyncAlt, FaExclamationTriangle, FaCheckCircle, FaTrash, FaDesktop } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

const ScreenRecorder = () => {
    const [ffmpeg, setFfmpeg] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingBlob, setRecordingBlob] = useState(null);
    const [recordingUrl, setRecordingUrl] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, recording, paused, finished, error, converting
    const [timer, setTimer] = useState(0);
    const [includeMic, setIncludeMic] = useState(true);
    
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const timerIntervalRef = useRef(null);
    const videoPreviewRef = useRef(null);

    useEffect(() => {
        loadFFmpeg();
        return () => {
            stopStream();
            clearInterval(timerIntervalRef.current);
            if (recordingUrl) URL.revokeObjectURL(recordingUrl);
        };
    }, []);

    const loadFFmpeg = async () => {
        try {
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
            const ffmpegInstance = new FFmpeg();
            
            ffmpegInstance.on('progress', ({ progress }) => {
                setProgress(Math.round(progress * 100));
            });

            await ffmpegInstance.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });

            setFfmpeg(ffmpegInstance);
            setLoaded(true);
        } catch (error) {
            console.error('FFmpeg load error:', error);
            // FFmpeg is optional for the core recorder but good for MP4
        }
    };

    const startStream = async () => {
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { cursor: "always" },
                audio: true // System audio
            });

            let finalStream = displayStream;

            if (includeMic) {
                try {
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const tracks = [...displayStream.getTracks(), ...audioStream.getAudioTracks()];
                    finalStream = new MediaStream(tracks);
                } catch (micError) {
                    console.warn("Microphone access denied:", micError);
                    toast.error("Microphone access denied. Recording system audio only.");
                }
            }

            streamRef.current = finalStream;
            if (videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = finalStream;
            }

            // Stop recording when screen share is stopped via browser UI
            displayStream.getVideoTracks()[0].onended = () => {
                stopRecording();
            };

            return true;
        } catch (error) {
            console.error("Error starting stream:", error);
            toast.error("Failed to access screen capture.");
            return false;
        }
    };

    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const startRecording = async () => {
        const success = await startStream();
        if (!success) return;

        chunksRef.current = [];
        const recorder = new MediaRecorder(streamRef.current, {
            mimeType: 'video/webm;codecs=vp9,opus'
        });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            setRecordingBlob(blob);
            setRecordingUrl(URL.createObjectURL(blob));
            setStatus('finished');
            stopStream();
        };

        recorder.start(1000); // Collect data every second
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        setStatus('recording');
        setTimer(0);
        timerIntervalRef.current = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        toast.success("Recording started!");
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        clearInterval(timerIntervalRef.current);
    };

    const convertToMp4 = async () => {
        if (!recordingBlob || !ffmpeg) {
            toast.error("FFmpeg not loaded yet.");
            return;
        }

        try {
            setIsConverting(true);
            setStatus('converting');
            setProgress(0);

            const inputName = 'input.webm';
            const outputName = 'output.mp4';

            await ffmpeg.writeFile(inputName, await fetchFile(recordingBlob));

            await ffmpeg.exec(['-i', inputName, '-c:v', 'copy', '-c:a', 'aac', outputName]);

            const data = await ffmpeg.readFile(outputName);
            const blob = new Blob([data.buffer], { type: 'video/mp4' });
            saveAs(blob, `recording_${new Date().getTime()}.mp4`);
            
            toast.success("Converted to MP4 and downloaded!");
            setStatus('finished');
        } catch (error) {
            console.error("Conversion error:", error);
            toast.error("Failed to convert to MP4. Downloading WebM instead.");
            downloadWebM();
        } finally {
            setIsConverting(false);
        }
    };

    const downloadWebM = () => {
        if (recordingUrl) {
            saveAs(recordingUrl, `recording_${new Date().getTime()}.webm`);
        }
    };

    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const reset = () => {
        setRecordingBlob(null);
        if (recordingUrl) URL.revokeObjectURL(recordingUrl);
        setRecordingUrl(null);
        setStatus('idle');
        setTimer(0);
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
                            background: 'linear-gradient(135deg, #ef4444, #f87171)',
                            boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)'
                        }}>
                            <FaVideo className="text-white fs-3" />
                        </div>
                        <h2 className="fw-bold mb-2">Pro Screen Recorder</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Capture your entire screen, specific windows, or browser tabs. 
                            Professional quality with audio support, no installation required.
                        </p>
                    </div>

                    <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg overflow-hidden position-relative">
                        <div className="position-absolute" style={{ top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.08) 0%, transparent 70%)', zIndex: 0 }}></div>
                        
                        <div className="position-relative" style={{ zIndex: 1 }}>
                            {status === 'idle' || status === 'recording' ? (
                                <div className="recorder-main">
                                    <div className="preview-container mb-4 rounded-4 overflow-hidden bg-black border border-secondary-subtle shadow-lg position-relative" style={{ aspectRatio: '16/9', minHeight: '300px' }}>
                                        <video 
                                            ref={videoPreviewRef} 
                                            autoPlay 
                                            muted 
                                            className="w-100 h-100 object-fit-contain"
                                        />
                                        
                                        {!isRecording && status === 'idle' && (
                                            <div className="position-absolute top-50 left-50 translate-middle text-center w-100 px-4">
                                                <FaDesktop className="display-1 text-secondary mb-4 opacity-25" />
                                                <h4 className="text-muted fw-bold">Ready to record?</h4>
                                                <p className="text-muted small">Choose what to capture after clicking start.</p>
                                            </div>
                                        )}

                                        {isRecording && (
                                            <div className="position-absolute top-0 start-0 p-3 w-100 d-flex justify-content-between align-items-center bg-gradient-dark">
                                                <div className="badge bg-danger rounded-pill px-3 py-2 d-flex align-items-center animate-pulse">
                                                    <FaCircle className="me-2 small" /> LIVE
                                                </div>
                                                <div className="text-white fw-bold font-monospace fs-4" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                                    {formatTimer(timer)}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 p-4 rounded-4 bg-dark-soft border border-secondary-subtle">
                                        <div className="d-flex align-items-center gap-3">
                                            <button 
                                                className={`btn rounded-pill px-3 py-2 border border-secondary-subtle transition-all ${includeMic ? 'bg-primary-soft text-primary' : 'bg-transparent text-muted'}`}
                                                onClick={() => setIncludeMic(!includeMic)}
                                                disabled={isRecording}
                                            >
                                                {includeMic ? <FaMicrophone /> : <FaMicrophoneSlash />} <span className="ms-1 small fw-bold">Microphone</span>
                                            </button>
                                        </div>

                                        <div className="vr d-none d-md-block opacity-25" style={{ height: '40px' }}></div>

                                        <div className="controls">
                                            {!isRecording ? (
                                                <button 
                                                    className="btn btn-danger btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center"
                                                    onClick={startRecording}
                                                >
                                                    <FaCircle className="me-2 small" /> Start Recording
                                                </button>
                                            ) : (
                                                <button 
                                                    className="btn btn-white btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg d-flex align-items-center"
                                                    onClick={stopRecording}
                                                    style={{ backgroundColor: '#fff', color: '#000' }}
                                                >
                                                    <FaStop className="me-2" /> Stop Recording
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : status === 'finished' || status === 'converting' ? (
                                <div className="result-view text-center animate-fade-in">
                                    <div className="mb-4 rounded-4 overflow-hidden bg-black border border-secondary-subtle shadow-lg mx-auto" style={{ maxWidth: '700px', aspectRatio: '16/9' }}>
                                        <video 
                                            src={recordingUrl} 
                                            controls 
                                            className="w-100 h-100 object-fit-contain"
                                        />
                                    </div>
                                    
                                    <div className="max-width-500 mx-auto">
                                        <h3 className="fw-bold mb-2">Recording Captured!</h3>
                                        <p className="text-muted mb-4">You can download your recording as a WebM file or convert it to MP4.</p>
                                        
                                        {status === 'converting' ? (
                                            <div className="p-4 mb-4 rounded-4 bg-dark-soft">
                                                <div className="progress mb-3 rounded-pill" style={{ height: '10px' }}>
                                                    <div className="progress-bar bg-primary" style={{ width: `${progress}%` }}></div>
                                                </div>
                                                <span className="small text-primary fw-bold">Converting: {progress}%</span>
                                            </div>
                                        ) : (
                                            <div className="row g-3 mb-4">
                                                <div className="col-md-6">
                                                    <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold" onClick={downloadWebM}>
                                                        <FaDownload className="me-2" /> Download WebM
                                                    </button>
                                                </div>
                                                <div className="col-md-6">
                                                    <button className="btn btn-success w-100 py-3 rounded-pill fw-bold" onClick={convertToMp4} disabled={!loaded}>
                                                        <FaSyncAlt className={`me-2 ${isConverting ? 'fa-spin' : ''}`} /> Export MP4
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <button className="btn btn-outline-secondary rounded-pill px-4" onClick={reset}>
                                            <FaTrash className="me-2" /> Discard & New Recording
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Info Panels */}
                    <div className="row g-4 mt-5">
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100 text-center">
                                <div className="feature-icon mb-3 text-danger fs-3"><FaDesktop /></div>
                                <h6 className="fw-bold">No Limits</h6>
                                <p className="text-muted small mb-0">Record for as long as you need. No watermarks, no time limits, and no subscriptions.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100 text-center">
                                <div className="feature-icon mb-3 text-primary fs-3"><FaMicrophone /></div>
                                <h6 className="fw-bold">Audio Support</h6>
                                <p className="text-muted small mb-0">Capture high-quality audio from your microphone and system sounds simultaneously.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100 text-center">
                                <div className="feature-icon mb-3 text-success fs-3"><FaSyncAlt /></div>
                                <h6 className="fw-bold">Fast Export</h6>
                                <p className="text-muted small mb-0">Instantly download your recordings in WebM format or export as MP4 for universal sharing.</p>
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
                .drop-zone {
                    border: 2px dashed rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.02);
                }
                .bg-dark-soft { background: rgba(0, 0, 0, 0.2); }
                .bg-primary-soft { background: rgba(59, 130, 246, 0.1); }
                .animate-pulse {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.6; }
                    100% { opacity: 1; }
                }
                .max-width-500 { max-width: 500px; }
                .bg-gradient-dark {
                    background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
                }
                .transition-all { transition: all 0.3s ease; }
            `}} />
        </div>
    );
};

export default ScreenRecorder;
