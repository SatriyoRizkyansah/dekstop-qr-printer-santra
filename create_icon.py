#!/usr/bin/env python3
"""
Create a valid ICO file for Windows Resource Compiler.
This creates a simple black square icon in the format required by RC.EXE
"""

import struct
import os

def create_ico(output_path, size=32):
    """Create a minimal valid ICO file"""
    
    # ICO file header
    ico_header = struct.pack('<HHH',
        0,      # Reserved, must be 0
        1,      # Type: 1 for ICO
        1       # Number of images
    )
    
    # Image directory entry
    width = size
    height = size
    bpp = 32  # bits per pixel
    
    # Calculate sizes
    image_data_size = width * height * 4  # RGBA
    mask_size = ((width + 31) // 32) * 4 * height  # AND mask
    
    # BMP info header size
    bmp_header_size = 40
    total_image_size = bmp_header_size + image_data_size + mask_size
    
    # Image directory entry
    img_dir = struct.pack('<BBBBHHII',
        width if width < 256 else 0,   # Width (0 means 256)
        height if height < 256 else 0,  # Height (0 means 256)
        0,                               # Color palette size
        0,                               # Reserved
        1,                               # Color planes
        bpp,                             # Bits per pixel
        total_image_size,                # Size of image data
        22                               # Offset to image data (after header + dir)
    )
    
    # BMP Info Header (BITMAPINFOHEADER)
    bmp_info = struct.pack('<IiiHHIIiiII',
        40,                 # Header size
        width,              # Width
        height * 2,         # Height (doubled for ICO format)
        1,                  # Planes
        bpp,                # Bits per pixel
        0,                  # Compression (0 = none)
        image_data_size,    # Image size
        0,                  # X pixels per meter
        0,                  # Y pixels per meter
        0,                  # Colors used
        0                   # Important colors
    )
    
    # Create RGBA pixel data (black, fully opaque)
    # Store bottom-up (Windows BMP standard)
    pixel_data = bytearray()
    for y in range(height):
        for x in range(width):
            # BGRA format (little-endian)
            pixel_data.extend([0, 0, 0, 255])  # Black with full alpha
    
    # Create AND mask (all transparent, so all zeros)
    and_mask = bytes(mask_size)
    
    # Write the ICO file
    with open(output_path, 'wb') as f:
        f.write(ico_header)
        f.write(img_dir)
        f.write(bmp_info)
        f.write(pixel_data)
        f.write(and_mask)
    
    print(f"Created {output_path} ({os.path.getsize(output_path)} bytes)")

if __name__ == '__main__':
    output = r'D:\laragon\www\dekstop-qr-printer-santra\src-tauri\icons\icon.ico'
    create_ico(output, size=32)
    print("Icon file created successfully!")
