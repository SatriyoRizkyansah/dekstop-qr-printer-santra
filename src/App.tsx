import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import PrinterSelector from './components/PrinterSelector';
import QRInput from './components/QRInput';
import PrintPreview from './components/PrintPreview';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [selectedPrinter, setSelectedPrinter] = useState<string>('');
  const [qrData, setQrData] = useState('');
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    // Logic to fetch available printers and set the default printer
  }, []);

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setSelectedPrinter('');
    setQrData('');
    setQrCode('');
  };

  const handlePrint = () => {
    if (selectedPrinter && qrCode) {
      // Logic to send the QR code to the selected printer
      alert(`Printing QR code to ${selectedPrinter}`);
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <div className="app-main">
        <header className="app-header">
          <h1>QR Code Printer</h1>
          <div className="user-info">
            <span className="user-name">Welcome, {username}!</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="app-content">
          <h2 className="page-title">Generate & Print QR Codes</h2>

          <div className="app-layout">
            <div className="form-section">
              <h3>QR Code Details</h3>
              <QRInput onGenerate={(data) => { setQrData(data); setQrCode(data); }} />
              <PrinterSelector onPrinterSelect={setSelectedPrinter} />
              <button className="print-button" onClick={handlePrint}>
                Print QR Code
              </button>
            </div>

            <div className="preview-section">
              <h3>Preview</h3>
              <PrintPreview data={qrCode} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;