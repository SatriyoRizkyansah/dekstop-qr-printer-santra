import React, { useEffect, useState } from "react";

interface PrinterSelectorProps {
  onPrinterSelect: (printer: string) => void;
}

const PrinterSelector: React.FC<PrinterSelectorProps> = ({ onPrinterSelect }) => {
  const [printers, setPrinters] = useState<string[]>(["HP LaserJet Pro", "Canon Pixma", "Epson EcoTank", "Default Printer"]);
  const [selectedPrinter, setSelectedPrinter] = useState("");

  useEffect(() => {
    if (printers.length > 0) {
      setSelectedPrinter(printers[0]);
      onPrinterSelect(printers[0]);
    }
  }, []);

  const handlePrinterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const printer = event.target.value;
    setSelectedPrinter(printer);
    onPrinterSelect(printer);
  };

  return (
    <div className="form-group">
      <label htmlFor="printer-select">Select Printer</label>
      <select id="printer-select" className="form-select" value={selectedPrinter} onChange={handlePrinterChange}>
        <option value="">-- Choose a printer --</option>
        {printers.map((printer) => (
          <option key={printer} value={printer}>
            {printer}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PrinterSelector;
