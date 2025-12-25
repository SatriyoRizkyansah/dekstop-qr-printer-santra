// This file contains functions to handle the printing process, such as sending print jobs to the selected printer.

use std::process::Command;
use std::io::{self, Write};

pub fn print_qr_code(printer_name: &str, qr_code_path: &str) -> io::Result<()> {
    let output = Command::new("lp")
        .arg("-d")
        .arg(printer_name)
        .arg(qr_code_path)
        .output()?;

    if output.status.success() {
        println!("Print job sent to printer: {}", printer_name);
        Ok(())
    } else {
        let error_message = String::from_utf8_lossy(&output.stderr);
        eprintln!("Failed to print: {}", error_message);
        Err(io::Error::new(io::ErrorKind::Other, "Print job failed"))
    }
}