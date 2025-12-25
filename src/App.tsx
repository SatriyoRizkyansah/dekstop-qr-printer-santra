import React, { useState, useEffect } from "react";
import { Printer, LogOut, Settings, User, QrCode } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import Login from "./components/Login";
import QueueService from "./components/QueueService";
import "./App.css";
import "./App-additional.css";

interface PrinterOption {
  name: string;
  is_default: boolean;
  is_thermal: boolean;
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [printers, setPrinters] = useState<PrinterOption[]>([]);
  const [tempSelectedPrinter, setTempSelectedPrinter] = useState("");
  const [loadingPrinters, setLoadingPrinters] = useState(false);

  const handleLogin = (user: string, printer: string) => {
    setUsername(user);
    setSelectedPrinter(printer);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setSelectedPrinter("");
  };

  const openPrinterSettings = async () => {
    setShowPrinterModal(true);
    setTempSelectedPrinter(selectedPrinter);
    setLoadingPrinters(true);
    try {
      const result = await invoke<PrinterOption[]>("list_printers");
      setPrinters(result);
    } catch (error) {
      console.error("Failed to load printers:", error);
    }
    setLoadingPrinters(false);
  };

  const handleSavePrinter = () => {
    setSelectedPrinter(tempSelectedPrinter);
    setShowPrinterModal(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <div className="logged-in-view">
        <header className="app-header-modern">
          <div className="header-left-section">
            <div className="app-logo">
              <div className="logo-icon">
                <QrCode size={24} strokeWidth={2.5} />
              </div>
              <div className="logo-text">
                <h1>QR Printer System</h1>
                <p>Sistem Antrian Otomatis</p>
              </div>
            </div>
          </div>

          <div className="header-right-section">
            <div className="printer-display" onClick={openPrinterSettings}>
              <Printer size={18} strokeWidth={2} />
              <div className="printer-info">
                <span className="printer-label">Active Printer</span>
                <span className="printer-name">{selectedPrinter || "No Printer"}</span>
              </div>
            </div>

            <div className="user-display">
              <div className="user-avatar">
                <User size={16} strokeWidth={2.5} />
              </div>
              <span className="username">{username}</span>
            </div>

            <button onClick={handleLogout} className="logout-btn-modern">
              <LogOut size={18} strokeWidth={2} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="main-content">
          <QueueService defaultPrinter={selectedPrinter} />
        </main>

        {/* Printer Settings Modal */}
        {showPrinterModal && (
          <div className="modal-overlay" onClick={() => setShowPrinterModal(false)}>
            <div className="modal-content printer-settings-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">
                  <Settings size={20} strokeWidth={2} />
                  <h3>Pengaturan Printer</h3>
                </div>
                <button className="modal-close" onClick={() => setShowPrinterModal(false)}>
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <p className="modal-subtitle">Pilih printer yang akan digunakan untuk auto print tiket antrian</p>

                {loadingPrinters ? (
                  <div className="loading-state">Memuat printer...</div>
                ) : printers.length === 0 ? (
                  <div className="empty-state-small">Tidak ada printer terdeteksi</div>
                ) : (
                  <div className="printer-list">
                    {printers.map((printer, index) => (
                      <label key={index} className={`printer-option ${printer.is_thermal ? "thermal" : ""}`}>
                        <input type="radio" name="printer" value={printer.name} checked={tempSelectedPrinter === printer.name} onChange={(e) => setTempSelectedPrinter(e.target.value)} />
                        <span className="printer-name">
                          {printer.name}
                          {printer.is_thermal && <span className="thermal-badge">🔥 Thermal</span>}
                          {printer.is_default && <span className="default-badge">⭐ Default</span>}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowPrinterModal(false)}>
                  Batal
                </button>
                <button className="btn-print" onClick={handleSavePrinter} disabled={!tempSelectedPrinter || loadingPrinters}>
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
