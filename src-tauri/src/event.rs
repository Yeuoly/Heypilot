use tauri::{App, AppHandle, CustomMenuItem, Manager, SystemTrayMenu};

struct Payload {
    message: String,
}

const EVENT_ADD_ITEM: &str = "add-item";

pub fn mount_event_listener(app: &mut App) {
    let app_handle = app.app_handle();
    app.listen_global(EVENT_ADD_ITEM, move |event| {
        println!("Received event: {:?}", event.payload());

        let menu = SystemTrayMenu::new()
            .add_item(CustomMenuItem::new("item".to_string(), "New Item"));
        let result = app_handle.tray_handle().set_menu(menu);

        if let Err(e) = result {
            eprintln!("Error setting system tray menu: {}", e);
        }
    });
}