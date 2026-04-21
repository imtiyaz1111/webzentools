import React from 'react';
import { FaHammer } from 'react-icons/fa';

const PlaceholderTool = ({ toolName }) => {
    return (
        <div className="text-center py-5">
            <div className="mb-4">
                <div className="display-1 text-muted opacity-25">
                    <FaHammer />
                </div>
            </div>
            <h2 className="fw-bold mb-3">Tool Under Construction</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
                We are currently building the <strong>{toolName}</strong> tool to provide you with the best premium experience. 
                Please check back soon or explore our other available tools!
            </p>
            <div className="mt-4">
                <button className="btn btn-primary rounded-pill px-4" onClick={() => window.history.back()}>
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default PlaceholderTool;
