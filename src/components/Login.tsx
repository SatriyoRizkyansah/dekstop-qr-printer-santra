import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import PrintPreview from "./PrintPreview";
import { TicketData, generateTestTicket } from "../types/ticket";
import "./Login.css";

interface Printer {
  name: string;
  driver: string;
  port: string;
  status: string;
  is_thermal: boolean;
}

interface LoginProps {
  onLogin: (username: string, printer: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");
  const [loadingPrinters, setLoadingPrinters] = useState(true);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [testTicket, setTestTicket] = useState<TicketData | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printMessage, setPrintMessage] = useState("");

  useEffect(() => {
    loadPrinters();
  }, []);

  const loadPrinters = async () => {
    try {
      setLoadingPrinters(true);
      const printerList = await invoke<Printer[]>("list_printers");
      setPrinters(printerList);

      const thermalPrinter = printerList.find((p) => p.is_thermal);
      if (thermalPrinter) {
        setSelectedPrinter(thermalPrinter.name);
      } else if (printerList.length > 0) {
        setSelectedPrinter(printerList[0].name);
      }
    } catch (err) {
      console.error("Error loading printers:", err);
    } finally {
      setLoadingPrinters(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedPrinter) {
      setError("Pilih printer thermal terlebih dahulu");
      return;
    }

    if (!username.trim()) {
      setError("Username harus diisi");
      return;
    }

    if (!password.trim()) {
      setError("Password harus diisi");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (username && password.length >= 3) {
        onLogin(username, selectedPrinter);
      } else {
        setError("Username atau password salah");
      }
      setIsLoading(false);
    }, 500);
  };

  const handleTestQR = () => {
    if (!selectedPrinter) {
      alert("Pilih printer terlebih dahulu");
      return;
    }

    const ticket = generateTestTicket();
    setTestTicket(ticket);
    setShowPrintPreview(true);
  };

  const handlePrint = async () => {
    if (!testTicket || !selectedPrinter) return;

    setIsPrinting(true);
    setPrintMessage("");

    try {
      const result = await invoke<string>("test_print", {
        printerName: selectedPrinter,
      });
      setPrintMessage(result);

      // Close modal after successful print
      setTimeout(() => {
        setShowPrintPreview(false);
        setTestTicket(null);
        setPrintMessage("");
      }, 2000);
    } catch (err) {
      setPrintMessage("Gagal mencetak: " + err);
      console.error("Print error:", err);
    } finally {
      setIsPrinting(false);
    }
  };

  const selectedPrinterInfo = printers.find((p) => p.name === selectedPrinter);
  const thermalPrinters = printers.filter((p) => p.is_thermal);
  const regularPrinters = printers.filter((p) => !p.is_thermal);

