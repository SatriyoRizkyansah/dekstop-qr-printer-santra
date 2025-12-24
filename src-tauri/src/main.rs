// src-tauri/src/main.rs

mod printer;
mod qr;

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}