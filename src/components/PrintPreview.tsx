import React from 'react';

interface PrintPreviewProps {
    qrCodeData: string;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ qrCodeData }) => {
    return (
        <div>
            <h2>QR Code Preview</h2>
            <div style={{ border: '1px solid #000', padding: '20px', textAlign: 'center' }}>
                <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrCodeData)}&size=200x200`}
                    alt="QR Code"
                />
            </div>
        </div>
    );
};

export default PrintPreview;