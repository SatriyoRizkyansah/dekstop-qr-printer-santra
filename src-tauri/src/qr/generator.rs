// This file contains functions to generate QR codes based on input data.

use qrcode::QrCode;

pub fn generate_qr_code(data: &str, _size: u32) -> Result<String, Box<dyn std::error::Error>> {
    let code = QrCode::new(data)?;
    let string = code.render::<char>()
        .quiet_zone(false)
        .module_dimensions(1, 1)
        .build();
    
    Ok(string)
}

pub fn generate_qr_svg(data: &str) -> Result<String, Box<dyn std::error::Error>> {
    let code = QrCode::new(data)?;
    
    // For now, just return the data
    // The actual QR rendering will be done by the frontend using QR server API
    Ok(data.to_string())
}