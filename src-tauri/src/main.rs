// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::SystemTray;

mod system_tray;
mod event;
mod entities;
mod screenshot;
mod window;
mod image;

fn main() {
    let system_tray_menu = system_tray::create_system_tray([].to_vec());

    // create 
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            event::mount_event_listener(app);
            Ok(())
        })
        .system_tray(SystemTray::new().with_menu(system_tray_menu))
        .on_system_tray_event(|app, event|system_tray::handle_system_tray_event(app, event))
        .invoke_handler(tauri::generate_handler![
            image::get_image
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


