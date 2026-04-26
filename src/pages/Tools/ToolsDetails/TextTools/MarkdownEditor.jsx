import React, { useState, useMemo } from 'react';
import { Form, Row, Col, Button, ButtonGroup, Toast, ToastContainer } from 'react-bootstrap';
import { 
    FaBold, FaItalic, FaHeading, FaQuoteLeft, FaLink, 
    FaCode, FaListUl, FaEye, FaEdit, FaDownload, 
    FaCopy, FaTrash, FaCheck 
} from 'react-icons/fa';

const MarkdownEditor = () => {
    const [markdown, setMarkdown] = useState('# Hello Markdown\n\nType your content here and see the magic on the right!');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const parseMarkdown = (md) => {
        let html = md
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^\> (.*$)/gim, '<blockquote class="border-start border-4 ps-3 text-muted">$1</blockquote>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/`(.*?)`/gim, '<code class="bg-light p-1 rounded">$1</code>')
            .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank'>$1</a>")
            .replace(/^\* (.*$)/gim, '<ul><li>$1</li></ul>')
            .replace(/<\/ul>\n<ul>/gim, '')
            .replace(/\n$/gim, '<br />')
            .replace(/\n/gim, '<br />');
        return html;
    };

    const previewHtml = useMemo(() => parseMarkdown(markdown), [markdown]);

    const insertText = (before, after = '') => {
        const textarea = document.getElementById('md-textarea');
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = markdown.substring(start, end);
        const newText = markdown.substring(0, start) + before + selectedText + after + markdown.substring(end);
        setMarkdown(newText);
        textarea.focus();
    };

    const handleCopy = (content, type) => {
        navigator.clipboard.writeText(content);
        setToastMsg(`Copied ${type} to clipboard!`);
        setShowToast(true);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([markdown], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "document.md";
        document.body.appendChild(element);
        element.click();
        setToastMsg('File downloaded!');
        setShowToast(true);
    };

    return (
        <div className="markdown-editor-tool">
            <div className="toolbar p-2 glass-card rounded-4 mb-3 border d-flex flex-wrap gap-2">
                <ButtonGroup size="sm">
                    <Button variant="light" onClick={() => insertText('# ')} title="Heading 1"><FaHeading size={12} />1</Button>
                    <Button variant="light" onClick={() => insertText('## ')} title="Heading 2"><FaHeading size={12} />2</Button>
                </ButtonGroup>
                <ButtonGroup size="sm">
                    <Button variant="light" onClick={() => insertText('**', '**')} title="Bold"><FaBold /></Button>
                    <Button variant="light" onClick={() => insertText('*', '*')} title="Italic"><FaItalic /></Button>
                </ButtonGroup>
                <ButtonGroup size="sm">
                    <Button variant="light" onClick={() => insertText('> ')} title="Quote"><FaQuoteLeft /></Button>
                    <Button variant="light" onClick={() => insertText('[Link Text](https://example.com)')} title="Link"><FaLink /></Button>
                    <Button variant="light" onClick={() => insertText('`', '`')} title="Code"><FaCode /></Button>
                    <Button variant="light" onClick={() => insertText('* ')} title="Unordered List"><FaListUl /></Button>
                </ButtonGroup>
                <div className="ms-auto d-flex gap-2">
                    <Button variant="outline-danger" size="sm" onClick={() => setMarkdown('')}><FaTrash /> Clear</Button>
                </div>
            </div>

            <Row className="g-4">
                <Col lg={6}>
                    <div className="editor-container h-100">
                        <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                            <span className="small fw-bold text-muted uppercase"><FaEdit className="me-1" /> Markdown Editor</span>
                            <span className="small text-muted">{markdown.length} Characters</span>
                        </div>
                        <Form.Control 
                            id="md-textarea"
                            as="textarea" 
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className="border shadow-sm rounded-4 p-4 font-monospace"
                            style={{ height: '500px', fontSize: '0.95rem', resize: 'none' }}
                        />
                    </div>
                </Col>
                <Col lg={6}>
                    <div className="preview-container h-100 d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-2 px-2">
                            <span className="small fw-bold text-muted uppercase"><FaEye className="me-1" /> Real-time Preview</span>
                            <div className="d-flex gap-2">
                                <Button variant="link" className="text-primary p-0 small text-decoration-none" onClick={() => handleCopy(markdown, 'Markdown')}>Copy MD</Button>
                                <Button variant="link" className="text-success p-0 small text-decoration-none" onClick={() => handleCopy(previewHtml, 'HTML')}>Copy HTML</Button>
                            </div>
                        </div>
                        <div 
                            className="preview-area border rounded-4 p-4 bg-white shadow-sm overflow-auto"
                            style={{ height: '500px' }}
                            dangerouslySetInnerHTML={{ __html: previewHtml }}
                        />
                    </div>
                </Col>
            </Row>

            <div className="d-flex gap-3 justify-content-center mt-4">
                <Button variant="primary" className="rounded-pill px-5 py-2 fw-bold d-flex align-items-center" onClick={handleDownload}>
                    <FaDownload className="me-2" /> Download Markdown (.md)
                </Button>
            </div>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">About the Markdown Editor</h3>
                <p className="text-muted">
                    Markdown is a lightweight markup language with plain-text-formatting syntax. It is widely used by developers, content creators, and technical writers 
                    to format documents, readmes, and blog posts. Our premium editor provides a live side-by-side preview, making it easy to see your formatting changes instantly.
                </p>
                <div className="row g-4 mt-2">
                    <div className="col-md-4">
                        <div className="p-3 bg-light rounded-3 h-100">
                            <h6 className="fw-bold"><FaCheck className="text-success me-2" /> Lightweight</h6>
                            <p className="small text-muted mb-0">No external libraries required. Fast, secure, and client-side processing.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 bg-light rounded-3 h-100">
                            <h6 className="fw-bold"><FaCheck className="text-success me-2" /> Formatting Tools</h6>
                            <p className="small text-muted mb-0">Includes a full toolbar for common styles like bold, italic, and lists.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3 bg-light rounded-3 h-100">
                            <h6 className="fw-bold"><FaCheck className="text-success me-2" /> Export Options</h6>
                            <p className="small text-muted mb-0">Copy your formatted HTML or download the raw Markdown file.</p>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer position="bottom-end" className="p-3">
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide className="bg-dark text-white">
                    <Toast.Body className="d-flex align-items-center">
                        <FaCheck className="text-success me-2" /> {toastMsg}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            <style>{`
                .preview-area h1 { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; color: #0f172a; }
                .preview-area h2 { font-size: 1.5rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1e293b; }
                .preview-area h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; }
                .preview-area p { margin-bottom: 1rem; line-height: 1.6; color: #334155; }
                .preview-area blockquote { border-left: 4px solid #e2e8f0; padding-left: 1rem; font-style: italic; color: #64748b; margin: 1.5rem 0; }
                .preview-area ul { margin-bottom: 1rem; padding-left: 1.5rem; }
                .preview-area a { color: #2563eb; text-decoration: none; }
                .preview-area a:hover { text-decoration: underline; }
            `}</style>
        </div>
    );
};

export default MarkdownEditor;
