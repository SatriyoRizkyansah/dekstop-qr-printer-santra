import React from 'react';

interface PrintPreviewProps {
  data?: string;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ data }) => {
  const qrCodeUrl = data
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(data)}&size=300x300`
    : null;

  return (
    <div className="preview-card">
      {qrCodeUrl ? (
        <>
          <img src={qrCodeUrl} alt="QR Code Preview" className="qr-preview" />
          <p className="qr-data">Data: {data}</p>
        </>
      ) : (
        <div className="empty-preview">
          <p>No QR code generated yet</p>
          <p>Enter data and generate QR code to see preview</p>
        </div>
      )}
    </div>
  );
};

export default PrintPreview;