# Create a minimal valid ICO file
$iconPath = "D:\laragon\www\dekstop-qr-printer-santra\src-tauri\icons\icon.ico"

# Create a minimal 16x16 ICO file structure
$stream = [System.IO.File]::Create($iconPath)

# ICO header
$bytes = @(
    0,0,   # Reserved
    1,0,   # Type (1 = ICO)
    1,0    # Image count
)

# Image directory entry
$bytes += @(
    16,      # Width (16px)
    16,      # Height (16px)
    0,       # Color palette
    0,       # Reserved
    1,0,     # Color planes
    32,0,    # Bits per pixel
    104,4,0,0, # Size of image data
    22,0,0,0   # Offset to image data
)

# BMP Info Header + Image Data (minimal 16x16 black icon)
$bytes += @(40,0,0,0,16,0,0,0,32,0,0,0,1,0,32,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0)

# Image data - fill with black pixels (BGRA format)
for ($i = 0; $i -lt 1024; $i++) {
    $bytes += 0
}

# Mask data (16x16 = 256 pixels, 32 bytes for mask)
for ($i = 0; $i -lt 32; $i++) {
    $bytes += 0
}

$stream.Write($bytes, 0, $bytes.Count)
$stream.Close()

Write-Host "Created valid icon.ico file successfully!"
