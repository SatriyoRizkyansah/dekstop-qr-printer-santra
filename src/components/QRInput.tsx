import React, { useState } from 'react';

const QRInput: React.FC<{ onGenerate: (data: string) => void }> = ({ onGenerate }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleGenerateClick = () => {
        if (inputValue.trim()) {
            onGenerate(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter data for QR code"
            />
            <button onClick={handleGenerateClick}>Generate QR Code</button>
        </div>
    );
};

export default QRInput;