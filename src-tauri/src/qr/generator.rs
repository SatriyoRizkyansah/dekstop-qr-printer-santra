// This file contains functions to generate QR codes based on input data.

use qrcode::{QrCode, Version, EcLevel};

pub fn generate_qr_code(data: &str, _size: u32) -> Result<String, Box<dyn std::error::Error>> {
    let code = QrCode::new(data)?;
    let string = code.render::<char>()
        .quiet_zone(false)
        .module_dimensions(1, 1)
        .build();
    
    Ok(string)
}

pub fn generate_custom_qr_code(data: &str, _size: u32, _version: Version, _ec_level: EcLevel) -> Result<String, Box<dyn std::error::Error>> {
    let code = QrCode::with_version(data.as_bytes(), _version, _ec_level)?;
    let string = code.render::<char>()
        .quiet_zone(false)
        .module_dimensions(1, 1)
        .build();
    
    Ok(string)
}