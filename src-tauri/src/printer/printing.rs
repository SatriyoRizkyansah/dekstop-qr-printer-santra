// This file contains functions to handle thermal receipt printing

use std::fs::File;
use std::io::{self, Write};

#[cfg(not(target_os = "windows"))]
use std::process::Command;

use serde::{Deserialize, Serialize};
use chrono::Local;

#[cfg(target_os = "windows")]
use std::{
    ffi::{c_void, OsStr},
    os::windows::ffi::OsStrExt,
};

#[cfg(target_os = "windows")]
use windows::{
    core::{PCWSTR, PWSTR},
    Win32::{
        Foundation::HANDLE,
        Graphics::Printing::{
            ClosePrinter, DOC_INFO_1W, EndDocPrinter, EndPagePrinter, OpenPrinterW,
            StartDocPrinterW, StartPagePrinter, WritePrinter,
        },
    },
};

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

        // Keep a temp copy for troubleshooting but never fail the job if this falls over
        let _ = persist_receipt_copy(&receipt);

        // Push the ESC/POS payload straight to the Windows print spooler as RAW data
        send_raw_to_printer(printer_name, receipt.as_bytes())?;

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

#[cfg(target_os = "windows")]
fn persist_receipt_copy(content: &str) -> io::Result<()> {
    let path = std::env::temp_dir().join("temp_receipt.txt");
    let mut file = File::create(path)?;
    file.write_all(content.as_bytes())
}

#[cfg(target_os = "windows")]
struct PrinterHandle(HANDLE);

#[cfg(target_os = "windows")]
impl Drop for PrinterHandle {
    fn drop(&mut self) {
        unsafe {
            if self.0 != HANDLE::default() {
                ClosePrinter(self.0);
            }
        }
    }
}

#[cfg(target_os = "windows")]
fn to_wide_null(value: &str) -> Vec<u16> {
    OsStr::new(value)
        .encode_wide()
        .chain(std::iter::once(0))
        .collect()
}

#[cfg(target_os = "windows")]
fn send_raw_to_printer(printer_name: &str, data: &[u8]) -> io::Result<()> {
    let printer_wide = to_wide_null(printer_name);
    let mut handle = HANDLE::default();

    unsafe {
        OpenPrinterW(PCWSTR(printer_wide.as_ptr()), &mut handle, None)
            .map_err(|err| io::Error::new(io::ErrorKind::Other, err.to_string()))?;
    }

    let handle_guard = PrinterHandle(handle);
    let doc_name = to_wide_null("QR Ticket");
    let data_type = to_wide_null("RAW");

    let doc_info = DOC_INFO_1W {
        pDocName: PWSTR(doc_name.as_ptr() as *mut _),
        pOutputFile: PWSTR::null(),
        pDatatype: PWSTR(data_type.as_ptr() as *mut _),
    };

    unsafe {
        if StartDocPrinterW(handle_guard.0, 1, &doc_info) == 0 {
            return Err(io::Error::last_os_error());
        }

        if !StartPagePrinter(handle_guard.0).as_bool() {
            EndDocPrinter(handle_guard.0);
            return Err(io::Error::last_os_error());
        }

        let mut bytes_written = 0u32;
        let write_ok = WritePrinter(
            handle_guard.0,
            data.as_ptr() as *const c_void,
            data.len() as u32,
            &mut bytes_written,
        )
        .as_bool();

        if !write_ok || bytes_written != data.len() as u32 {
            EndPagePrinter(handle_guard.0);
            EndDocPrinter(handle_guard.0);
            return Err(io::Error::last_os_error());
        }

        if !EndPagePrinter(handle_guard.0).as_bool() {
            EndDocPrinter(handle_guard.0);
            return Err(io::Error::last_os_error());
        }

        if !EndDocPrinter(handle_guard.0).as_bool() {
            return Err(io::Error::last_os_error());
        }
    }

    Ok(())
}

pub fn print_test_ticket(printer_name: &str) -> io::Result<String> {
    let test_ticket = TicketData::default();
    print_thermal_ticket(printer_name, &test_ticket)
}
