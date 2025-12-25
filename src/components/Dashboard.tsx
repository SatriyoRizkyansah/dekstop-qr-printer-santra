import React, { useState } from "react";
import { QrCode, Printer, BarChart3, FileText, CheckCircle, AlertTriangle, Loader, Sparkles, Clock } from "lucide-react";
import "./Dashboard.css";

interface DashboardProps {
  username: string;
}

const Dashboard: React.FC<DashboardProps> = ({ username }) => {
  const [qrData, setQrData] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState("Printer Default");
  const [printHistory, setPrintHistory] = useState<Array<{ data: string; time: string; printer: string }>>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [message, setMessage] = useState("");

  const printers = ["Printer Default", "HP LaserJet Pro", "Canon Pixma", "Epson EcoTank"];

  const handleGenerateQR = () => {
    if (!qrData.trim()) {
      setMessage("Masukkan data untuk QR code");
      return;
    }
    setMessage(`QR Code generated: ${qrData}`);
  };

  const handlePrint = async () => {
    if (!qrData.trim()) {
      setMessage("Masukkan data terlebih dahulu");
      return;
    }

    setIsPrinting(true);
    setMessage("Sedang mencetak...");

    // Simulate print
    setTimeout(() => {
      const newRecord = {
        data: qrData,
        time: new Date().toLocaleTimeString("id-ID"),
        printer: selectedPrinter,
      };
      setPrintHistory([newRecord, ...printHistory]);
      setMessage(`Berhasil dicetak ke ${selectedPrinter}`);
      setQrData("");
      setIsPrinting(false);
    }, 1500);
  };

  const qrCodeUrl = qrData ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrData)}&size=300x300` : null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard QR Printer</h1>
        <p className="header-subtitle">Selamat datang, {username}</p>
      </div>

      {message && (
        <div className={`message ${message.includes("generated") || message.includes("Berhasil") ? "success" : message.includes("Sedang") ? "loading" : "warning"}`}>
          <div className="message-icon">{message.includes("generated") || message.includes("Berhasil") ? <CheckCircle size={16} /> : message.includes("Sedang") ? <Loader size={16} className="spinning" /> : <AlertTriangle size={16} />}</div>
          {message}
        </div>
      )}

      <div className="dashboard-content">
        {/* Left: Input & Preview */}
        <div className="left-panel">
          <section className="input-section">
            <h2>
              <QrCode size={20} /> Generate QR Code
            </h2>

            <div className="form-group">
              <label>Data untuk QR Code</label>
              <textarea value={qrData} onChange={(e) => setQrData(e.target.value)} placeholder="Masukkan teks, URL, atau nomor antrian..." rows={3} />
              <button className="generate-btn" onClick={handleGenerateQR}>
                <Sparkles size={16} />
                Generate QR
              </button>
            </div>

            <div className="form-group">
              <label>Pilih Printer</label>
              <select value={selectedPrinter} onChange={(e) => setSelectedPrinter(e.target.value)}>
                {printers.map((printer) => (
                  <option key={printer} value={printer}>
                    {printer}
                  </option>
                ))}
              </select>
            </div>

            <button className="print-btn" onClick={handlePrint} disabled={!qrData || isPrinting}>
              <Printer size={16} />
              {isPrinting ? "Mencetak..." : "Cetak QR Code"}
            </button>
          </section>

          <section className="preview-section">
            <h2>
              <FileText size={20} /> Preview
            </h2>
            <div className="qr-preview-container">
              {qrCodeUrl ? (
                <>
                  <img src={qrCodeUrl} alt="QR Code Preview" className="qr-image" />
                  <p className="qr-data-text">{qrData}</p>
                </>
              ) : (
                <div className="empty-preview">
                  <QrCode size={48} strokeWidth={1} />
                  <small>Generate QR code untuk melihat preview</small>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right: Print History */}
        <div className="right-panel">
          <section className="history-section">
            <h2>
              <Clock size={20} /> Riwayat Cetak
            </h2>
            {printHistory.length > 0 ? (
              <div className="history-list">
                {printHistory.map((item, index) => (
                  <div key={index} className="history-item">
                    <div className="history-icon">
                      <FileText size={18} />
                    </div>
                    <div className="history-content">
                      <p className="history-data">{item.data}</p>
                      <p className="history-printer">Printer: {item.printer}</p>
                      <p className="history-time">Waktu: {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-history">
                <p>Belum ada riwayat cetak</p>
              </div>
            )}
          </section>

          <section className="stats-section">
            <h2>
              <BarChart3 size={20} /> Statistik
            </h2>
            <div className="stat-card">
              <span className="stat-icon">
                <BarChart3 size={20} />
              </span>
              <div>
                <p className="stat-label">Total Cetak</p>
                <p className="stat-value">{printHistory.length}</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">
                <Printer size={20} />
              </span>
              <div>
                <p className="stat-label">Printer Tersedia</p>
                <p className="stat-value">{printers.length}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
