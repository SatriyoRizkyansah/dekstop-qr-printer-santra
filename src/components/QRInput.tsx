import React, { useState } from "react";

interface QRInputProps {
  onGenerate: (data: string) => void;
}

const QRInput: React.FC<QRInputProps> = ({ onGenerate }) => {
  const [input, setInput] = useState("");

  const handleGenerate = () => {
    if (input.trim()) {
      onGenerate(input);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="qr-input">Enter Data for QR Code</label>
      <textarea id="qr-input" className="form-textarea" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text, URL, or any data..." rows={4} />
      <button className="generate-button" onClick={handleGenerate}>
        Generate QR Code
      </button>
    </div>
  );
};

export default QRInput;
