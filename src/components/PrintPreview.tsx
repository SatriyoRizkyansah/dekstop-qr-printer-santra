import React from "react";
import { TicketData } from "../types/ticket";
import "./PrintPreview.css";

interface PrintPreviewProps {
  ticket: TicketData;
  onClose: () => void;
  onPrint: () => void;
  isPrinting: boolean;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({ ticket, onClose, onPrint, isPrinting }) => {
  return (
    <div className="print-preview-overlay" onClick={onClose}>
      <div className="print-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Preview Tiket</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="ticket-preview">
            {/* Thermal Receipt Preview */}
            <div className="thermal-receipt">
              <div className="receipt-header">
                <h1>TIKET ANTRIAN</h1>
                <p className="location">{ticket.location}</p>
              </div>

              <div className="receipt-divider">--------------------------------</div>

              <div className="ticket-number-section">
                <div className="ticket-number">{ticket.ticket_number}</div>
              </div>

              <div className="service-info">
                <p className="service-type">{ticket.service_type}</p>
                <p className="timestamp">{ticket.timestamp}</p>
              </div>

              <div className="qr-section">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(ticket.qr_data)}&size=200x200&margin=10`}
                  alt="QR Code"
                  className="qr-code"
                />
              </div>

              <div className="receipt-divider">--------------------------------</div>

              <div className="receipt-footer">
                <p>* Simpan tiket hingga dipanggil</p>
                <p>* Anda akan dipanggil sesuai</p>
                <p>  dengan cara scanning QR Code</p>
                <p>* Harap menunggu di area</p>
                <p>  tunggu</p>
              </div>
            </div>
          </div>

          <div className="ticket-details">
            <h3>Detail Tiket</h3>
            <div className="detail-grid">
              <div className="detail-row">
                <span className="detail-label">Nomor Antrian:</span>
                <span className="detail-value">{ticket.ticket_number}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Lokasi:</span>
                <span className="detail-value">{ticket.location}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Layanan:</span>
                <span className="detail-value">{ticket.service_type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Waktu:</span>
                <span className="detail-value">{ticket.timestamp}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">QR Data:</span>
                <span className="detail-value qr-data">{ticket.qr_data}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isPrinting}>
            Batal
          </button>
          <button className="btn-primary" onClick={onPrint} disabled={isPrinting}>
            {isPrinting ? (
              <>
                <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" opacity="0.25"/>
                  <path d="M12 2a10 10 0 0110 10" opacity="0.75"/>
                </svg>
                Mencetak...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z"/>
                </svg>
                Cetak Sekarang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;
