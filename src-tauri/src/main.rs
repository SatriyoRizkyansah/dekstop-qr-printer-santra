// src-tauri/src/main.rs

use tauri::{CustomMenuItem, Menu, Submenu, Builder};
use printer::detection::detect_printers;
use printer::printing::print_qr_code;

fn main() {
    let detect_printers_menu = CustomMenuItem::new("detect_printers", "Detect Printers");
    let print_qr_code_menu = CustomMenuItem::new("print_qr_code", "Print QR Code");

    let menu = Menu::new()
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(detect_printers_menu)
                .add_item(print_qr_code_menu),
        ));

    Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "detect_printers" => {
                    let printers = detect_printers();
                    // Handle the detected printers (e.g., send to frontend)
                }
                "print_qr_code" => {
                    // Logic to print QR code
                    print_qr_code("Sample QR Code Data");
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}