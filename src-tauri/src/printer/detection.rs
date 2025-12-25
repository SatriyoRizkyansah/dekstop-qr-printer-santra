// This file contains functions to detect connected printers from the OS

use serde::{Deserialize, Serialize};
use std::io;
use std::process::Command;

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Printer {
    pub name: String,
    pub driver: String,
    pub port: String,
    pub status: String,
    pub is_thermal: bool,
}

pub fn list_connected_printers() -> io::Result<Vec<Printer>> {
    let mut printers = Vec::new();

    #[cfg(target_os = "windows")]
    {
        // Use PowerShell to get Windows printers
        let output = Command::new("powershell")
            .args(&[
                "-Command",
                "Get-Printer | Select-Object Name,DriverName,PortName,PrinterStatus | ConvertTo-Json"
            ])
            .creation_flags(0x08000000) // CREATE_NO_WINDOW flag
            .output()?;

        if output.status.success() {
            let json_str = String::from_utf8_lossy(&output.stdout);
            
            // Parse JSON - handle both single object and array
            if let Ok(printer_data) = serde_json::from_str::<serde_json::Value>(&json_str) {
                let printer_array = if printer_data.is_array() {
                    printer_data.as_array().unwrap().clone()
                } else {
                    vec![printer_data]
                };

                for printer in printer_array {
                    let name = printer["Name"].as_str().unwrap_or("Unknown").to_string();
                    let driver = printer["DriverName"].as_str().unwrap_or("Unknown").to_string();
                    let port = printer["PortName"].as_str().unwrap_or("Unknown").to_string();
                    let status_code = printer["PrinterStatus"].as_i64().unwrap_or(0);
                    
                    let status = match status_code {
                        0 => "Ready",
                        1 => "Paused",
                        2 => "Error",
                        3 => "Deleting",
                        4 => "Paper Jam",
                        5 => "Paper Out",
                        _ => "Unknown",
                    }.to_string();

                    // Detect thermal printers by name or driver
                    let is_thermal = is_thermal_printer(&name, &driver, &port);

                    printers.push(Printer {
                        name,
                        driver,
                        port,
                        status,
                        is_thermal,
                    });
                }
            }
        }
    }

    #[cfg(target_os = "linux")]
    {
        // Use lpstat for Linux
        let output = Command::new("lpstat").args(&["-p", "-d"]).output()?;

        if output.status.success() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                if line.starts_with("printer") {
                    let parts: Vec<&str> = line.split_whitespace().collect();
                    if parts.len() >= 2 {
                        let name = parts[1].to_string();
                        let is_thermal = is_thermal_printer(&name, "", "");
                        
                        printers.push(Printer {
                            name: name.clone(),
                            driver: "System Default".to_string(),
                            port: "USB/Network".to_string(),
                            status: "Ready".to_string(),
                            is_thermal,
                        });
                    }
                }
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        // Use lpstat for macOS
        let output = Command::new("lpstat").args(&["-p"]).output()?;

        if output.status.success() {
            let stdout = String::from_utf8_lossy(&output.stdout);
            for line in stdout.lines() {
                if line.starts_with("printer") {
                    let parts: Vec<&str> = line.split_whitespace().collect();
                    if parts.len() >= 2 {
                        let name = parts[1].to_string();
                        let is_thermal = is_thermal_printer(&name, "", "");
                        
                        printers.push(Printer {
                            name: name.clone(),
                            driver: "System Default".to_string(),
                            port: "USB/Network".to_string(),
                            status: "Ready".to_string(),
                            is_thermal,
                        });
                    }
                }
            }
        }
    }

    Ok(printers)
}

fn is_thermal_printer(name: &str, driver: &str, port: &str) -> bool {
    let name_lower = name.to_lowercase();
    let driver_lower = driver.to_lowercase();
    let port_lower = port.to_lowercase();

    // Common thermal printer brands and models
    let thermal_keywords = [
        "thermal", "receipt", "pos", "epson tm", "star tsp",
        "zebra", "citizen", "bixolon", "rongta", "xprinter",
        "sunmi", "custom", "snbc", "sam4s", "partner",
        "80mm", "58mm", "rp80", "rp326", "tsp100", "tsp650",
        "tsp700", "tsp800", "zj", "usb\\vid_0519", // Epson VID
        "usb\\vid_0fe6", // ICS VID (Star)
    ];

    thermal_keywords.iter().any(|keyword| {
        name_lower.contains(keyword) || 
        driver_lower.contains(keyword) ||
        port_lower.contains(keyword)
    })
}

pub fn check_printer_status(printer_name: &str) -> io::Result<String> {
    #[cfg(target_os = "windows")]
    {
        let output = Command::new("powershell")
            .args(&[
                "-Command",
                &format!("(Get-Printer -Name '{}').PrinterStatus", printer_name)
            ]creation_flags(0x08000000) // CREATE_NO_WINDOW flag
            .)
            .output()?;

        if output.status.success() {
            let status_code = String::from_utf8_lossy(&output.stdout)
                .trim()
                .parse::<i32>()
                .unwrap_or(0);

            let status = match status_code {
                0 => "Ready",
                1 => "Paused",
                2 => "Error",
                3 => "Deleting",
                4 => "Paper Jam",
                5 => "Paper Out",
                _ => "Unknown",
            };

            return Ok(status.to_string());
        }
    }

    Ok("Unknown".to_string())
}