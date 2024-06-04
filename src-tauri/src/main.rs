// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{SystemTray, SystemTrayMenu};

mod event_handler;

fn main() {
    let system_tray_menu = SystemTrayMenu::new();
    // create 
    tauri::Builder::default()
        .system_tray(SystemTray::new().with_menu(system_tray_menu))
        .on_system_tray_event(|app, event|event_handler::handle_system_tray_event(app, event))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


