import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, ButtonGroup, Badge, Card, Dropdown } from 'react-bootstrap';
import { 
    FaEdit, FaEye, FaDownload, FaCopy, FaTrash, 
    FaBold, FaItalic, FaHeading, FaQuoteLeft, FaLink, 
    FaCode, FaListUl, FaListOl, FaImage, FaTerminal,
    FaFileExport, FaMagic, FaCheckCircle
} from 'react-icons/fa';
import { marked } from 'marked';
import SEO from '../../../../components/SEO';
import "./MarkdownEditor.css";

const defaultMarkdown = `# 🚀 Webzen Markdown Studio
## Premium Live Preview Editor

Welcome to the most powerful online Markdown editor! 

### Features:
- **Real-time Rendering** with GitHub Flavored Markdown support.
- **Interactive Toolbar** for fast formatting.
- **Syntax Highlighting** for code blocks.
- **Instant Export** to .md or HTML.

> "Markdown is a text-to-HTML conversion tool for web writers." - John Gruber

---

### Code Example:
\`\`\`javascript
function welcome() {
  console.log("Hello, WebzenTools!");
}
\`\`\`

### Checklist:
- [x] Write Markdown
- [x] Preview in Real-time
- [x] Export your work

Built with ❤️ by **WebzenTools**.`;

