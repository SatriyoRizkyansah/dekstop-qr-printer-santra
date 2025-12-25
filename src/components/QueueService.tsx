import React, { useState } from "react";
import { Printer, Users, Calendar, Clock, CheckCircle, AlertTriangle, QrCode, FileText, User, Baby, Smile, UserCheck } from "lucide-react";
import "./QueueService.css";

interface QueueData {
  category: string;
  categoryName: string;
  ticketNumber: number;
  status: string;
  takenAt: string;
  qrData?: string;
}

interface PrinterOption {
  id: string;
  name: string;
}

const QueueService: React.FC = () => {
  const [myTickets, setMyTickets] = useState<QueueData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPrinterModal, setShowPrinterModal] = useState(false);
  const [selectedTicketIndex, setSelectedTicketIndex] = useState<number | null>(null);
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");

  const printers: PrinterOption[] = [
    { id: "1", name: "Printer A (Meja 1)" },
    { id: "2", name: "Printer B (Meja 2)" },
    { id: "3", name: "Printer C (Lobi)" },
    { id: "4", name: "Printer D (Farmasi)" },
  ];

  const categories = [
    { id: "A", name: "Pemeriksaan Umum", icon: User, color: "#3D84A7" },
    { id: "B", name: "Kesehatan Ibu dan Anak", icon: Baby, color: "#46CDCF" },
    { id: "C", name: "Kesehatan Gigi dan Mulut", icon: Smile, color: "#47466D" },
    { id: "D", name: "Keluarga Berencana (KB)", icon: Users, color: "#ABEED8" },
  ];

  const takeQueue = async (categoryId: string) => {
    setIsLoading(true);
    setMessage("");

    // Simulate API call
    setTimeout(() => {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        const ticketNumber = Math.floor(Math.random() * 900) + 100;
        const qrData = `${categoryId}${ticketNumber}`;
        const newTicket: QueueData = {
          category: categoryId,
          categoryName: category.name,
          ticketNumber,
          qrData,
          status: "Antri",
          takenAt: new Date().toLocaleTimeString("id-ID"),
        };

        setMyTickets([...myTickets, newTicket]);
        setMessage(`Antrian berhasil diambil! Nomor antrian: ${qrData}`);
      }
      setIsLoading(false);
    }, 800);
  };

  const openPrinterModal = (index: number) => {
    setSelectedTicketIndex(index);
    setShowPrinterModal(true);
    setSelectedPrinter("");
  };

  const handlePrint = async () => {
    if (!selectedPrinter || selectedTicketIndex === null) {
      setMessage("Pilih printer terlebih dahulu");
      return;
    }

    const ticket = myTickets[selectedTicketIndex];
    const printerName = printers.find((p) => p.id === selectedPrinter)?.name || "Unknown Printer";

    setMessage(`Sedang mencetak ke ${printerName}...`);

    // Simulate print
    setTimeout(() => {
      setMessage(`Berhasil dicetak! Tiket ${ticket.category}${ticket.ticketNumber} dicetak ke ${printerName}`);
      setShowPrinterModal(false);
      setSelectedTicketIndex(null);
      setSelectedPrinter("");
    }, 1500);
  };

  const cancelTicket = (index: number) => {
    const canceled = myTickets[index];
    setMyTickets(myTickets.filter((_, i) => i !== index));
    setMessage(`Antrian ${canceled.category}${canceled.ticketNumber} dibatalkan`);
  };

  return (
    <div className="queue-service-container">
      <div className="queue-header">
        <h1>Sistem Antrian Otomatis</h1>
        <p className="user-greeting">Ambil Antrian Kesehatan</p>
      </div>

      {message && (
        <div className={`message ${message.includes("berhasil") || message.includes("Berhasil") ? "success" : message.includes("Sedang") ? "loading" : "info"}`}>
          <div className="message-icon">{message.includes("berhasil") || message.includes("Berhasil") ? <CheckCircle size={16} /> : message.includes("Sedang") ? <Printer size={16} /> : <AlertTriangle size={16} />}</div>
          {message}
        </div>
      )}

      <div className="queue-content">
        {/* Take Queue Section */}
        <section className="take-queue-section">
          <h2>
            <Users size={20} /> Ambil Antrian
          </h2>
          <p className="section-subtitle">Pilih layanan yang ingin Anda gunakan</p>

          <div className="categories-grid">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="category-card" style={{ borderTopColor: category.color }}>
                  <div className="category-icon" style={{ backgroundColor: category.color }}>
                    <IconComponent size={32} color="white" />
                  </div>
                  <h3>{category.name}</h3>
                  <p className="category-code">Kode: {category.id}</p>
                  <button className="take-queue-btn" onClick={() => takeQueue(category.id)} disabled={isLoading} style={{ "--accent-color": category.color } as any}>
                    {isLoading ? (
                      <>
                        <Clock size={16} /> Memproses...
                      </>
                    ) : (
                      <>
                        <FileText size={16} /> Ambil Antrian
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* My Tickets Section */}
        {myTickets.length > 0 && (
          <section className="my-tickets-section">
            <h2>
              <FileText size={20} /> Antrian Saya
            </h2>
            <div className="tickets-list">
              {myTickets.map((ticket, index) => (
                <div key={index} className="ticket-item">
                  <div className="ticket-content">
                    <div className="ticket-number-display">
                      {ticket.category}
                      {ticket.ticketNumber}
                    </div>
                    <div className="ticket-info">
                      <p className="ticket-category">{ticket.categoryName}</p>
                      <p className="ticket-status">
                        Status: <span className="status-badge">{ticket.status}</span>
                      </p>
                      <p className="ticket-time">Diambil: {ticket.takenAt}</p>
                    </div>
                  </div>
                  <div className="ticket-actions">
                    <button className="print-ticket-btn" onClick={() => openPrinterModal(index)} title="Cetak tiket">
                      <Printer size={16} />
                    </button>
                    <button className="cancel-btn" onClick={() => cancelTicket(index)} title="Batalkan antrian">
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {myTickets.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <QrCode size={48} strokeWidth={1} />
            </div>
            <p>Anda belum mengambil antrian</p>
            <p className="empty-subtitle">Pilih kategori layanan di atas untuk mengambil antrian</p>
          </div>
        )}
      </div>

      {/* Printer Selection Modal */}
      {showPrinterModal && selectedTicketIndex !== null && (
        <div className="modal-overlay" onClick={() => setShowPrinterModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Pilih Printer</h3>
              <button className="modal-close" onClick={() => setShowPrinterModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-subtitle">
                Tiket:{" "}
                <strong>
                  {myTickets[selectedTicketIndex].category}
                  {myTickets[selectedTicketIndex].ticketNumber}
                </strong>
              </p>
              <div className="printer-list">
                {printers.map((printer) => (
                  <label key={printer.id} className="printer-option">
                    <input type="radio" name="printer" value={printer.id} checked={selectedPrinter === printer.id} onChange={(e) => setSelectedPrinter(e.target.value)} />
                    <span className="printer-name">{printer.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowPrinterModal(false)}>
                Batal
              </button>
              <button className="btn-print" onClick={handlePrint} disabled={!selectedPrinter}>
                🖨️ Cetak Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueService;
