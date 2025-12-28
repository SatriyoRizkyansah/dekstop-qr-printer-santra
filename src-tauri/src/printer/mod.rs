pub mod detection;
pub mod printing;

// Re-export commonly used items
#[allow(unused_imports)]
pub use detection::{Printer, list_connected_printers, check_printer_status};
#[allow(unused_imports)]
pub use printing::{TicketData, print_thermal_ticket, print_test_ticket};