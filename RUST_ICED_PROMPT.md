# Rust + Iced QR Printer Native App - Development Prompt

## 📋 Overview

Saya ingin membuat aplikasi desktop native menggunakan Rust + Iced GUI framework dengan fitur queue printer otomatis. Berikut requirements lengkapnya:

---

## 🏗️ ARCHITECTURE & STRUCTURE

### Project Setup

Gunakan `iced` versi terbaru (0.12+) untuk GUI dengan struktur folder berikut:

```
src/
├── main.rs              # Entry point & Application runner
├── app.rs               # Main application state & logic
├── screens/             # Page/Screen components
│   ├── mod.rs
│   ├── login.rs         # Login screen
│   ├── dashboard.rs     # Dashboard/Test QR screen
│   └── queue_service.rs # Queue service screen
├── components/          # Reusable UI components
│   ├── mod.rs
│   ├── card.rs         # Card container component
│   ├── button.rs       # Custom buttons
│   ├── input.rs        # Input fields
│   └── modal.rs        # Modal dialog
├── models/              # Data structures & types
│   ├── mod.rs
│   ├── queue.rs        # Queue/Ticket data model
│   └── printer.rs      # Printer data model
├── services/            # Business logic
│   ├── mod.rs
│   ├── qr_service.rs    # QR code generation logic
│   └── printer_service.rs # Printer operations
├── styles/              # Theme & styling
│   ├── mod.rs
│   ├── colors.rs       # Color palette constants
│   └── theme.rs        # Theme & styling utilities
└── utils/               # Helper functions
    ├── mod.rs
    └── constants.rs    # App-wide constants
```

### Cargo.toml Dependencies

```toml
[package]
name = "qr-printer-iced"
version = "0.1.0"
edition = "2021"

[dependencies]
iced = "0.12"
qrcode = "0.13"
image = "0.24"
chrono = "0.4"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.0", features = ["full"] }
```

---

## 🎨 UI/DESIGN REQUIREMENTS

### Color Palette (Exact dari CSS yang ada)

```rust
// Gunakan di styles/colors.rs
const COLOR_BLUE_500: [f32; 3] = [0.239, 0.518, 0.655];    // #3D84A7
const COLOR_BLUE_600: [f32; 3] = [0.278, 0.275, 0.427];    // #47466D
const COLOR_GREEN_500: [f32; 3] = [0.275, 0.804, 0.812];   // #46CDCF
const COLOR_GREEN_600: [f32; 3] = [0.239, 0.518, 0.655];   // #3D84A7
const COLOR_YELLOW_500: [f32; 3] = [0.671, 0.933, 0.847];  // #ABEED8
const COLOR_YELLOW_600: [f32; 3] = [0.275, 0.804, 0.812];  // #46CDCF
const COLOR_TEAL_500: [f32; 3] = [0.239, 0.518, 0.655];    // #3D84A7
const COLOR_TEAL_600: [f32; 3] = [0.278, 0.275, 0.427];    // #47466D
```

### Screen 1: Login

**Components:**
- Title: "QR Printer App"
- Username input field (optional validation)
- Password input field (min 3 chars validation)
- Login button dengan disabled state saat loading
- Error message display area (jika ada)
- Responsive untuk window resize

**Design:**
- Centered container
- Clean minimal styling
- Gradient background (blue-600 to purple-500)
- White card untuk form
- Smooth transitions

### Screen 2: Dashboard (Test QR)

**Layout:** 2-column grid (responsive)

**Left Column:**
- **Generate QR Section:**
  - Title: "Generate QR Code"
  - Textarea input (placeholder: "Masukkan teks, URL, atau nomor antrian...")
  - Label: "Pilih Printer"
  - Dropdown/Select untuk printer options
  - Generate button (✨ Generate QR)
  - Print button (🖨️ Cetak QR Code) - disabled jika no data

**Right Column:**
- **Preview Section:**
  - QR Code image preview (real-time update)
  - QR data text display
  - Empty state message jika belum generate

