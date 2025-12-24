# QR Code Printer Application

## Overview
This project is a desktop application built using Tauri and Rust that allows users to generate and print QR codes. It supports multiple printers and can detect connected printers, providing a seamless experience for printing QR codes.

## Features
- Generate QR codes from user input.
- Select from multiple connected printers.
- Preview QR codes before printing.
- Detect available printers automatically.

## Project Structure
```
qr-printer-app
├── src-tauri
│   ├── src
│   │   ├── main.rs
│   │   ├── printer
│   │   │   ├── mod.rs
│   │   │   ├── detection.rs
│   │   │   └── printing.rs
│   │   └── qr
│   │       ├── mod.rs
│   │       └── generator.rs
│   ├── tauri.conf.json
│   └── Cargo.toml
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── PrinterSelector.tsx
│   │   ├── QRInput.tsx
│   │   └── PrintPreview.tsx
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites
- Rust and Cargo installed on your machine.
- Node.js and npm installed.
- Tauri CLI installed. You can install it using:
  ```
  cargo install tauri-cli
  ```

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
