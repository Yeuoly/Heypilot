use tauri::{AppHandle, SystemTrayEvent};

pub fn handle_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick { position, .. } => {
            println!("Left click on the tray icon");
        }
        _ => {}
    }
}