**Bottom:**
- **History Section:**
  - Title: "Riwayat Cetak"
  - Scrollable list dengan items (time, data, printer)
  - Empty state jika tidak ada history

- **Statistics Section:**
  - Total Cetak card
  - Printer Aktif card
  - Gradient background untuk cards

**Navigation:**
- Header dengan 2 tabs: Dashboard | Queue Service
- Active tab indicator
- User name display
- Logout button

### Screen 3: Queue Service

**Main Layout:**
- Header dengan title "Sistem Antrian Otomatis"
- **2x2 Grid Layout** untuk 4 kategori:

**Setiap Category Card punya:**
- Circular icon badge (80-90px) dengan color-coded background
- Category title (Pemeriksaan Umum, Kesehatan Ibu dan Anak, etc)
- Service code (Kode: A/B/C/D)
- Colored bar di atas card (matching icon color)
- "Ambil Antrian" button (full width)
- Hover effect (translateY, shadow)

**Queue Categories:**
1. **A** - Pemeriksaan Umum (Blue #3D84A7) - 🏥
2. **B** - Kesehatan Ibu dan Anak (Cyan #46CDCF) - 👶
3. **C** - Kesehatan Gigi dan Mulut (Dark #47466D) - 😁
4. **D** - Keluarga Berencana (Light #ABEED8) - 👨‍👩‍👧

**Current Queue Section:**
- Title: "Antrian Saya"
- List of taken tickets dengan:
  - Large number display (gradient background)
  - Category name
  - Status badge
  - Time taken
  - Print button 🖨️
  - Cancel button ✕

**Modal Printer Selector:**
- Trigger: Saat tombol print di-klik
- Title: "Pilih Printer"
- Show current ticket number
- Radio button list untuk printer options:
  - 🖨️ Printer A (Meja 1)
  - 🖨️ Printer B (Meja 2)
  - 🖨️ Printer C (Lobi)
  - 🖨️ Printer D (Farmasi)
- Cancel button
- "🖨️ Cetak Sekarang" button (disabled jika no printer selected)
- Smooth fade-in animation

---

## 💾 DATA MODELS (models/)

### Queue Model

```rust
// models/queue.rs
#[derive(Debug, Clone)]
pub struct QueueTicket {
    pub category: String,          // A, B, C, D
    pub category_name: String,     // Full name
    pub ticket_number: u32,        // Generated number
    pub status: String,             // "Antri", "Dipanggil", etc
    pub taken_at: String,          // Timestamp
    pub qr_data: String,           // QR code data
}

#[derive(Debug, Clone)]
pub struct QueueCategory {
    pub id: String,                 // A, B, C, D
    pub name: String,
    pub icon: String,              // Emoji
    pub color: [f32; 3],          // RGB color
}

pub fn get_default_categories() -> Vec<QueueCategory> {
    vec![
        QueueCategory {
            id: "A".to_string(),
            name: "Pemeriksaan Umum".to_string(),
            icon: "🏥".to_string(),
            color: [0.239, 0.518, 0.655],
        },
        // ... B, C, D
    ]
}
```

### Printer Model

```rust
// models/printer.rs
#[derive(Debug, Clone)]
pub struct Printer {
    pub id: String,
    pub name: String,
    pub location: String,
}

pub fn get_default_printers() -> Vec<Printer> {
    vec![
        Printer { id: "1".to_string(), name: "Printer A".to_string(), location: "Meja 1".to_string() },
        // ... more printers
    ]
}
```

---

## 🔄 STATE MANAGEMENT

### Main App State

```rust
// app.rs
#[derive(Debug, Clone)]
pub enum Screen {
    Login,
    Dashboard,
    QueueService,
}

#[derive(Debug, Clone)]
pub struct AppState {
    pub screen: Screen,
    pub username: String,
    pub is_loading: bool,
    pub error_message: Option<String>,
    pub queue_tickets: Vec<QueueTicket>,
    pub print_history: Vec<PrintHistoryItem>,
    pub selected_printer: Option<String>,
}

#[derive(Debug, Clone)]
pub enum Message {
    // Login messages
    UsernameChanged(String),
    PasswordChanged(String),
    LoginPressed,
    LoginSuccess,
    LoginFailed(String),
    
    // Navigation
    GoToDashboard,
    GoToQueueService,
    Logout,
    
    // Dashboard messages
    QRDataChanged(String),
    PrinterSelected(String),
    GenerateQR,
    PrintQR,
    
    // Queue messages
    TakeQueue(String),        // category id
    PrintTicket(usize),       // ticket index
    CancelTicket(usize),
    PrinterModalSelected(String),
    ConfirmPrint,
    CancelPrintModal,
}

impl Application for AppState {
    type Message = Message;
    
    fn update(&mut self, message: Message) {
        match message {
            Message::UsernameChanged(name) => { /* ... */ },
            Message::LoginPressed => { /* validate & navigate */ },
            // ... handle other messages
        }
    }
    
    fn view(&self) -> Element<Message> {
        match self.screen {
            Screen::Login => view_login(self),
            Screen::Dashboard => view_dashboard(self),
            Screen::QueueService => view_queue_service(self),
        }
    }
}
```

---

## 🎯 CORE FUNCTIONALITY

### 1. Authentication
- Simple username validation (non-empty)
- Password min 3 chars
- Store username di state setelah login
- Navigate ke Dashboard setelah success

### 2. QR Generation
- Use `qrcode` crate untuk generate QR dari input text
- Display QR image di preview area
- Real-time update saat text berubah

### 3. Queue Management
- Auto-increment ticket number per kategori
- Generate unique QR code per ticket
- Store tickets di state
- Show current queue list

### 4. Printer Selection
- Modal dengan radio button untuk printer selection
- Confirm button untuk trigger print
- Auto-dismiss modal setelah print

### 5. Navigation
- Screen state machine
- Logout clears username dan kembali ke login
- Smooth transitions antar screen

---

## 🎨 STYLING STRATEGY (styles/)

### Theme System

```rust
// styles/theme.rs
pub struct Theme {
    pub primary: Color,
    pub secondary: Color,
    pub success: Color,
    pub error: Color,
    pub background: Color,
    pub surface: Color,
}

impl Theme {
    pub fn default() -> Self {
        Self {
            primary: Color::from_rgb(0.239, 0.518, 0.655),    // Blue 500
            secondary: Color::from_rgb(0.278, 0.275, 0.427),  // Blue 600
            success: Color::from_rgb(0.275, 0.804, 0.812),    // Green 500
            error: Color::from_rgb(1.0, 0.42, 0.42),
            background: Color::from_rgb(0.278, 0.275, 0.427),
            surface: Color::from_rgb(1.0, 1.0, 1.0),
        }
    }
}
```

### Spacing Constants

```rust
// utils/constants.rs
pub const SPACING_XS: u16 = 4;
pub const SPACING_SM: u16 = 8;
pub const SPACING_MD: u16 = 16;
pub const SPACING_LG: u16 = 24;
pub const SPACING_XL: u16 = 32;

pub const CARD_PADDING: u16 = 24;
pub const CARD_BORDER_RADIUS: f32 = 12.0;
pub const BUTTON_HEIGHT: u16 = 44;
pub const INPUT_HEIGHT: u16 = 40;
```

### Component Styling

Use Iced's `appearance()` method untuk custom styling:

```rust
// components/button.rs
pub fn primary_button<'a, Message>(
    label: &'a str,
) -> Button<'a, Message> {
    Button::new(Text::new(label))
        .padding(SPACING_MD)
        .style(primary_button_style)
}

fn primary_button_style(
    state: &button::State,
) -> iced::button::Style {
    iced::button::Style {
        background: Some(Background::Color(Color::from_rgb(0.239, 0.518, 0.655))),
        // ... other properties
    }
}
```

---

## 📐 LAYOUT STRATEGY

### Window Configuration

```rust
// main.rs
fn main() -> iced::Result {
    QRPrinterApp::run(Settings {
        window: window::Settings {
            size: (1400, 900),
            resizable: true,
            // ...
        },
        // ...
    })
}
```

### Responsive Layout

- Use `Column` untuk vertical stacking
- Use `Row` untuk horizontal layout
- Use `Container` dengan `width(Length::Fill)` untuk responsive
- Use `Space` untuk padding/spacing
- Adjust sizes based on window constraints

### Screen Templates

**Full Screen Template:**
```rust
Column::new()
    .push(header_with_nav())
    .push(content_area())
    .spacing(SPACING_LG)
    .padding(SPACING_LG)
```

**Card Template:**
```rust
Container::new(content)
    .padding(CARD_PADDING)
    .style(card_style)
    .border_radius(CARD_BORDER_RADIUS)
```

---

## 📋 IMPLEMENTATION ROADMAP

### Phase 1: Project Setup
```bash
cargo new qr-printer-iced
cd qr-printer-iced
cargo add iced qrcode image
```

Create folder structure dan empty mod.rs files

### Phase 2: Core App Shell
1. **main.rs** - Application runner
2. **app.rs** - State machine & message handler
3. **models/** - Data structures

### Phase 3: Screen Implementation
1. **screens/login.rs** - Login screen
2. **screens/dashboard.rs** - Dashboard screen  
3. **screens/queue_service.rs** - Queue screen

### Phase 4: Components
1. **components/card.rs** - Card container
2. **components/button.rs** - Button styling
3. **components/modal.rs** - Modal dialog
4. **components/input.rs** - Input fields

### Phase 5: Services & Business Logic
1. **services/qr_service.rs** - QR generation
2. **services/printer_service.rs** - Printer logic

### Phase 6: Styling & Polish
1. **styles/colors.rs** - Color constants
2. **styles/theme.rs** - Theme system
3. **utils/constants.rs** - App constants

### Phase 7: Integration & Testing
- Connect all components
- Test all flows
- Performance optimization

---

## ✨ ADDITIONAL REQUIREMENTS

- **Window:** Default 1400x900, resizable, title "QR Printer App - Antrian Otomatis"
- **Animations:** Smooth transitions antar screen
- **Responsive:** Handle window resize gracefully
- **Visual Feedback:** Loading spinners, success messages
- **Error Handling:** User-friendly error messages
- **Icons/Emojis:** Consistent usage throughout
- **Spacing:** Consistent use of spacing constants
- **Accessibility:** Clear labels, good contrast
- **Performance:** Lazy render untuk large lists, efficient state updates

---

## 🔧 CODE QUALITY STANDARDS

### Rust Best Practices
- Use Result<T, E> untuk error handling
- Proper error types, bukan String errors
- Module organization dengan mod.rs
- No unwrap() di production code, use ? operator
- Type-safe implementations
- Follow Rust naming conventions (snake_case)

### Iced Best Practices
- Modularize screens dan components
- Avoid storing UI state in Message
- Use local state untuk temporary UI state
- Memoize expensive computations
- Use into() untuk type conversions

### Documentation
- Add doc comments (///) untuk public functions
- Add comments untuk complex logic
- Include examples di doc comments
- Keep README updated

---

## 📝 NOTES

1. **No Backend Required:** Untuk MVP, semua data disimpan di memory/state
2. **QR Generation:** Gunakan `qrcode` crate, convert ke image, display di Iced
3. **Printer List:** Hardcoded list untuk sekarang, easy to swap dengan actual API later
4. **Modal:** Gunakan overlay container dengan semi-transparent background
5. **Responsive:** Use `Length::Fill` dan `Length::Shrink` smartly
6. **Theme:** Single theme untuk sekarang, easy to add theme switching later

---

## 🚀 Getting Started Commands

```bash
# Create new project
cargo new qr-printer-iced
cd qr-printer-iced

# Add dependencies
cargo add iced qrcode image chrono serde serde_json tokio

# Run development
cargo run

# Build release
cargo build --release
```

---

**Last Updated:** December 24, 2025

Implementasikan sesuai best practices Rust dan Iced framework.
Pastikan code terstruktur baik dan mudah di-extend untuk fitur tambahan nantinya.
