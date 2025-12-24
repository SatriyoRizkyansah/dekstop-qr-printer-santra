# QR Code Printer Application

## Overview
This is a desktop application built with **Tauri**, **React**, and **Rust** that allows users to generate and print QR codes. The application features a modern login system and an intuitive dashboard for managing multiple printers.

## Features
✨ **Modern Login UI** - Clean, gradient-based login interface
📱 **Responsive Design** - Works seamlessly on different screen sizes
🖨️ **Printer Selection** - Choose from available printers
🔲 **QR Code Generation** - Generate QR codes from text/URL input
👁️ **Live Preview** - Real-time QR code preview before printing
🚀 **Desktop Application** - Full Tauri-powered desktop app

## Tech Stack
- **Frontend**: React 17 + TypeScript + Vite
- **Backend**: Rust + Tauri 2.x
- **Styling**: Modern CSS with gradients
- **Build Tool**: Vite + Cargo

## Project Structure
```
qr-printer-app
├── src/
│   ├── components/
│   │   ├── Login.tsx              # Login screen component
│   │   ├── Login.css              # Login styling
│   │   ├── PrinterSelector.tsx    # Printer selection
│   │   ├── QRInput.tsx            # QR data input
│   │   └── PrintPreview.tsx       # QR preview
│   ├── App.tsx                    # Main app component
│   ├── App.css                    # App styling
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles
├── src-tauri/
│   ├── src/
│   │   ├── main.rs                # Tauri main entry
│   │   ├── printer/               # Printer management
│   │   └── qr/                    # QR code generation
│   ├── Cargo.toml                 # Rust dependencies
│   ├── tauri.conf.json           # Tauri config
│   └── build.rs                   # Build script
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites
- **Rust** (1.70+) - [Install Rust](https://rustup.rs/)
- **Node.js** (16+) - [Install Node.js](https://nodejs.org/)
- **System Libraries** (Linux only):
  ```bash
  sudo apt-get install -y libgtk-3-dev libwebkit2gtk-4.1-dev librsvg2-dev patchelf
  ```

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
Start the development server:
```bash
npm run dev
```

This will compile the Rust backend and start the React frontend on a local dev server.

### Building for Production
Build the desktop application:
```bash
npm run build
```

The compiled application will be available in `src-tauri/target/release/`

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd qr-printer-app
   ```

2. Navigate to the `src-tauri` directory and build the Rust backend:
   ```
   cd src-tauri
   cargo build
   ```

3. Navigate back to the root directory and install the frontend dependencies:
   ```
   cd ..
   npm install
   ```

### Running the Application
To run the application in development mode, execute the following command in the root directory:
```
npm run tauri dev
```

### Usage
1. Enter the data you want to encode in the QR code using the input field.
2. Select a printer from the dropdown list of detected printers.
3. Preview the generated QR code.
4. Click the print button to send the QR code to the selected printer.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.# dekstop-qr-printer
