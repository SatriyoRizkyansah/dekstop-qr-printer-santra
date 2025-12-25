import React, { useState, useEffect } from "react";
import { Printer, Users, Calendar, Clock, CheckCircle, AlertTriangle, QrCode, FileText, User, Baby, Smile, UserCheck } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
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
  name: string;
  is_default: boolean;
  is_thermal: boolean;
}

interface QueueServiceProps {
  defaultPrinter?: string;
}

const QueueService: React.FC<QueueServiceProps> = ({ defaultPrinter }) => {
  const [myTickets, setMyTickets] = useState<QueueData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");
  const [printers, setPrinters] = useState<PrinterOption[]>([]);
  const [loadingPrinters, setLoadingPrinters] = useState(true);

  const categories = [
    { id: "A", name: "Pemeriksaan Umum", icon: User, color: "#3D84A7" },
    { id: "B", name: "Kesehatan Ibu dan Anak", icon: Baby, color: "#46CDCF" },
    { id: "C", name: "Kesehatan Gigi dan Mulut", icon: Smile, color: "#47466D" },
    { id: "D", name: "Keluarga Berencana (KB)", icon: Users, color: "#ABEED8" },
  ];

  // Load printers on mount
  useEffect(() => {
    loadPrinters();
  }, []);

  // Set default printer if provided
  useEffect(() => {
    if (defaultPrinter && printers.length > 0) {
      setSelectedPrinter(defaultPrinter);
    }
  }, [defaultPrinter, printers]);

  const loadPrinters = async () => {
    try {
      setLoadingPrinters(true);
      const result = await invoke<PrinterOption[]>("list_printers");
      setPrinters(result);
      setLoadingPrinters(false);
    } catch (error) {
      console.error("Failed to load printers:", error);
      setMessage("Gagal memuat daftar printer");
      setLoadingPrinters(false);
    }
  };

  const takeQueue = async (categoryId: string) => {
    if (!selectedPrinter) {
      setMessage("⚠️ Pilih printer terlebih dahulu di pengaturan");
      return;
    }

    setIsLoading(true);
    setMessage("Sedang membuat antrian...");

    // Simulate API call to create ticket
    setTimeout(async () => {
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
        setMessage(`Antrian berhasil dibuat! Nomor: ${qrData}. Sedang mencetak...`);

        // Auto print
        try {
          await invoke("print_ticket", {
            printerName: selectedPrinter,
            ticketData: {
              ticket_number: qrData,
              service_name: category.name,
              queue_number: ticketNumber,
              timestamp: new Date().toISOString(),
              qr_data: qrData,
            },
          });
          setMessage(`✅ Tiket ${qrData} berhasil dicetak ke ${selectedPrinter}!`);
        } catch (error) {
          console.error("Print error:", error);
          setMessage(`⚠️ Tiket ${qrData} dibuat tapi gagal dicetak: ${error}`);
        }
      }
      setIsLoading(false);
    }, 800);
  };

  const reprintTicket = async (index: number) => {
    const ticket = myTickets[index];
    if (!selectedPrinter) {
      setMessage("⚠️ Pilih printer default terlebih dahulu");
      return;
    }

    setMessage(`Sedang mencetak ulang ${ticket.category}${ticket.ticketNumber}...`);

    try {
      await invoke("print_ticket", {
        printerName: selectedPrinter,
        ticketData: {
          ticket_number: `${ticket.category}${ticket.ticketNumber}`,
          service_name: ticket.categoryName,
          queue_number: ticket.ticketNumber,
          timestamp: new Date().toISOString(),
          qr_data: ticket.qrData || `${ticket.category}${ticket.ticketNumber}`,
        },
      });
      setMessage(`✅ Tiket ${ticket.category}${ticket.ticketNumber} berhasil dicetak ulang!`);
    } catch (error) {
      console.error("Reprint error:", error);
      setMessage(`❌ Gagal mencetak ulang: ${error}`);
    }
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
                    <button className="print-ticket-btn" onClick={() => reprintTicket(index)} title="Cetak ulang tiket">
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
    </div>
  );
};

export default QueueService;
