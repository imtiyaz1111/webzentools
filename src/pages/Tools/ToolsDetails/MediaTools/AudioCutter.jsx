import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import { FaMusic, FaCut, FaCloudUploadAlt, FaDownload, FaPlay, FaPause, FaStop, FaSyncAlt, FaExclamationTriangle, FaCheckCircle, FaStepForward, FaStepBackward } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

const AudioCutter = () => {
    const [ffmpeg, setFfmpeg] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, loading, processing, finished, error
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [region, setRegion] = useState({ start: 0, end: 0 });
    const [outputUrl, setOutputUrl] = useState(null);

    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadFFmpeg();
        return () => {
            if (wavesurfer.current) wavesurfer.current.destroy();
        };
    }, []);

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
            
            ffmpegInstance.on('log', () => {
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
            toast.error('Failed to load audio engine.');
        }
    };

    const initWaveSurfer = (file) => {
        if (wavesurfer.current) wavesurfer.current.destroy();

        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: '#3b82f6',
            progressColor: '#60a5fa',
            cursorColor: '#ffffff',
            barWidth: 2,
            barRadius: 3,
            responsive: true,
            height: 120,
            normalize: true,
            plugins: [RegionsPlugin.create()]
        });

        const wsRegions = wavesurfer.current.registerPlugin(RegionsPlugin.create());

        wavesurfer.current.loadBlob(file);

        wavesurfer.current.on('ready', () => {
            const dur = wavesurfer.current.getDuration();
            setDuration(dur);
            
            // Create initial region (first 30% of audio)
            const start = 0;
            const end = Math.min(dur, dur * 0.3);
            
            wsRegions.addRegion({
                start,
                end,
                color: 'rgba(59, 130, 246, 0.2)',
                drag: true,
                resize: true,
            });

            setRegion({ start, end });
        });

        wavesurfer.current.on('audioprocess', () => {
            setCurrentTime(wavesurfer.current.getCurrentTime());
        });

        wavesurfer.current.on('play', () => setIsPlaying(true));
        wavesurfer.current.on('pause', () => setIsPlaying(false));

        wsRegions.on('region-updated', (region) => {
            setRegion({ start: region.start, end: region.end });
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('audio/')) {
                toast.error('Please select a valid audio file.');
                return;
            }
            setAudioFile(file);
            setOutputUrl(null);
            setStatus('idle');
            initWaveSurfer(file);
        }
    };

    const cutAudio = async () => {
        if (!audioFile || !ffmpeg) return;

        try {
            setStatus('processing');
            setProgress(0);

            const inputName = 'input' + audioFile.name.substring(audioFile.name.lastIndexOf('.'));
            const outputName = 'output' + audioFile.name.substring(audioFile.name.lastIndexOf('.'));

            await ffmpeg.writeFile(inputName, await fetchFile(audioFile));

            const start = region.start.toFixed(3);
            const duration = (region.end - region.start).toFixed(3);

            // FFmpeg command:
            // -ss: start time
            // -t: duration
            // -c copy: stream copy (no re-encoding, extremely fast and lossless)
            await ffmpeg.exec([
                '-ss', start,
                '-i', inputName,
                '-t', duration,
                '-c', 'copy',
                outputName
            ]);

            const data = await ffmpeg.readFile(outputName);
            const blob = new Blob([data.buffer], { type: audioFile.type });
            const url = URL.createObjectURL(blob);
            
            setOutputUrl(url);
            setStatus('finished');
            toast.success('Audio trimmed successfully!');
        } catch (error) {
            console.error('Trimming error:', error);
            setStatus('error');
            toast.error('An error occurred during trimming.');
        } finally {
            // Processing done
        }
    };

    const togglePlay = () => {
        if (wavesurfer.current) wavesurfer.current.playPause();
    };

    const stopPlay = () => {
        if (wavesurfer.current) {
            wavesurfer.current.stop();
            setIsPlaying(false);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        const milliseconds = Math.floor((time % 1) * 100);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    };

    const downloadAudio = () => {
        if (outputUrl) {
            saveAs(outputUrl, `trimmed_${audioFile.name}`);
        }
    };

    const reset = () => {
        setAudioFile(null);
        if (wavesurfer.current) wavesurfer.current.destroy();
        setOutputUrl(null);
        setProgress(0);
        setStatus('idle');
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
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                            boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
                        }}>
                            <FaMusic className="text-white fs-3" />
                        </div>
                        <h2 className="fw-bold mb-2">Professional Audio Cutter</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Trim and cut your audio files with frame-perfect precision. 
                            Interactive waveform visualization, all inside your browser.
                        </p>
                    </div>

                    {!loaded && status === 'loading' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm glass-card border-dashed">
                            <div className="spinner-border text-primary mb-3" role="status"></div>
                            <h4 className="fw-semibold">Loading Audio Engine...</h4>
                            <p className="text-muted">Preparing visualizers and processors.</p>
                        </div>
                    ) : status === 'error' ? (
                        <div className="text-center py-5 rounded-4 shadow-sm bg-danger-soft border-danger">
                            <FaExclamationTriangle className="text-danger fs-1 mb-3" />
                            <h4 className="fw-semibold text-danger">Engine Error</h4>
                            <p className="text-muted mb-4">We couldn't initialize the audio processor. Please refresh the page.</p>
                            <button className="btn btn-primary rounded-pill px-4" onClick={loadFFmpeg}>
                                <FaSyncAlt className="me-2" /> Retry
                            </button>
                        </div>
                    ) : (
                        <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg overflow-hidden position-relative">
                            <div className="position-absolute" style={{ bottom: '-50px', right: '-50px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
                            
                            <div className="position-relative" style={{ zIndex: 1 }}>
                                {!audioFile ? (
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
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="d-none" />
                                        <FaCloudUploadAlt className="fs-1 text-primary mb-3" />
                                        <h4 className="fw-bold">Upload Audio to Trim</h4>
                                        <p className="text-muted">MP3, WAV, OGG, AAC supported</p>
                                    </div>
                                ) : (
                                    <div className="audio-editor-container">
                                        <div className="waveform-wrapper mb-4 p-3 rounded-4 bg-dark-soft border border-secondary-subtle">
                                            <div ref={waveformRef} className="w-100"></div>
                                            <div className="d-flex justify-content-between mt-2 small text-muted font-monospace">
                                                <span>00:00.00</span>
                                                <span className="text-primary fw-bold">{formatTime(currentTime)}</span>
                                                <span>{formatTime(duration)}</span>
                                            </div>
                                        </div>

                                        <div className="row g-4 align-items-center">
                                            <div className="col-md-6">
                                                <div className="d-flex gap-2 justify-content-center justify-content-md-start">
                                                    <button className="btn btn-outline-light rounded-circle shadow-none p-3" onClick={() => wavesurfer.current?.skip(-5)}>
                                                        <FaStepBackward />
                                                    </button>
                                                    <button className="btn btn-primary rounded-circle shadow-lg p-3 px-4 fs-4" onClick={togglePlay}>
                                                        {isPlaying ? <FaPause /> : <FaPlay />}
                                                    </button>
                                                    <button className="btn btn-outline-light rounded-circle shadow-none p-3" onClick={stopPlay}>
                                                        <FaStop />
                                                    </button>
                                                    <button className="btn btn-outline-light rounded-circle shadow-none p-3" onClick={() => wavesurfer.current?.skip(5)}>
                                                        <FaStepForward />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="p-3 rounded-3 bg-dark-soft border border-secondary-subtle d-flex justify-content-around">
                                                    <div className="text-center">
                                                        <div className="small text-muted mb-1">Start</div>
                                                        <div className="fw-bold text-primary font-monospace">{formatTime(region.start)}</div>
                                                    </div>
                                                    <div className="border-end border-secondary-subtle"></div>
                                                    <div className="text-center">
                                                        <div className="small text-muted mb-1">End</div>
                                                        <div className="fw-bold text-primary font-monospace">{formatTime(region.end)}</div>
                                                    </div>
                                                    <div className="border-end border-secondary-subtle"></div>
                                                    <div className="text-center">
                                                        <div className="small text-muted mb-1">Duration</div>
                                                        <div className="fw-bold text-success font-monospace">{formatTime(region.end - region.start)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <hr className="my-5 border-secondary-subtle" />

                                        <div className="text-center">
                                                    <button 
                                                        className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg"
                                                        onClick={cutAudio}
                                                    >
                                                        <FaCut className="me-2" /> Cut Audio
                                                    </button>
                                                    <button className="btn btn-outline-secondary btn-lg rounded-pill px-4" onClick={reset}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}

                                            {status === 'processing' && (
                                                <div className="max-width-500 mx-auto">
                                                    <div className="progress mb-4 rounded-pill" style={{ height: '15px', background: 'rgba(255, 255, 255, 0.1)' }}>
                                                        <div 
                                                            className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                                                            role="progressbar" 
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                    <h3 className="fw-bold mb-2">{progress}%</h3>
                                                    <p className="text-muted">Extracting audio segment... Hold on.</p>
                                                </div>
                                            )}

                                            {status === 'finished' && (
                                                <div className="max-width-500 mx-auto">
                                                    <div className="p-4 rounded-4 text-center mb-4" style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                                        <FaCheckCircle className="text-success display-4 mb-3" />
                                                        <h4 className="fw-bold mb-2 text-white">Cut Complete!</h4>
                                                        <p className="text-muted">Your audio clip is ready for download.</p>
                                                    </div>
                                                    <div className="d-grid gap-3">
                                                        <button 
                                                            className="btn btn-success btn-lg rounded-pill py-3 fw-bold d-flex align-items-center justify-content-center shadow-lg"
                                                            onClick={downloadAudio}
                                                        >
                                                            <FaDownload className="me-2" /> Download Trimmed Audio
                                                        </button>
                                                        <button className="btn btn-outline-secondary rounded-pill py-2" onClick={reset}>
                                                            Trim Another Clip
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

                    {/* Features */}
                    <div className="row g-4 mt-5">
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100 text-center">
                                <FaCut className="text-primary fs-3 mb-3" />
                                <h6 className="fw-bold text-white">Precise Cutting</h6>
                                <p className="text-muted small">Frame-perfect selection using our advanced waveform visualizer.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100 text-center">
                                <FaSyncAlt className="text-success fs-3 mb-3" />
                                <h6 className="fw-bold text-white">Zero Quality Loss</h6>
                                <p className="text-muted small">We use stream-copy technology to ensure your audio quality remains 100% original.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 rounded-4 glass-card h-100 text-center">
                                <FaPlay className="text-info fs-3 mb-3" />
                                <h6 className="fw-bold text-white">Real-time Preview</h6>
                                <p className="text-muted small">Listen to your selected region before you cut to ensure the perfect timing.</p>
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
                .bg-danger-soft { background: rgba(239, 68, 68, 0.1); }
                .max-width-500 { max-width: 500px; }
            `}} />
        </div>
    );
};

export default AudioCutter;
