import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api';

const PrinterSelector = ({ onPrinterSelect }) => {
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState('');

    useEffect(() => {
        const fetchPrinters = async () => {
            try {
                const availablePrinters = await invoke('get_printers');
                setPrinters(availablePrinters);
            } catch (error) {
                console.error('Error fetching printers:', error);
            }
        };

        fetchPrinters();
    }, []);

    const handlePrinterChange = (event) => {
        const printer = event.target.value;
        setSelectedPrinter(printer);
        onPrinterSelect(printer);
    };

    return (
        <div>
            <label htmlFor="printer-select">Select Printer:</label>
            <select id="printer-select" value={selectedPrinter} onChange={handlePrinterChange}>
                <option value="">--Select a Printer--</option>
                {printers.map((printer) => (
                    <option key={printer.id} value={printer.name}>
                        {printer.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default PrinterSelector;