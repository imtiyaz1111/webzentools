import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Button, Form, Card, InputGroup, Badge } from 'react-bootstrap';
import { 
    FaRuler, FaWeightHanging, FaThermometerHalf, FaBox, FaCubes, 
    FaBolt, FaClock, FaHdd, FaSyncAlt, FaCopy, FaExchangeAlt, FaHistory
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const UnitConverter = () => {
    // Unit Data
    const unitData = {
        length: {
            name: 'Length',
            icon: <FaRuler />,
            units: {
                millimeter: 0.001,
                centimeter: 0.01,
                meter: 1,
                kilometer: 1000,
                inch: 0.0254,
                foot: 0.3048,
                yard: 0.9144,
                mile: 1609.344
            }
        },
        weight: {
            name: 'Weight',
            icon: <FaWeightHanging />,
            units: {
                milligram: 0.000001,
                gram: 0.001,
                kilogram: 1,
                metric_ton: 1000,
                ounce: 0.0283495,
                pound: 0.453592,
                stone: 6.35029
            }
        },
        temperature: {
            name: 'Temperature',
            icon: <FaThermometerHalf />,
            units: {
                celsius: 'C',
                fahrenheit: 'F',
                kelvin: 'K'
            }
        },
        volume: {
            name: 'Volume',
            icon: <FaBox />,
            units: {
                milliliter: 0.001,
                liter: 1,
                cubic_meter: 1000,
                teaspoon: 0.00492892,
                tablespoon: 0.0147868,
                fluid_ounce: 0.0295735,
                cup: 0.24,
                pint: 0.473176,
                quart: 0.946353,
                gallon: 3.78541
            }
        },
        area: {
            name: 'Area',
            icon: <FaCubes />,
            units: {
                square_millimeter: 0.000001,
                square_centimeter: 0.0001,
                square_meter: 1,
                square_kilometer: 1000000,
                square_inch: 0.00064516,
                square_foot: 0.092903,
                square_yard: 0.836127,
                acre: 4046.856,
                hectare: 10000
            }
        },
        data: {
            name: 'Digital Storage',
            icon: <FaHdd />,
            units: {
                bit: 0.125,
                byte: 1,
                kilobyte: 1024,
                megabyte: 1024 * 1024,
                gigabyte: 1024 * 1024 * 1024,
                terabyte: 1024 * 1024 * 1024 * 1024,
                petabyte: 1024 * 1024 * 1024 * 1024 * 1024
            }
        },
        time: {
            name: 'Time',
            icon: <FaClock />,
            units: {
                millisecond: 0.001,
                second: 1,
                minute: 60,
                hour: 3600,
                day: 86400,
                week: 604800,
                month: 2629746,
                year: 31556952
            }
        }
    };

    // State
    const [category, setCategory] = useState('length');
    const [value, setValue] = useState(1);
    const [fromUnit, setFromUnit] = useState('meter');
    const [toUnit, setToUnit] = useState('centimeter');
    const [result, setResult] = useState(0);

    // Effect: Update result when inputs change
    useEffect(() => {
        handleConversion();
    }, [category, value, fromUnit, toUnit]);

    // Effect: Reset units when category changes
    useEffect(() => {
        const units = Object.keys(unitData[category].units);
        setFromUnit(units[0]);
        setToUnit(units[1] || units[0]);
    }, [category]);

    const handleConversion = () => {
        if (category === 'temperature') {
            let celsius;
            if (fromUnit === 'celsius') celsius = value;
            else if (fromUnit === 'fahrenheit') celsius = (value - 32) * 5/9;
            else if (fromUnit === 'kelvin') celsius = value - 273.15;

            let final;
            if (toUnit === 'celsius') final = celsius;
            else if (toUnit === 'fahrenheit') final = (celsius * 9/5) + 32;
            else if (toUnit === 'kelvin') final = parseFloat(celsius) + 273.15;
            setResult(final);
        } else {
            const factors = unitData[category].units;
            const baseValue = value * factors[fromUnit];
            const finalValue = baseValue / factors[toUnit];
            setResult(finalValue);
        }
    };

    const handleSwap = () => {
        setFromUnit(toUnit);
        setToUnit(fromUnit);
    };

    const copyToClipboard = (val) => {
        navigator.clipboard.writeText(val.toString());
        toast.success('Copied to clipboard!');
    };

    const formatUnitName = (name) => {
        return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className="unit-converter-container py-4">
            <style>
                {`
                .unit-converter-container {
                    animation: fadeIn 0.6s ease-out;
                    max-width: 1000px;
                    margin: 0 auto;
                    color: #1e293b;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .premium-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 24px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.05);
                    padding: 40px;
                    margin-bottom: 30px;
                }

                .category-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
                    gap: 15px;
                    margin-bottom: 40px;
                }

                .category-btn {
                    background: #f8fafc;
                    border: 1px solid #f1f5f9;
                    border-radius: 16px;
                    padding: 20px 10px;
                    text-align: center;
                    transition: all 0.3s;
                    cursor: pointer;
                    color: #64748b;
                }

                .category-btn:hover {
                    transform: translateY(-5px);
                    border-color: #6366f1;
                    color: #6366f1;
                }

                .category-btn.active {
                    background: #6366f1;
                    color: white;
                    border-color: #6366f1;
                    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
                }

                .category-icon {
                    font-size: 1.5rem;
                    margin-bottom: 10px;
                    display: block;
                }

                .category-name {
                    font-size: 0.85rem;
                    font-weight: 700;
                }

                .converter-interface {
                    background: #f8fafc;
                    border-radius: 24px;
                    padding: 40px;
                    border: 1px solid #f1f5f9;
                }

                .unit-box {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.02);
                }

                .unit-input {
                    font-size: 2rem;
                    font-weight: 800;
                    border: none;
                    width: 100%;
                    padding: 0;
                    color: #0f172a;
                    outline: none;
                    background: transparent;
                }

                .unit-select {
                    border: none;
                    background: #f1f5f9;
                    border-radius: 8px;
                    padding: 5px 10px;
                    font-weight: 600;
                    color: #64748b;
                    font-size: 0.85rem;
                    width: 100%;
                    margin-top: 10px;
                    cursor: pointer;
                }

                .swap-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .swap-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: white;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6366f1;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }

                .swap-btn:hover {
                    transform: rotate(180deg);
                    background: #6366f1;
                    color: white;
                }

                .quick-conversions {
                    margin-top: 40px;
                }

                .quick-item {
                    background: white;
                    border-radius: 12px;
                    padding: 12px 20px;
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.9rem;
                    border: 1px solid #f1f5f9;
                }

                .quick-item:hover {
                    border-color: #6366f1;
                }

                @media (max-width: 768px) {
                    .category-grid { grid-template-columns: repeat(3, 1fr); }
                    .swap-container { margin: 20px 0; transform: rotate(90deg); }
                }
                `}
            </style>

            <div className="premium-card">
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                    <FaSyncAlt className="text-primary me-2" /> Select Category
                </h5>
                <div className="category-grid">
                    {Object.entries(unitData).map(([key, data]) => (
                        <div 
                            key={key} 
                            className={`category-btn ${category === key ? 'active' : ''}`}
                            onClick={() => setCategory(key)}
                        >
                            <span className="category-icon">{data.icon}</span>
                            <span className="category-name">{data.name}</span>
                        </div>
                    ))}
                </div>

                <div className="converter-interface">
                    <Row className="align-items-center">
                        <Col md={5}>
                            <div className="unit-box">
                                <label className="extra-small fw-bold text-muted text-uppercase mb-2">From</label>
                                <input 
                                    type="number" 
                                    className="unit-input" 
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                                <select 
                                    className="unit-select"
                                    value={fromUnit}
                                    onChange={(e) => setFromUnit(e.target.value)}
                                >
                                    {Object.keys(unitData[category].units).map(u => (
                                        <option key={u} value={u}>{formatUnitName(u)}</option>
                                    ))}
                                </select>
                            </div>
                        </Col>
                        <Col md={2} className="swap-container">
                            <div className="swap-btn" onClick={handleSwap}>
                                <FaExchangeAlt />
                            </div>
                        </Col>
                        <Col md={5}>
                            <div className="unit-box" style={{ background: '#fcfdff', borderColor: '#dbeafe' }}>
                                <label className="extra-small fw-bold text-primary text-uppercase mb-2">To</label>
                                <div className="unit-input text-primary">
                                    {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                                </div>
                                <select 
                                    className="unit-select"
                                    value={toUnit}
                                    onChange={(e) => setToUnit(e.target.value)}
                                >
                                    {Object.keys(unitData[category].units).map(u => (
                                        <option key={u} value={u}>{formatUnitName(u)}</option>
                                    ))}
                                </select>
                            </div>
                        </Col>
                    </Row>

                    <div className="text-center mt-4">
                        <Button variant="light" className="rounded-pill px-4 fw-bold" onClick={() => copyToClipboard(result)}>
                            <FaCopy className="me-2" /> Copy Result
                        </Button>
                    </div>
                </div>

                <div className="quick-conversions">
                    <h6 className="fw-bold mb-3 small text-muted text-uppercase">Common Conversions</h6>
                    <Row>
                        {Object.keys(unitData[category].units).slice(0, 6).map((u, i) => (
                            <Col key={i} md={4}>
                                <div className="quick-item">
                                    <span className="fw-bold">1 {formatUnitName(fromUnit)}</span>
                                    <span className="text-primary fw-bold">
                                        {category === 'temperature' ? '...' : (unitData[category].units[fromUnit] / unitData[category].units[u]).toFixed(4)} {formatUnitName(u)}
                                    </span>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>

            {/* Info Section */}
            <Card className="border-0 rounded-4 bg-light p-4 shadow-sm">
                <Row className="align-items-center g-4">
                    <Col md={1}>
                        <div className="text-center text-primary opacity-25">
                            <FaHistory size={40} />
                        </div>
                    </Col>
                    <Col md={11}>
                        <h6 className="fw-bold mb-2">Precision Multi-Unit Converter</h6>
                        <p className="small text-muted mb-0">
                            A versatile tool for instant conversion between metric, imperial, and other specialized units. 
                            Whether you're working on a scientific project, cooking, or managing digital storage, 
                            this tool provides accurate results across {Object.keys(unitData).length} categories. 
                            All calculations are performed locally in your browser with high precision.
                        </p>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default UnitConverter;
