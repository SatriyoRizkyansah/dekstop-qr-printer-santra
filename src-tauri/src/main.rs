// src-tauri/src/main.rs

mod printer;
mod qr;

use printer::detection::{list_connected_printers, Printer};

#[tauri::command]
fn list_printers() -> Result<Vec<Printer>, String> {
    list_connected_printers().map_err(|e| e.to_string())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_printers, greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}