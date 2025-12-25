from PIL import Image, ImageDraw, ImageFont
import os

# Create a new image with gradient background
def create_gradient_image(width, height, color1, color2):
    """Create an image with a gradient from color1 to color2"""
    image = Image.new('RGBA', (width, height), color1)
    draw = ImageDraw.Draw(image)
    
    # Create gradient
    for y in range(height):
        # Linear interpolation between color1 and color2
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        a = int(color1[3] * (1 - ratio) + color2[3] * ratio)
        
        draw.line([(0, y), (width, y)], fill=(r, g, b, a))
    
    return image

# Colors: Blue to Teal gradient
blue = (61, 132, 167, 255)      # #3D84A7
teal = (70, 205, 207, 255)      # #46CDCF

# Create icon at different sizes
sizes = [256, 128, 64, 32]

for size in sizes:
    # Create gradient image
    img = create_gradient_image(size, size, blue, teal)
    
    # Add rounded corners
    # Create a mask with rounded corners
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    radius = int(size * 0.15)  # 15% of size for radius
    draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=255)
    
    # Apply mask
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0), mask)
    
    # Add "S" text
    try:
        # Try to use a bold system font
        font = ImageFont.truetype("arial.ttf", int(size * 0.65))
    except:
        # Fallback to default font
        font = ImageFont.load_default()
    
    draw = ImageDraw.Draw(output)
    
    # Draw text "S" in white at center
    text = "S"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size - text_width) / 2
    y = (size - text_height) / 2 - (size * 0.05)
    
    draw.text((x, y), text, fill=(255, 255, 255, 255), font=font)
    
    # Save as PNG
    output.save(f'src-tauri/icons/icon-{size}x{size}.png', 'PNG')
    print(f"Created icon-{size}x{size}.png")

# Create ICO file from the 256x256 icon
print("Creating icon.ico from 256x256 image...")

# Load the 256x256 image and resize to create the ICO
base_icon = Image.open('src-tauri/icons/icon-256x256.png')

# Save as ICO (will use 256x256)
base_icon.save('src-tauri/icons/icon.ico', 'ICO')
print("Created icon.ico")

print("All icons created successfully!")
