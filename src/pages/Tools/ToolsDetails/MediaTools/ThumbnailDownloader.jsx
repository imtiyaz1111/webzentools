import React, { useState } from 'react';
import { FaYoutube, FaDownload, FaSearch, FaTimes, FaImage, FaExclamationCircle, FaClipboard } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import toast from 'react-hot-toast';

const ThumbnailDownloader = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [videoId, setVideoId] = useState(null);
    const [thumbnails, setThumbnails] = useState(null);
    const [error, setError] = useState(null);

    const extractVideoId = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const handleSearch = () => {
        if (!videoUrl) {
            toast.error('Please enter a YouTube URL');
            return;
        }

        const id = extractVideoId(videoUrl);
        if (id) {
            setVideoId(id);
            setThumbnails({
                max: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
                high: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
                medium: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
                standard: `https://img.youtube.com/vi/${id}/default.jpg`
            });
            setError(null);
            toast.success('Thumbnails generated!');
        } else {
            setVideoId(null);
            setThumbnails(null);
            setError('Invalid YouTube URL. Please check and try again.');
            toast.error('Invalid URL');
        }
    };

    const downloadThumbnail = async (url, quality) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            saveAs(blob, `youtube_thumbnail_${quality}_${videoId}.jpg`);
            toast.success(`Downloading ${quality} thumbnail...`);
        } catch {
            toast.error('Failed to download image.');
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setVideoUrl(text);
            toast.success('Pasted from clipboard');
        } catch {
            toast.error('Clipboard access denied');
        }
    };

    const clearInput = () => {
        setVideoUrl('');
        setVideoId(null);
        setThumbnails(null);
        setError(null);
    };

    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Header */}
                    <div className="text-center mb-5 p-4 rounded-4" style={{ 
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                        <div className="d-inline-flex align-items-center justify-content-center mb-3" style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, #ff0000, #ff5e5e)',
                            boxShadow: '0 8px 16px rgba(255, 0, 0, 0.2)'
                        }}>
                            <FaYoutube className="text-white fs-2" />
                        </div>
                        <h2 className="fw-bold mb-2 text-dark">YouTube Thumbnail Downloader</h2>
                        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            Extract and download high-resolution thumbnails from any YouTube video. 
                            Supports Shorts, standard videos, and all available resolutions.
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className="glass-card p-4 p-md-5 rounded-4 shadow-lg mb-5 position-relative overflow-hidden">
                        <div className="position-absolute" style={{ top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255, 0, 0, 0.05) 0%, transparent 70%)', zIndex: 0 }}></div>
                        
                        <div className="position-relative" style={{ zIndex: 1 }}>
                            <div className="input-group input-group-lg bg-dark rounded-pill overflow-hidden border border-secondary-subtle shadow-sm mb-3">
                                <span className="input-group-text bg-transparent border-0 ps-4 text-muted">
                                    <FaSearch />
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent border-0 text-white shadow-none py-3" 
                                    placeholder="Paste YouTube Video URL here (e.g. https://www.youtube.com/watch?v=...)"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                {videoUrl && (
                                    <button className="btn bg-transparent border-0 text-muted" onClick={clearInput}>
                                        <FaTimes />
                                    </button>
                                )}
                                <button className="btn btn-outline-secondary border-0 px-3 d-none d-md-block" onClick={handlePaste} title="Paste from clipboard">
                                    <FaClipboard className="me-1" /> Paste
                                </button>
                                <button className="btn btn-primary px-5 fw-bold" onClick={handleSearch}>
                                    Get Thumbnails
                                </button>
                            </div>

                            {error && (
                                <div className="text-danger small mt-2 px-3 d-flex align-items-center">
                                    <FaExclamationCircle className="me-2" /> {error}
                                </div>
                            )}

                            <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                                <span className="badge bg-dark-soft text-muted border border-secondary-subtle px-3 py-2 rounded-pill small">Standard URL</span>
                                <span className="badge bg-dark-soft text-muted border border-secondary-subtle px-3 py-2 rounded-pill small">Shorts URL</span>
                                <span className="badge bg-dark-soft text-muted border border-secondary-subtle px-3 py-2 rounded-pill small">Mobile URL</span>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    {thumbnails && (
                        <div className="row g-4 mb-5">
                            <div className="col-12">
                                <h4 className="fw-bold mb-4 d-flex align-items-center">
                                    <FaImage className="text-primary me-2" /> Download Options
                                </h4>
                            </div>

                            {/* Max Resolution */}
                            <div className="col-md-12">
                                <div className="result-card p-3 rounded-4 glass-card h-100 overflow-hidden border border-secondary-subtle shadow-lg">
                                    <div className="row align-items-center">
                                        <div className="col-lg-7">
                                            <div className="thumbnail-preview rounded-3 overflow-hidden mb-3 mb-lg-0 shadow-sm">
                                                <img src={thumbnails.max} alt="Max Res" className="w-100 d-block" />
                                            </div>
                                        </div>
                                        <div className="col-lg-5 ps-lg-4">
                                            <div className="d-flex flex-column h-100">
                                                <h5 className="fw-bold mb-1">Maximum Resolution</h5>
                                                <p className="text-muted small mb-4">1280 x 720 (High Definition)</p>
                                                <div className="mt-auto">
                                                    <button 
                                                        className="btn btn-primary w-100 py-3 rounded-pill d-flex align-items-center justify-content-center shadow-lg"
                                                        onClick={() => downloadThumbnail(thumbnails.max, 'max')}
                                                    >
                                                        <FaDownload className="me-2" /> Download Max Res
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Other Qualities */}
                            <div className="col-md-4">
                                <div className="result-card p-3 rounded-4 glass-card h-100 border border-secondary-subtle shadow-sm transition-all">
                                    <div className="thumbnail-preview rounded-3 overflow-hidden mb-3 shadow-sm aspect-video">
                                        <img src={thumbnails.high} alt="High Quality" className="w-100 h-100 object-fit-cover" />
                                    </div>
                                    <h6 className="fw-bold mb-1">High Quality</h6>
                                    <p className="text-muted small mb-3">480 x 360</p>
                                    <button 
                                        className="btn btn-outline-primary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center"
                                        onClick={() => downloadThumbnail(thumbnails.high, 'high')}
                                    >
                                        <FaDownload className="me-2 small" /> Download HQ
                                    </button>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="result-card p-3 rounded-4 glass-card h-100 border border-secondary-subtle shadow-sm transition-all">
                                    <div className="thumbnail-preview rounded-3 overflow-hidden mb-3 shadow-sm aspect-video">
                                        <img src={thumbnails.medium} alt="Medium Quality" className="w-100 h-100 object-fit-cover" />
                                    </div>
                                    <h6 className="fw-bold mb-1">Medium Quality</h6>
                                    <p className="text-muted small mb-3">320 x 180</p>
                                    <button 
                                        className="btn btn-outline-primary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center"
                                        onClick={() => downloadThumbnail(thumbnails.medium, 'medium')}
                                    >
                                        <FaDownload className="me-2 small" /> Download MQ
                                    </button>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="result-card p-3 rounded-4 glass-card h-100 border border-secondary-subtle shadow-sm transition-all">
                                    <div className="thumbnail-preview rounded-3 overflow-hidden mb-3 shadow-sm aspect-video">
                                        <img src={thumbnails.standard} alt="Standard Quality" className="w-100 h-100 object-fit-cover" />
                                    </div>
                                    <h6 className="fw-bold mb-1">Standard Quality</h6>
                                    <p className="text-muted small mb-3">120 x 90</p>
                                    <button 
                                        className="btn btn-outline-primary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center"
                                        onClick={() => downloadThumbnail(thumbnails.standard, 'standard')}
                                    >
                                        <FaDownload className="me-2 small" /> Download SQ
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Section */}
                    <div className="mt-5 p-4 p-md-5 rounded-4" style={{ 
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                        <h3 className="fw-bold mb-4 text-dark">How to Download Thumbnails</h3>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <div className="d-flex mb-3">
                                    <div className="flex-shrink-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>1</div>
                                    <div className="ms-3">
                                        <h6 className="fw-bold">Copy Video URL</h6>
                                        <p className="text-muted small mb-0">Open YouTube and copy the link of the video you want the thumbnail for.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex mb-3">
                                    <div className="flex-shrink-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>2</div>
                                    <div className="ms-3">
                                        <h6 className="fw-bold">Paste the Link</h6>
                                        <p className="text-muted small mb-0">Paste the URL into the input field above and click "Get Thumbnails".</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex mb-3">
                                    <div className="flex-shrink-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>3</div>
                                    <div className="ms-3">
                                        <h6 className="fw-bold">Choose Quality</h6>
                                        <p className="text-muted small mb-0">Preview the different resolutions available and select your preferred quality.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex mb-3">
                                    <div className="flex-shrink-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>4</div>
                                    <div className="ms-3">
                                        <h6 className="fw-bold">Download Instantly</h6>
                                        <p className="text-muted small mb-0">Click the download button and the image will be saved directly to your device.</p>
                                    </div>
                                </div>
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
                .bg-dark-soft {
                    background: rgba(0, 0, 0, 0.2);
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                .result-card:hover {
                    transform: translateY(-8px);
                    border-color: rgba(37, 99, 235, 0.3) !important;
                    background: rgba(255, 255, 255, 0.08) !important;
                }
                .aspect-video {
                    aspect-ratio: 16 / 9;
                }
                .form-control::placeholder {
                    color: rgba(255, 255, 255, 0.3);
                }
                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3);
                }
            `}} />
        </div>
    );
};

export default ThumbnailDownloader;
