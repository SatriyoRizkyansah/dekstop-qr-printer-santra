pub mod detection;
pub mod printing;

// Re-export commonly used items
pub use detection::{Printer, list_connected_printers, check_printer_status};
pub use printing::{TicketData, print_thermal_ticket, print_test_ticket};