  return (
    <>
      {showPrintPreview && testTicket && (
        <PrintPreview
          ticket={testTicket}
          onClose={() => {
            setShowPrintPreview(false);
            setTestTicket(null);
            setPrintMessage("");
          }}
          onPrint={handlePrint}
          isPrinting={isPrinting}
        />
      )}

      {printMessage && <div className="print-notification">{printMessage}</div>}

      <div className="login-wrapper">
        <div className="printer-config-panel">
          <div className="panel-header">
            <svg className="header-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
            </svg>
            <h2>Konfigurasi Printer</h2>
          </div>
          <p className="panel-subtitle">Pastikan printer thermal terhubung sebelum login</p>

          <div className="printer-selection-section">
            <div className="section-header">
              <svg className="section-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
              </svg>
              <span>Pilih Printer Thermal</span>
              {selectedPrinter && <span className="status-badge connected">Terhubung</span>}
            </div>

            <div className="printer-dropdown-section">
              <label>Pilih Printer Thermal</label>
              <div className="printer-select-wrapper">
                <select value={selectedPrinter} onChange={(e) => setSelectedPrinter(e.target.value)} disabled={loadingPrinters} className="printer-select">
                  {loadingPrinters ? (
                    <option>Memuat printer...</option>
                  ) : printers.length === 0 ? (
                    <option>Tidak ada printer terdeteksi</option>
                  ) : (
                    <>
                      <option value="">-- Pilih Printer --</option>
                      {printers.map((printer) => (
                        <option key={printer.name} value={printer.name}>
                          {printer.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
                {selectedPrinter && (
                  <button type="button" className="clear-selection" onClick={() => setSelectedPrinter("")} title="Hapus pilihan">
                    ×
                  </button>
                )}
              </div>

              <div className="printer-actions">
                <button type="button" className="action-btn" onClick={loadPrinters}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
                  </svg>
                  Refresh
                </button>
                <button type="button" className="action-btn" disabled>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  Test
                </button>
                <button type="button" className="action-btn" disabled>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H2v5h7M15 5h7v5h-7M9 19H2v-5h7M15 19h7v-5h-7" />
                  </svg>
                  Test Page
                </button>
                <button type="button" className="action-btn action-btn-primary" onClick={handleTestQR} disabled={!selectedPrinter}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Test QR
                </button>
              </div>
            </div>

            {selectedPrinterInfo && (
              <div className="selected-printer-info">
                <div className="printer-card">
                  <div className="printer-icon-wrapper">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="#FF6B35" stroke="#FF6B35" strokeWidth="1">
                      <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
                    </svg>
                  </div>
                  <div className="printer-details">
                    <div className="printer-name">{selectedPrinterInfo.name}</div>
                    <div className="printer-meta">Brand: {selectedPrinterInfo.driver}</div>
                    <div className="printer-meta">Koneksi: {selectedPrinterInfo.port}</div>
                    <div className="printer-meta">Deskripsi: System printer - {selectedPrinterInfo.is_thermal ? "Thermal" : "Regular"}</div>
                    {!selectedPrinterInfo.is_thermal && (
                      <div className="printer-warning">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff9800" stroke="#ff9800">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <span>Non-Thermal Printer</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="printer-stats">
              <div className="stat-box thermal">
                <div className="stat-value">{thermalPrinters.length}</div>
                <div className="stat-label">Thermal Printers</div>
              </div>
              <div className="stat-box regular">
                <div className="stat-value">{regularPrinters.length}</div>
                <div className="stat-label">Regular Printers</div>
              </div>
            </div>

            {selectedPrinterInfo && !selectedPrinterInfo.is_thermal && (
              <div className="warning-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>Printer yang dipilih bukan thermal printer. Hasil cetakan mungkin tidak optimal untuk QR code.</span>
              </div>
            )}
          </div>

          <div className="printer-info-section">
            <h3>Informasi Printer</h3>
            {selectedPrinterInfo ? (
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-label">Nama:</span>
                  <span className="info-value">{selectedPrinterInfo.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Jenis:</span>
                  <span className="info-value">{selectedPrinterInfo.is_thermal ? "Thermal" : "Regular"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Koneksi:</span>
                  <span className="info-value">{selectedPrinterInfo.port}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Brand:</span>
                  <span className="info-value">{selectedPrinterInfo.driver || "Unknown"}</span>
                </div>
              </div>
            ) : (
              <p className="no-printer-selected">Belum ada printer yang dipilih</p>
            )}
          </div>
        </div>

        <div className="login-panel">
          <div className="login-content">
            <div className="user-avatar">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#5B8DEF" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <h1 className="welcome-title">Selamat Datang</h1>
            <p className="welcome-subtitle">Masuk untuk mengakses sistem cetak QR Code wisuda</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input id="username" type="text" placeholder="Masukkan username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <input id="password" type="password" placeholder="Masukkan password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" disabled={isLoading || !selectedPrinter} className="login-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                </svg>
                {isLoading ? "Masuk..." : "Masuk"}
              </button>
            </form>

            <div className="login-help">
              <h4>Petunjuk Login:</h4>
              <ul>
                <li>• Pastikan printer thermal sudah terhubung dan dikonfigurasi</li>
                <li>• Gunakan kredensial wisuda.unpam.ac.id</li>
              </ul>
            </div>
          </div>

          <div className="status-bar">
            <div className="status-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
              </svg>
              <span className="status-label">Printer:</span>
              <span className="status-value">{selectedPrinter || "Belum dipilih"}</span>
            </div>
            <div className="status-divider"></div>
            <div className="status-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="status-label">Status:</span>
              <span className="status-value">{selectedPrinter ? "Siap Login" : "Pilih Printer"}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
