import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Form, Button, Spinner, Row, Col } from 'react-bootstrap';
import { 
    FaFilePdf, FaBookOpen, FaDownload, FaFileUpload, 
    FaExchangeAlt, FaCheckCircle, FaBook,
    FaLayerGroup
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const PdfToEpub = () => {
    const [file, setFile] = useState(null);
    const [isConverting, setIsConverting] = useState(false);
    const [resultEpubBlob, setResultEpubBlob] = useState(null);
    const [progress, setProgress] = useState(0);
    const [isLibLoaded, setIsLibLoaded] = useState(false);

    useEffect(() => {
        // Load JSZip from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        script.async = true;
        script.onload = () => setIsLibLoaded(true);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        if (selectedFile.type !== 'application/pdf') {
            toast.error('Please upload a PDF file.');
            return;
        }
        setFile(selectedFile);
        setResultEpubBlob(null);
        setProgress(0);
    };

    const convertToEpub = async () => {
        if (!file || !window.JSZip) return;

        setIsConverting(true);
        setProgress(0);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            
            const zip = new window.JSZip();

            // EPUB Basic Structure
            zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
            zip.folder('META-INF').file('container.xml', `<?xml version="1.0"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

            let opfManifest = '';
            let opfSpine = '';
            let ncxNav = '';

            const oebps = zip.folder('OEBPS');

            for (let i = 1; i <= numPages; i++) {
                setProgress(Math.round((i / numPages) * 100));
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');

                const xhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>Page ${i}</title></head>
<body>
  <h2>Page ${i}</h2>
  <p>${pageText || '[Empty Page]'}</p>
</body>
</html>`;

                const fileName = `page_${i}.xhtml`;
                oebps.file(fileName, xhtml);

                opfManifest += `    <item id="page${i}" href="${fileName}" media-type="application/xhtml+xml"/>\n`;
                opfSpine += `    <itemref idref="page${i}"/>\n`;
                ncxNav += `    <navPoint id="navPoint-${i}" playOrder="${i}">\n      <navLabel><text>Page ${i}</text></navLabel>\n      <content src="${fileName}"/></navPoint>\n`;
            }

            // content.opf
            oebps.file('content.opf', `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${file.name.split('.')[0]}</dc:title>
    <dc:language>en</dc:language>
    <dc:identifier id="bookid">urn:uuid:${Date.now()}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
${opfManifest}
  </manifest>
  <spine toc="ncx">
${opfSpine}
  </spine>
</package>`);

            // toc.ncx
            oebps.file('toc.ncx', `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head><meta name="dtb:uid" content="urn:uuid:12345"/><meta name="dtb:depth" content="1"/></head>
  <docTitle><text>${file.name.split('.')[0]}</text></docTitle>
  <navMap>
${ncxNav}
  </navMap>
</ncx>`);

            const blob = await zip.generateAsync({ type: 'blob' });
            setResultEpubBlob(blob);
            toast.success('EPUB conversion complete!');
        } catch (error) {
            console.error('EPUB Error:', error);
            toast.error('Failed to convert PDF to EPUB.');
        } finally {
            setIsConverting(false);
        }
    };

    const downloadEpub = () => {
        if (!resultEpubBlob) return;
        const url = URL.createObjectURL(resultEpubBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.name.split('.')[0]}.epub`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="pdf-to-epub-tool py-4">
            <style>{`
                .pdf-to-epub-tool {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .main-card {
                    background: #ffffff;
                    border-radius: 32px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    padding: 3rem;
                    text-align: center;
                }
                .upload-zone {
                    border: 2px dashed #cbd5e0;
                    border-radius: 24px;
                    padding: 4.5rem 2rem;
                    background: #f8fafc;
                    transition: all 0.3s;
                    cursor: pointer;
                    margin-bottom: 2.5rem;
                }
                .upload-zone:hover {
                    border-color: #f59e0b;
                    background: #fffbeb;
                }
                .convert-btn {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                    border: none;
                    padding: 1.2rem 3rem;
                    border-radius: 18px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    box-shadow: 0 10px 15px -3px rgba(245, 158, 11, 0.4);
                    transition: all 0.3s;
                    width: 100%;
                }
                .convert-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -5px rgba(245, 158, 11, 0.5);
                }
                .progress-container {
                    margin-top: 2rem;
                    padding: 1.5rem;
                    background: #fdf6e3;
                    border-radius: 20px;
                    border: 1px solid #f9ebbe;
                }
            `}</style>

            <div className="main-card fade-in">
                <div className="d-flex align-items-center justify-content-center gap-3 mb-5">
                    <div className="p-3 rounded-4 bg-amber-50 text-amber-600">
                        <FaBook size={32} />
                    </div>
                    <div className="text-start">
                        <h2 className="h4 fw-bold mb-1">PDF to EPUB Converter</h2>
                        <p className="text-muted mb-0 small">Convert your PDF documents into E-book (EPUB) format for Kindle and E-readers.</p>
                    </div>
                </div>

                {!isLibLoaded && (
                    <div className="alert alert-warning py-2 rounded-3 mb-4">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Initializing eBook engine...
                    </div>
                )}

                {!file ? (
                    <div className="upload-zone" onClick={() => document.getElementById('pdfInput').click()}>
                        <input type="file" id="pdfInput" hidden accept=".pdf" onChange={onFileChange} />
                        <div className="p-4 rounded-circle bg-amber-50 d-inline-block mb-4 text-amber-600">
                            <FaFileUpload size={48} />
                        </div>
                        <h4 className="fw-bold mb-2">Upload PDF Document</h4>
                        <p className="text-slate-500 mb-0">Drag and drop your document to create an eBook</p>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div className="p-4 border rounded-4 mb-4 d-flex align-items-center justify-content-between bg-light">
                            <div className="d-flex align-items-center gap-3">
                                <FaFilePdf size={32} className="text-danger" />
                                <div className="text-start">
                                    <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '300px' }}>{file.name}</div>
                                    <div className="text-muted small">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                            </div>
                            <Button variant="link" className="text-danger p-0 fw-bold" onClick={() => { setFile(null); setResultEpubBlob(null); }}>Change</Button>
                        </div>

                        {!resultEpubBlob ? (
                            <Button 
                                className="convert-btn"
                                onClick={convertToEpub}
                                disabled={isConverting || !isLibLoaded}
                            >
                                {isConverting ? <Spinner animation="border" size="sm" className="me-2" /> : <FaExchangeAlt className="me-2" />}
                                {isConverting ? `Reflowing eBook... ${progress}%` : 'Generate EPUB eBook'}
                            </Button>
                        ) : (
                            <div className="fade-in">
                                <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 mb-4 d-flex align-items-center justify-content-center gap-2 fw-bold">
                                    <FaCheckCircle /> eBook Conversion Complete!
                                </div>
                                <div className="d-flex gap-3">
                                    <Button variant="outline-secondary" className="flex-grow-1 py-3 rounded-4" onClick={() => { setFile(null); setResultEpubBlob(null); }}>
                                        Convert Another
                                    </Button>
                                    <Button variant="success" className="convert-btn flex-grow-1" onClick={downloadEpub}>
                                        <FaDownload className="me-2" /> Download EPUB File
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isConverting && (
                            <div className="progress-container fade-in mt-4 text-start">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small fw-bold text-amber-800">Processing Page {Math.ceil((progress/100) * 10)}...</span>
                                    <span className="small fw-bold text-amber-600">{progress}%</span>
                                </div>
                                <div className="progress rounded-pill" style={{ height: '10px' }}>
                                    <div 
                                        className="progress-bar progress-bar-striped progress-bar-animated bg-warning" 
                                        role="progressbar" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-5 row g-4">
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-amber-600">
                            <FaBookOpen /> Reflowable Layout
                        </div>
                        <p className="text-muted small mb-0">Unlike PDF, EPUB allows the text to reflow and adapt to different screen sizes, making it perfect for Kindle and iPad.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-amber-600">
                            <FaLayerGroup /> Navigation Support
                        </div>
                        <p className="text-muted small mb-0">Our converter automatically generates a Table of Contents (NCX) to help you navigate through pages easily on your e-reader.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="p-4 bg-white rounded-4 border shadow-sm h-100">
                        <div className="h5 fw-bold mb-3 d-flex align-items-center gap-2 text-amber-600">
                            <FaCheckCircle /> eBook Compliant
                        </div>
                        <p className="text-muted small mb-0">Generates industry-standard EPUB structure that is compatible with iBooks, Adobe Digital Editions, and various e-reader apps.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfToEpub;
