import React from 'react';

const AdSection = ({ slot, format = 'auto', responsive = true, style = {} }) => {
    // In a real application, you would load the AdSense script here or in index.html
    // and use <ins className="adsbygoogle" ... />
    
    return (
        <div 
            className="ad-container text-center my-4" 
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '20px',
                color: 'var(--muted, #64748b)',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: slot === 'sidebar' ? '600px' : '100px',
                width: '100%',
                ...style
            }}
        >
            <span>Advertisement Space ({slot || 'banner'})</span>
        </div>
    );
};

export default AdSection;
