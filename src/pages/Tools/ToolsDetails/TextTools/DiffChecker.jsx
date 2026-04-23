import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { 
    FaColumns, FaExchangeAlt, FaTrash, FaPlus, FaMinus, FaEquals
} from 'react-icons/fa';

const DiffChecker = () => {
    const [original, setOriginal] = useState('');
    const [changed, setChanged] = useState('');
    const [diffResult, setDiffResult] = useState([]);
    const [stats, setStats] = useState({ additions: 0, deletions: 0 });

    const computeDiff = () => {
        const oldLines = original.split(/\r?\n/);
        const newLines = changed.split(/\r?\n/);
        
        let i = 0;
        let j = 0;
        const result = [];
        let adds = 0;
        let dels = 0;

        while (i < oldLines.length || j < newLines.length) {
            if (i < oldLines.length && j < newLines.length && oldLines[i] === newLines[j]) {
                result.push({ type: 'equal', old: oldLines[i], new: newLines[j], lineOld: i + 1, lineNew: j + 1 });
                i++;
                j++;
            } else {
                // Check if oldLines[i] exists later in newLines (deletion)
                // Or if newLines[j] exists later in oldLines (addition)
                // For simplicity in a tool like this without a heavy library, 
                // we'll mark as deletion then addition if they don't match.
                
                // Advanced: Look ahead to find matches
                let foundMatch = false;
                for (let k = 1; k < 10; k++) {
                    if (i + k < oldLines.length && oldLines[i+k] === newLines[j]) {
                        // Lines from i to i+k-1 were deleted
                        for(let m = 0; m < k; m++) {
                            result.push({ type: 'deleted', old: oldLines[i+m], new: '', lineOld: i + m + 1, lineNew: '' });
                            dels++;
                        }
                        i += k;
                        foundMatch = true;
                        break;
                    }
                    if (j + k < newLines.length && newLines[j+k] === oldLines[i]) {
                        // Lines from j to j+k-1 were added
                        for(let m = 0; m < k; m++) {
                            result.push({ type: 'added', old: '', new: newLines[j+m], lineOld: '', lineNew: j + m + 1 });
                            adds++;
                        }
                        j += k;
                        foundMatch = true;
                        break;
                    }
                }

                if (!foundMatch) {
                    if (i < oldLines.length && j < newLines.length) {
                        result.push({ type: 'deleted', old: oldLines[i], new: '', lineOld: i + 1, lineNew: '' });
                        result.push({ type: 'added', old: '', new: newLines[j], lineOld: '', lineNew: j + 1 });
                        dels++;
                        adds++;
                        i++;
                        j++;
                    } else if (i < oldLines.length) {
                        result.push({ type: 'deleted', old: oldLines[i], new: '', lineOld: i + 1, lineNew: '' });
                        dels++;
                        i++;
                    } else if (j < newLines.length) {
                        result.push({ type: 'added', old: '', new: newLines[j], lineOld: '', lineNew: j + 1 });
                        adds++;
                        j++;
                    }
                }
            }
        }
        setDiffResult(result);
        setStats({ additions: adds, deletions: dels });
    };

    useEffect(() => {
        computeDiff();
    }, [original, changed]);

    const handleSwap = () => {
        const temp = original;
        setOriginal(changed);
        setChanged(temp);
    };

    const handleClear = () => {
        setOriginal('');
        setChanged('');
    };

    return (
        <div className="diff-checker-tool">
            <Row className="mb-4 g-3">
                <Col md={6}>
                    <Form.Group>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="fw-bold mb-0">Original Text</Form.Label>
                            <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={() => setOriginal('')}>
                                <FaTrash className="me-1" /> Clear
                            </Button>
                        </div>
                        <Form.Control 
                            as="textarea" 
                            rows={8} 
                            placeholder="Paste original content here..."
                            value={original}
                            onChange={(e) => setOriginal(e.target.value)}
                            className="border-0 bg-light p-3 rounded-4 shadow-sm"
                            style={{ fontSize: '0.9rem' }}
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="fw-bold mb-0">Changed Text</Form.Label>
                            <Button variant="link" className="text-danger p-0 text-decoration-none small" onClick={() => setChanged('')}>
                                <FaTrash className="me-1" /> Clear
                            </Button>
                        </div>
                        <Form.Control 
                            as="textarea" 
                            rows={8} 
                            placeholder="Paste modified content here..."
                            value={changed}
                            onChange={(e) => setChanged(e.target.value)}
                            className="border-0 bg-light p-3 rounded-4 shadow-sm"
                            style={{ fontSize: '0.9rem' }}
                        />
                    </Form.Group>
                </Col>
            </Row>

            <div className="d-flex justify-content-center gap-3 mb-4">
                <Button variant="outline-primary" className="rounded-pill px-4" onClick={handleSwap}>
                    <FaExchangeAlt className="me-2" /> Swap Sides
                </Button>
                <Button variant="outline-danger" className="rounded-pill px-4" onClick={handleClear}>
                    <FaTrash className="me-2" /> Clear All
                </Button>
            </div>

            <div className="diff-results glass-card rounded-4 border overflow-hidden">
                <div className="diff-header bg-dark text-white p-3 d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-bold d-flex align-items-center">
                        <FaColumns className="me-2" /> Comparison Result
                    </h6>
                    <div className="d-flex gap-3 small">
                        <span className="text-success"><FaPlus className="me-1" /> {stats.additions} Additions</span>
                        <span className="text-danger"><FaMinus className="me-1" /> {stats.deletions} Deletions</span>
                    </div>
                </div>
                
                <div className="diff-body bg-white" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <table className="table table-borderless table-sm mb-0 w-100" style={{ tableLayout: 'fixed', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                        <tbody>
                            {diffResult.length === 0 ? (
                                <tr>
                                    <td className="text-center py-5 text-muted">Enter text above to see the differences...</td>
                                </tr>
                            ) : (
                                diffResult.map((line, idx) => (
                                    <tr key={idx} className={line.type === 'added' ? 'bg-success bg-opacity-10' : line.type === 'deleted' ? 'bg-danger bg-opacity-10' : ''}>
                                        <td className="text-muted border-end text-center" style={{ width: '40px', userSelect: 'none' }}>{line.lineOld}</td>
                                        <td className={`px-3 ${line.type === 'deleted' ? 'text-danger' : ''}`} style={{ wordBreak: 'break-all', borderRight: '1px solid #eee' }}>
                                            {line.type === 'deleted' && <FaMinus className="me-2 opacity-50" />}
                                            {line.old}
                                        </td>
                                        <td className="text-muted border-end text-center" style={{ width: '40px', userSelect: 'none' }}>{line.lineNew}</td>
                                        <td className={`px-3 ${line.type === 'added' ? 'text-success' : ''}`} style={{ wordBreak: 'break-all' }}>
                                            {line.type === 'added' && <FaPlus className="me-2 opacity-50" />}
                                            {line.new}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-5 pt-4 border-top">
                <h3 className="h5 fw-bold mb-3">Professional Diff Checker</h3>
                <p className="text-muted">
                    Compare two pieces of text side-by-side to find exactly what has changed. This tool is essential for developers reviewing code, 
                    writers comparing drafts, or anyone who needs to track revisions in a document. 
                    The checker highlights added lines in <span className="text-success fw-bold">green</span> and removed lines in <span className="text-danger fw-bold">red</span>, 
                    making it easy to spot even the smallest modifications.
                </p>
                <div className="row mt-3 text-muted small">
                    <div className="col-md-4 d-flex align-items-center gap-2">
                        <div className="p-1 rounded bg-success bg-opacity-25"><FaPlus className="text-success" /></div>
                        <span><strong>Green:</strong> Content added in the new version.</span>
                    </div>
                    <div className="col-md-4 d-flex align-items-center gap-2">
                        <div className="p-1 rounded bg-danger bg-opacity-25"><FaMinus className="text-danger" /></div>
                        <span><strong>Red:</strong> Content removed from the original.</span>
                    </div>
                    <div className="col-md-4 d-flex align-items-center gap-2">
                        <div className="p-1 rounded bg-light"><FaEquals className="text-muted" /></div>
                        <span><strong>Neutral:</strong> Identical lines in both versions.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiffChecker;
