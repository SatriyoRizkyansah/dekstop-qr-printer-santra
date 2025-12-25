export interface TicketData {
  ticket_number: string;
  location: string;
  service_type: string;
  timestamp: string;
  qr_data: string;
}

export interface PrintResult {
  success: boolean;
  message: string;
}

export interface ApiQueueData {
  // Structure untuk data dari API nanti
  queue_number: string;
  department: string;
  patient_name?: string;
  service_type: string;
  created_at: string;
  // Tambahkan field lain sesuai kebutuhan API
}

export function mapApiToTicket(apiData: ApiQueueData): TicketData {
  // Function untuk convert data dari API ke format TicketData
  return {
    ticket_number: apiData.queue_number,
    location: apiData.department || "RS Contoh",
    service_type: apiData.service_type,
    timestamp: apiData.created_at,
    qr_data: `QUEUE-${apiData.queue_number}-${Date.now()}`,
  };
}

export function generateTestTicket(): TicketData {
  const now = new Date();
  const ticketNum = `A${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;

  return {
    ticket_number: ticketNum,
    location: "RS Contoh",
    service_type: "Pemeriksaan Umum",
    timestamp: now
      .toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", ""),
    qr_data: `TEST-${ticketNum}-${now.getTime()}`,
  };
}