const MarkdownEditor = () => {
    const [markdown, setMarkdown] = useState(defaultMarkdown);
    const [html, setHtml] = useState('');
    const [copySuccess, setCopySuccess] = useState('');
    const [stats, setStats] = useState({ words: 0, lines: 0 });

    useEffect(() => {
        // Configure marked options
        marked.setOptions({
            breaks: true,
            gfm: true
        });
        setHtml(marked.parse(markdown));
        
        // Calculate stats
        const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
        const lines = markdown.split('\n').length;
        setStats({ words, lines });
    }, [markdown]);

    const handleCopy = (content, type) => {
        navigator.clipboard.writeText(content);
        setCopySuccess(`${type} Copied!`);
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'webzentools-document.md';
        a.click();
        URL.revokeObjectURL(url);
    };

    const insertText = (prefix, suffix = '') => {
        const textarea = document.getElementById('wt-md-textarea');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = markdown.substring(start, end);
        const newText = markdown.substring(0, start) + prefix + selectedText + suffix + markdown.substring(end);
        setMarkdown(newText);
        
        // Reset selection (slight delay to let React update)
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 10);
    };

    return (
        <div className="wt-markdown-page">
            <SEO 
                title="Markdown Live Editor - Free Online Markdown Tool | WebzenTools"
                description="Write and preview Markdown in real-time with our free premium editor. Features live HTML rendering, markdown export, and easy formatting tools."
                keywords="markdown editor, online markdown editor, free markdown tool, live markdown preview, markdown to html"
                url="https://www.webzentools.com/tools/markdown-editor"
            />

            <Container fluid className="wt-editor-container p-0">
                {/* Premium Toolbar */}
                <div className="wt-editor-toolbar d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white shadow-sm">
                    <div className="d-flex align-items-center gap-3">
                        <div className="wt-editor-logo">
                            <FaTerminal className="text-primary" size={24} />
                            <span className="ms-2 fw-bold text-dark d-none d-md-inline">Markdown Studio</span>
                        </div>
                        <ButtonGroup className="d-none d-lg-flex">
                            <Button variant="light" size="sm" onClick={() => insertText('# ')} title="Heading"><FaHeading size={12} /></Button>
                            <Button variant="light" size="sm" onClick={() => insertText('**', '**')} title="Bold"><FaBold size={12} /></Button>
                            <Button variant="light" size="sm" onClick={() => insertText('*', '*')} title="Italic"><FaItalic size={12} /></Button>
                            <Button variant="light" size="sm" onClick={() => insertText('> ')} title="Quote"><FaQuoteLeft size={12} /></Button>
                            <Button variant="light" size="sm" onClick={() => insertText('`', '`')} title="Code"><FaCode size={12} /></Button>
                            <Button variant="light" size="sm" onClick={() => insertText('* ')} title="Unordered List"><FaListUl size={12} /></Button>
                            <Button variant="light" size="sm" onClick={() => insertText('1. ')} title="Ordered List"><FaListOl size={12} /></Button>
                            <Button variant="light" size="sm" onClick={() => insertText('[Link](', ')')} title="Link"><FaLink size={12} /></Button>
                            <Button variant="light" size="sm" onClick={() => insertText('![Alt](', ')')} title="Image"><FaImage size={12} /></Button>
                        </ButtonGroup>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                        <Button variant="outline-danger" size="sm" onClick={() => setMarkdown('')} className="d-none d-md-block">
                            <FaTrash />
                        </Button>
                        <Button variant="outline-primary" size="sm" onClick={() => handleCopy(markdown, 'Markdown')} className="d-flex align-items-center gap-2">
                            <FaCopy /> <span className="d-none d-lg-inline">Copy MD</span>
                        </Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" size="sm" className="d-flex align-items-center gap-2 shadow-sm">
                                <FaFileExport /> <span className="d-none d-md-inline">Export</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end" className="shadow-lg border-0 rounded-4 mt-2">
                                <Dropdown.Item onClick={handleDownload} className="py-2 d-flex align-items-center gap-2">
                                    <FaTerminal className="text-primary" /> Download as .md
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleCopy(html, 'HTML')} className="py-2 d-flex align-items-center gap-2">
                                    <FaCode className="text-success" /> Copy as HTML
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>

                {/* Main Workspace */}
                <div className="wt-editor-workspace">
                    <Row className="g-0 h-100">
                        {/* Editor Side */}
                        <Col lg={6} className="wt-editor-pane border-end position-relative">
                            <div className="wt-pane-header bg-light px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                                    <FaEdit className="text-primary" /> EDITOR
                                </div>
                                <div className="d-flex gap-3 small text-muted opacity-75">
                                    <span>{stats.words} Words</span>
                                    <span>{stats.lines} Lines</span>
                                </div>
                            </div>
                            <textarea 
                                id="wt-md-textarea"
                                spellCheck="false"
                                className="wt-md-textarea"
                                value={markdown}
                                onChange={(e) => setMarkdown(e.target.value)}
                                placeholder="Write your markdown here..."
                            />
                            {copySuccess && <div className="wt-md-toast">{copySuccess}</div>}
                        </Col>

                        {/* Preview Side */}
                        <Col lg={6} className="wt-preview-pane bg-white d-flex flex-column">
                            <div className="wt-pane-header bg-light px-3 py-2 border-bottom d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2 small fw-bold text-muted">
                                    <FaEye className="text-success" /> LIVE PREVIEW
                                </div>
                            </div>
                            <div 
                                className="wt-md-preview-content flex-grow-1 p-4 overflow-auto"
                                dangerouslySetInnerHTML={{ __html: html }}
                            />
                        </Col>
                    </Row>
                </div>
            </Container>

            {/* Info Section */}
            <section className="wt-md-info py-5 bg-white border-top">
                <Container>
                    <Row className="justify-content-center text-center mb-5">
                        <Col lg={8}>
                            <h2 className="display-6 fw-bold">The Modern <span className="text-primary">Markdown Tool</span></h2>
                            <p className="lead text-muted">A professional environment for writers and developers to create beautiful documentation instantly.</p>
                        </Col>
                    </Row>

                    <Row className="g-4">
                        <Col md={4}>
                            <Card className="wt-feature-card h-100 border-0 shadow-sm rounded-4 text-center p-4">
                                <div className="feature-icon bg-primary-subtle text-primary mb-3">
                                    <FaMagic size={24} />
                                </div>
                                <h5 className="fw-bold">Real-time GFM</h5>
                                <p className="text-muted small mb-0">Full support for GitHub Flavored Markdown, including tables, task lists, and strikethroughs.</p>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="wt-feature-card h-100 border-0 shadow-sm rounded-4 text-center p-4">
                                <div className="feature-icon bg-success-subtle text-success mb-3">
                                    <FaCheckCircle size={24} />
                                </div>
                                <h5 className="fw-bold">Clean Preview</h5>
                                <p className="text-muted small mb-0">Experience a high-readability preview mode that matches modern documentation standards.</p>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="wt-feature-card h-100 border-0 shadow-sm rounded-4 text-center p-4">
                                <div className="feature-icon bg-warning-subtle text-warning mb-3">
                                    <FaFileExport size={24} />
                                </div>
                                <h5 className="fw-bold">Dual Export</h5>
                                <p className="text-muted small mb-0">Download your source as a markdown file or copy the rendered HTML for your website or CMS.</p>
                            </Card>
                        </Col>
                    </Row>

                    <div className="mt-5 p-5 bg-primary rounded-5 text-white shadow-lg overflow-hidden position-relative">
                        <div className="row align-items-center">
                            <Col lg={8}>
                                <h3 className="fw-bold mb-3">Streamline Your Documentation</h3>
                                <p className="opacity-90">
                                    Whether you're drafting a README, writing a blog post, or taking notes, 
                                    the Webzen Markdown Editor provides the focus and tools you need 
                                    to produce high-quality content faster than ever.
                                </p>
                            </Col>
                            <Col lg={4} className="d-none d-lg-block text-end">
                                <FaTerminal size={150} className="opacity-10" />
                            </Col>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default MarkdownEditor;
