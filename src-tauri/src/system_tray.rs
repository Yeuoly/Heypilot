use tauri::{AppHandle, CustomMenuItem, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem};

pub fn handle_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick { position, .. } => {
            // add new item to the menu
            let handle = app.tray_handle();
            let system_tray_menu = create_system_tray();
            let result = handle.set_menu(system_tray_menu);
            if let Err(e) = result {
                eprintln!("Error setting system tray menu: {}", e);
            }
        }
        _ => {}
    }
}

pub fn create_system_tray() -> SystemTrayMenu {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let system_tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide);

    system_tray_menu
}