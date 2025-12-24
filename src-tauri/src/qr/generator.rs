// This file contains functions to generate QR codes based on input data.
// It may include methods to customize QR code appearance and size.

use qrcode::{QrCode, Version, EcLevel};
use image::Luma;

pub fn generate_qr_code(data: &str, size: u32) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let code = QrCode::with_version(data.as_bytes(), Version::Normal(1), EcLevel::L)?;
    let image = code.render::<Luma<u8>>().build();
    
    let mut buffer: Vec<u8> = Vec::new();
    image.save(&mut buffer, image::ImageFormat::Png)?;
    
    Ok(buffer)
}

pub fn generate_custom_qr_code(data: &str, size: u32, version: Version, ec_level: EcLevel) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
    let code = QrCode::with_version(data.as_bytes(), version, ec_level)?;
    let image = code.render::<Luma<u8>>().build();
    
    let mut buffer: Vec<u8> = Vec::new();
    image.save(&mut buffer, image::ImageFormat::Png)?;
    
    Ok(buffer)
}