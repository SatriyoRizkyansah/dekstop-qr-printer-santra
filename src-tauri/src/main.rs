// src-tauri/src/main.rs

mod printer;
mod qr;

use printer::detection::{list_connected_printers, Printer};
use printer::printing::{TicketData, print_thermal_ticket, print_test_ticket};

#[tauri::command]
fn list_printers() -> Result<Vec<Printer>, String> {
    list_connected_printers().map_err(|e| e.to_string())
}

#[tauri::command]
fn test_print(printer_name: String) -> Result<String, String> {
    print_test_ticket(&printer_name).map_err(|e| e.to_string())
}

#[tauri::command]
fn print_ticket(printer_name: String, ticket_data: TicketData) -> Result<String, String> {
    print_thermal_ticket(&printer_name, &ticket_data).map_err(|e| e.to_string())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            list_printers, 
            test_print, 
            print_ticket,
            greet
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}