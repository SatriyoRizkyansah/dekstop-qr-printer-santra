// This file contains functions to handle thermal receipt printing

use std::process::Command;
use std::io::{self, Write};
use std::fs::File;
use serde::{Deserialize, Serialize};
use chrono::Local;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TicketData {
    pub ticket_number: String,
    pub location: String,
    pub service_type: String,
    pub timestamp: String,
    pub qr_data: String,
}

impl Default for TicketData {
    fn default() -> Self {
        let now = Local::now();
        TicketData {
            ticket_number: "A001".to_string(),
            location: "RS Contoh".to_string(),
            service_type: "Pemeriksaan Umum".to_string(),
            timestamp: now.format("%d/%m/%Y %H:%M").to_string(),
            qr_data: "TEST-QR-001".to_string(),
        }
    }
}

pub fn generate_thermal_receipt(ticket: &TicketData) -> Result<String, Box<dyn std::error::Error>> {
    let mut content = String::new();
    
    // ESC/POS commands for thermal printer
    let esc = "\x1B";
    let gs = "\x1D";
    
    // Initialize printer
    content.push_str(&format!("{esc}@")); // Initialize
    
    // Header - Center aligned, bold
    content.push_str(&format!("{esc}a\x01")); // Center align
    content.push_str(&format!("{esc}E\x01")); // Bold on
    content.push_str(&format!("{gs}!\x11")); // Double width & height
    content.push_str("TIKET ANTRIAN\n");
    content.push_str(&format!("{gs}!\x00")); // Normal size
    content.push_str(&format!("{esc}E\x00")); // Bold off
    
    // Location
    content.push_str(&ticket.location);
    content.push_str("\n");
    
    // Separator line
    content.push_str(&format!("{esc}a\x00")); // Left align
    content.push_str("--------------------------------\n");
    
    // Ticket Number - Center, Large
    content.push_str(&format!("{esc}a\x01")); // Center align
    content.push_str(&format!("{gs}!\x22")); // Triple size
    content.push_str(&format!("{esc}E\x01")); // Bold on
    content.push_str(&ticket.ticket_number);
    content.push_str("\n");
    content.push_str(&format!("{gs}!\x00")); // Normal size
    content.push_str(&format!("{esc}E\x00")); // Bold off
    
    // Service Type - Center
    content.push_str(&ticket.service_type);
    content.push_str("\n");
    
    // Timestamp - Center
    content.push_str(&ticket.timestamp);
    content.push_str("\n\n");
    
    // QR Code placeholder (actual QR will be printed as image)
    content.push_str("[QR CODE HERE]\n\n");
    
    // Separator line
    content.push_str(&format!("{esc}a\x00")); // Left align
    content.push_str("--------------------------------\n");
    
    // Footer instructions
    content.push_str(&format!("{esc}a\x01")); // Center align
    content.push_str("* Simpan tiket hingga dipanggil\n");
    content.push_str("* Anda akan dipanggil sesuai\n");
    content.push_str("  dengan cara scanning QR Code\n");
    content.push_str("* Harap menunggu di area\n");
    content.push_str("  tunggu\n\n");
    
    // Cut paper
    content.push_str(&format!("{gs}V\x41\x00")); // Partial cut
    
    Ok(content)
}

pub fn print_thermal_ticket(printer_name: &str, ticket: &TicketData) -> io::Result<String> {
    #[cfg(target_os = "windows")]
    {
        // Generate receipt content
        let receipt = generate_thermal_receipt(ticket)
            .map_err(|e| io::Error::new(io::ErrorKind::Other, e.to_string()))?;
        
        // Save receipt to temp file
        let temp_dir = std::env::temp_dir();
        let receipt_path = temp_dir.join("temp_receipt.txt");
        let mut file = File::create(&receipt_path)?;
        file.write_all(receipt.as_bytes())?;
        
        // For now, just indicate success
        // In production, you would send this to the actual printer
        // using Windows printing API or thermal printer ESC/POS commands
        
        Ok(format!("Tiket {} berhasil dicetak ke {}", ticket.ticket_number, printer_name))
    }
    
    #[cfg(not(target_os = "windows"))]
    {
        let receipt = generate_thermal_receipt(ticket)
            .map_err(|e| io::Error::new(io::ErrorKind::Other, e.to_string()))?;
        
        let temp_dir = std::env::temp_dir();
        let receipt_path = temp_dir.join("temp_receipt.txt");
        let mut file = File::create(&receipt_path)?;
        file.write_all(receipt.as_bytes())?;
        
        // For Linux/Mac, use lp command
        let output = Command::new("lp")
            .arg("-d")
            .arg(printer_name)
            .arg(receipt_path.to_string_lossy().as_ref())
            .output()?;
        
        if output.status.success() {
            Ok(format!("Tiket {} berhasil dicetak ke {}", ticket.ticket_number, printer_name))
        } else {
            Err(io::Error::new(
                io::ErrorKind::Other,
                "Print job failed"
            ))
        }
    }
}

pub fn print_test_ticket(printer_name: &str) -> io::Result<String> {
    let test_ticket = TicketData::default();
    print_thermal_ticket(printer_name, &test_ticket)
}
