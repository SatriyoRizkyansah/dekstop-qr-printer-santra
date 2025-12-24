# QR Printer App - Features & UI

## 🎨 User Interface

### Login Screen
- Modern gradient background (purple to violet)
- Clean card-based design
- Username and password fields
- Error message display with animations
- Demo credentials: Any username with password length ≥ 3

### Dashboard
- Header with app title and user info
- Quick logout button
- Two-column layout (form + preview)

## 📝 Main Features

### QR Code Generation
- **Data Input**: Textarea for entering text, URLs, or any data
- **Generate Button**: Creates QR code from input data
- **Real-time Preview**: Shows generated QR code using QR Server API
- **Data Display**: Shows the encoded data below QR code

### Printer Management
- **Printer Selector**: Dropdown list of available printers
- **Mock Printers**: Includes HP, Canon, Epson, and Default
- **Selection Tracking**: Selected printer is used for printing

### Print Functionality
- **Print Button**: Sends QR code to selected printer
- **Validation**: Requires QR code and printer selection
- **Feedback**: Alert confirmation when printing

## 🎯 Component Architecture

### Frontend Components
```
App.tsx (Main Container)
├── Login.tsx (Authentication Screen)
├── Header (with User Info & Logout)
├── QRInput.tsx (Data Input Form)
├── PrinterSelector.tsx (Printer Dropdown)
└── PrintPreview.tsx (QR Code Display)
```

### Styling
- **Login.css**: Login page styling with gradients
- **App.css**: Main application layout and components
- **index.css**: Global styles and resets

## 🔐 Authentication Flow
1. User enters username and password on login screen
2. Simple validation (username required, password ≥ 3 chars)
3. On success, dashboard is displayed
4. User can logout to return to login screen

## 💻 Tauri Integration
- Desktop window management
- Rust backend for future API implementations
- System integration capabilities
- Printer device access (ready for implementation)

## 🚀 Next Steps (Future Enhancements)
- [ ] Real printer detection using Rust backend
- [ ] Actual printing via system print drivers
- [ ] Image format support (PNG, PDF export)
- [ ] Print history and settings
- [ ] Database integration for user management
- [ ] QR code customization (colors, logo, size)
- [ ] Batch QR code generation
- [ ] Print queue management
